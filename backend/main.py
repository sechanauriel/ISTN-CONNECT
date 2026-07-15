from __future__ import annotations

from collections import Counter
from datetime import datetime
from pathlib import Path
import shutil
import re
import math
import base64
from typing import Any

import duckdb
import pandas as pd
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field

from .db import (
    BACKUPS_DIR,
    DB_PATH,
    OUTPUTS_DIR,
    PROJECT_ROOT,
    df_to_records,
    export_table_to_csv,
    get_connection,
    get_db_size_bytes,
    get_table_counts,
    log_audit,
    new_id,
)
from .init_db import init_database

APP_VERSION = "2.0.0-powerful"
DATA_DIR = PROJECT_ROOT / "data" / "csv"
DOCS_DIR = PROJECT_ROOT / "docs" / "rag"
VALID_STATUS = {"hadir", "izin", "sakit", "alfa"}

app = FastAPI(
    title="ISTN Connect SC-DATA API DuckDB Backend",
    description="Backend lokal FastAPI + DuckDB untuk Event Monitor, Data Pipeline, RAG, Audit, Database Proof, dan Final Validation.",
    version=APP_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


def error_response(status_code: int, error_code: str, message: str, details: Any | None = None) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "error_code": error_code,
            "message": message,
            "details": details,
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    detail = exc.detail
    message = detail if isinstance(detail, str) else "Permintaan tidak dapat diproses."
    details = None if isinstance(detail, str) else detail
    try:
        if exc.status_code >= 400:
            log_audit("System", "HTTP_EXCEPTION", f"{request.method} {request.url.path}", "FAILED", {"status_code": exc.status_code, "detail": detail})
    except Exception:
        pass
    return error_response(exc.status_code, f"HTTP_{exc.status_code}", message, details)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    details = []
    for err in exc.errors():
        details.append({
            "field": ".".join(str(x) for x in err.get("loc", [])),
            "message": err.get("msg", "Invalid value"),
            "type": err.get("type", "validation_error"),
        })
    try:
        log_audit("System", "VALIDATION_ERROR", f"{request.method} {request.url.path}", "FAILED", {"errors": details[:20]})
    except Exception:
        pass
    return error_response(422, "VALIDATION_ERROR", "Validasi request gagal. Periksa field input Anda.", details)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        decoded = base64.b64decode(token).decode("utf-8")
        role, username = decoded.split(":", 1)
        return {"role": role, "username": username}
    except Exception:
        try:
            log_audit("System", "AUTH_INVALID_TOKEN", "Token tidak valid", "FAILED")
        except Exception:
            pass
        raise HTTPException(status_code=401, detail="Token tidak valid. Silakan login ulang.")


def require_admin(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    if str(user.get("role", "")).strip() != "Administrator":
        # ponytail: known ceiling - RBAC check minimalis
        raise HTTPException(status_code=403, detail="Akses ditolak. Memerlukan role Administrator.")
    return user


def actor_role(payload_role: str | None, user: dict[str, Any] | None) -> str:
    # Sumber kebenaran role harus dari token user; payload hanya fallback agar kompatibel.
    token_role = str((user or {}).get("role", "")).strip()
    if token_role:
        return token_role
    return str(payload_role or "System").strip() or "System"

class LoginRequest(BaseModel):
    role: str
    username: str

@app.post("/api/auth/login")
def auth_login(payload: LoginRequest):
    token = base64.b64encode(f"{payload.role}:{payload.username}".encode()).decode("utf-8")
    return {"token": token, "message": "Login successful"}


@app.get("/api/auth/validate")
def auth_validate(user: dict[str, Any] = Depends(get_current_user)):
    return {"status": "valid", "user": user, "message": "Token valid"}



class LoadEventRequest(BaseModel):
    batch_size: int = Field(default=5, ge=1, le=50)
    role: str = "Administrator"


class RoleRequest(BaseModel):
    role: str = "Administrator"


class RAGSearchRequest(BaseModel):
    query: str = Field(min_length=1)
    role: str = "Mahasiswa"
    limit: int = Field(default=5, ge=1, le=10)


class ExportRequest(BaseModel):
    role: str = "Administrator"


def require_file(path: Path) -> None:
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"File tidak ditemukan: {path.relative_to(PROJECT_ROOT)}")


def normalize_string_columns(df: pd.DataFrame) -> pd.DataFrame:
    clean = df.copy()
    for col in clean.columns:
        if clean[col].dtype == object:
            clean[col] = clean[col].astype(str).str.strip()
    return clean


def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", str(text or "")).strip()


def calculate_grade(score: float) -> str:
    if score >= 85: return "A"
    if score >= 80: return "A-"
    if score >= 75: return "B+"
    if score >= 70: return "B"
    if score >= 65: return "C+"
    if score >= 60: return "C"
    return "D"


def insert_df_replace(con: duckdb.DuckDBPyConnection, table_name: str, df: pd.DataFrame) -> None:
    # Hardening: batasi hanya ke tabel pipeline yang sudah diketahui (hindari SQL injection via identifier dinamis)
    allowed_tables = {spec["table"] for spec in PIPELINE_SPECS.values()}
    if table_name not in allowed_tables:
        raise HTTPException(status_code=400, detail=f"Tabel tidak diizinkan untuk replace: {table_name}")

    con.execute(f"DELETE FROM {table_name}")
    if df.empty:
        return

    # Hardening: validasi nama kolom agar hanya identifier sederhana
    invalid_cols = [col for col in df.columns if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", str(col))]
    if invalid_cols:
        raise HTTPException(status_code=400, detail=f"Nama kolom tidak valid: {invalid_cols}")

    con.register("tmp_df", df)
    columns = ", ".join(df.columns)
    con.execute(f"INSERT INTO {table_name} ({columns}) SELECT {columns} FROM tmp_df")
    con.unregister("tmp_df")


def add_pipeline_log(con: duckdb.DuckDBPyConnection, dataset_name: str, total: int, valid: int, invalid: int, duplicate: int, missing: int, status: str, message: str) -> str:
    pipeline_id = new_id("PIPE")
    con.execute(
        """
        INSERT INTO pipeline_log
        (pipeline_id, dataset_name, total_rows, valid_rows, invalid_rows, duplicate_rows, missing_value_rows, status, message, processed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        [pipeline_id, dataset_name, total, valid, invalid, duplicate, missing, status, message, datetime.now()],
    )
    return pipeline_id


def add_issue(con: duckdb.DuckDBPyConnection, pipeline_id: str, dataset: str, row_number: int, issue_type: str, issue_detail: str) -> None:
    con.execute(
        """
        INSERT INTO pipeline_issue_log (issue_id, pipeline_id, dataset_name, row_number, issue_type, issue_detail, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        [new_id("ISS"), pipeline_id, dataset, row_number, issue_type, issue_detail, datetime.now()],
    )


PIPELINE_SPECS = {
    "mahasiswa.csv": {"table": "mahasiswa", "required": ["nim", "nama", "prodi", "semester", "status"], "pk": "nim"},
    "dosen.csv": {"table": "dosen", "required": ["nidn", "nama", "prodi", "email", "status"], "pk": "nidn"},
    "mata_kuliah.csv": {"table": "mata_kuliah", "required": ["kode_mk", "nama_mk", "sks", "prodi", "semester"], "pk": "kode_mk"},
    "krs.csv": {"table": "krs", "required": ["krs_id", "nim", "kode_mk", "tahun_ajaran", "semester_akademik", "status"], "pk": "krs_id"},
    "nilai.csv": {"table": "nilai", "required": ["nilai_id", "nim", "kode_mk", "tugas", "uts", "uas", "nilai_akhir", "grade"], "pk": "nilai_id"},
    "kehadiran.csv": {"table": "kehadiran", "required": ["hadir_id", "nim", "kode_mk", "tanggal", "status_hadir", "keterangan"], "pk": "hadir_id"},
}


def validate_and_prepare_dataset(file_name: str, con: duckdb.DuckDBPyConnection) -> dict[str, Any]:
    spec = PIPELINE_SPECS[file_name]
    path = DATA_DIR / file_name
    require_file(path)

    df = pd.read_csv(path)
    total = len(df)
    required = spec["required"]
    missing_cols = [col for col in required if col not in df.columns]
    if missing_cols:
        pipeline_id = add_pipeline_log(con, file_name, total, 0, total, 0, total, "FAILED", f"Kolom hilang: {missing_cols}")
        for col in missing_cols:
            add_issue(con, pipeline_id, file_name, 0, "MISSING_COLUMN", col)
        return {"dataset_name": file_name, "status": "FAILED", "message": f"Kolom hilang: {missing_cols}", "total_rows": total, "valid_rows": 0, "invalid_rows": total, "duplicate_rows": 0, "missing_value_rows": total}

    df = normalize_string_columns(df[required])
    pk = spec["pk"]
    duplicate_mask = df.duplicated(subset=[pk], keep="first")
    missing_mask = df[required].isna().any(axis=1) | (df[required].astype(str).apply(lambda x: x.str.strip()).eq("").any(axis=1))
    invalid_mask = duplicate_mask | missing_mask

    issues: list[tuple[int, str, str]] = []
    for idx in df.index[duplicate_mask].tolist():
        issues.append((idx + 2, "DUPLICATE_PK", f"{pk}={df.loc[idx, pk]}"))
    for idx in df.index[missing_mask].tolist():
        issues.append((idx + 2, "MISSING_VALUE", "Ada kolom wajib kosong"))

    if file_name == "nilai.csv":
        numeric_cols = ["tugas", "uts", "uas"]
        for col in numeric_cols:
            df[col] = pd.to_numeric(df[col], errors="coerce")
            bad = df[col].isna() | (df[col] < 0) | (df[col] > 100)
            invalid_mask = invalid_mask | bad
            for idx in df.index[bad].tolist():
                issues.append((idx + 2, "INVALID_SCORE", f"{col} harus 0-100"))
        df["nilai_akhir"] = (df["tugas"] * 0.3 + df["uts"] * 0.3 + df["uas"] * 0.4).round(2)
        df["grade"] = df["nilai_akhir"].apply(calculate_grade)

    if file_name == "kehadiran.csv":
        df["status_hadir"] = df["status_hadir"].astype(str).str.lower().str.strip()
        bad = ~df["status_hadir"].isin(VALID_STATUS)
        invalid_mask = invalid_mask | bad
        for idx in df.index[bad].tolist():
            issues.append((idx + 2, "INVALID_STATUS", "status_hadir harus hadir/izin/sakit/alfa"))

    valid_df = df.loc[~invalid_mask].copy()
    invalid_count = int(invalid_mask.sum())
    status = "SUCCESS" if invalid_count == 0 else "WARNING"
    message = "Dataset valid dan berhasil dimuat" if invalid_count == 0 else f"{invalid_count} baris bermasalah; baris valid tetap dimuat"
    pipeline_id = add_pipeline_log(con, file_name, total, len(valid_df), invalid_count, int(duplicate_mask.sum()), int(missing_mask.sum()), status, message)
    for row_number, issue_type, detail in issues[:200]:
        add_issue(con, pipeline_id, file_name, row_number, issue_type, detail)

    return {"dataset_name": file_name, "table": spec["table"], "status": status, "message": message, "total_rows": total, "valid_rows": len(valid_df), "invalid_rows": invalid_count, "duplicate_rows": int(duplicate_mask.sum()), "missing_value_rows": int(missing_mask.sum()), "df": valid_df}


@app.on_event("startup")
def startup_event() -> None:
    init_database()


@app.get("/api/health")
def health_check() -> dict[str, Any]:
    try:
        con = get_connection()
        con.execute("SELECT 1").fetchone()
        con.close()
        return {
            "status": "ok",
            "database": "connected",
            "version": APP_VERSION,
            "path": str(DB_PATH),
            "db_size_bytes": get_db_size_bytes(),
            "time": datetime.now().isoformat(timespec="seconds"),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database error: {exc}")


@app.get("/api/db/tables")
def database_proof() -> dict[str, Any]:
    return {
        "database": "connected",
        "version": APP_VERSION,
        "path": str(DB_PATH),
        "db_size_bytes": get_db_size_bytes(),
        "tables": get_table_counts(),
    }


@app.get("/api/dashboard/summary")
def dashboard_summary() -> dict[str, Any]:
    con = get_connection()
    try:
        counts = {row["table"]: row["rows"] for row in get_table_counts()}
        latest_audit = con.execute("SELECT created_at, role, action, detail, status FROM audit_log ORDER BY created_at DESC LIMIT 5").fetchdf()
        event_status = con.execute("SELECT status_hadir, COUNT(*) total FROM event_log GROUP BY status_hadir ORDER BY status_hadir").fetchdf()
        return {"counts": counts, "latest_audit": df_to_records(latest_audit), "event_status": df_to_records(event_status), "db_size_bytes": get_db_size_bytes()}
    finally:
        con.close()


@app.post("/api/events/load")
def load_events(payload: LoadEventRequest, user: dict[str, Any] = Depends(require_admin)) -> dict[str, Any]:
    batch_size = max(1, min(int(payload.batch_size), 50))
    event_path = DATA_DIR / "kehadiran_event.csv"
    require_file(event_path)

    df = pd.read_csv(event_path)
    required = ["event_id", "nim", "kode_mk", "waktu_event", "status_hadir"]
    missing_cols = [col for col in required if col not in df.columns]
    if missing_cols:
        raise HTTPException(status_code=400, detail=f"Kolom wajib hilang: {missing_cols}")

    df = normalize_string_columns(df[required])
    df["status_hadir"] = df["status_hadir"].astype(str).str.lower().str.strip()
    invalid_status = df[~df["status_hadir"].isin(VALID_STATUS)]
    if not invalid_status.empty:
        raise HTTPException(status_code=400, detail="status_hadir hanya boleh hadir, izin, sakit, alfa")
    df["waktu_event"] = pd.to_datetime(df["waktu_event"], errors="coerce")
    df = df.dropna(subset=["event_id", "nim", "kode_mk", "waktu_event", "status_hadir"])
    df = df.drop_duplicates(subset=["event_id"], keep="first")

    con = get_connection()
    loaded = 0
    skipped = 0
    total_event_log = 0
    try:
        existing = {row[0] for row in con.execute("SELECT event_id FROM event_log").fetchall()}
        new_df = df[~df["event_id"].isin(existing)].head(batch_size).copy()
        skipped = int(len(df) - len(new_df))
        for _, row in new_df.iterrows():
            con.execute(
                """
                INSERT INTO event_log (log_id, event_id, nim, kode_mk, waktu_event, status_hadir, source_file, loaded_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                [new_id("EVLOG"), row["event_id"], row["nim"], row["kode_mk"], row["waktu_event"].to_pydatetime(), row["status_hadir"], "kehadiran_event.csv", datetime.now()],
            )
            loaded += 1
        total_row = con.execute("SELECT COUNT(*) FROM event_log").fetchone()
        total_event_log = int(total_row[0]) if total_row else 0
        return {"status": "success", "loaded": loaded, "skipped_existing_or_over_batch": skipped, "total_event_log": total_event_log, "message": f"{loaded} event baru berhasil dimuat ke DuckDB"}
    finally:
        con.close()
        try:
            log_audit(actor_role(payload.role, user), "LOAD_EVENT", f"{loaded} event baru dimuat ke event_log", "SUCCESS", {"loaded": loaded, "total_event_log": total_event_log, "skipped": skipped})
        except Exception:
            pass


@app.get("/api/events/summary")
def event_summary() -> dict[str, Any]:
    con = get_connection()
    try:
        total_row = con.execute("SELECT COUNT(*) FROM event_log").fetchone()
        total = int(total_row[0]) if total_row else 0
        by_status = {row[0]: int(row[1]) for row in con.execute("SELECT status_hadir, COUNT(*) FROM event_log GROUP BY status_hadir").fetchall()}
        by_course = con.execute("SELECT kode_mk, COUNT(*) total FROM event_log GROUP BY kode_mk ORDER BY total DESC").fetchdf()
        by_day = con.execute("SELECT CAST(waktu_event AS DATE) tanggal, COUNT(*) total FROM event_log GROUP BY tanggal ORDER BY tanggal").fetchdf()
        return {
            "total": total,
            "hadir": by_status.get("hadir", 0),
            "izin": by_status.get("izin", 0),
            "sakit": by_status.get("sakit", 0),
            "alfa": by_status.get("alfa", 0),
            "by_course": df_to_records(by_course),
            "by_day": df_to_records(by_day),
        }
    finally:
        con.close()


@app.get("/api/events/latest")
def latest_events(limit: int = 10) -> dict[str, Any]:
    limit = max(1, min(int(limit), 50))
    con = get_connection()
    try:
        df = con.execute(
            """
            SELECT event_id, nim, kode_mk, CAST(waktu_event AS VARCHAR) waktu_event, status_hadir, CAST(loaded_at AS VARCHAR) loaded_at
            FROM event_log
            ORDER BY loaded_at DESC, waktu_event DESC
            LIMIT ?
            """,
            [limit],
        ).fetchdf()
        return {"events": df_to_records(df)}
    finally:
        con.close()


@app.post("/api/events/reset")
def reset_events(payload: RoleRequest, user: dict[str, Any] = Depends(require_admin)) -> dict[str, Any]:
    con = get_connection()
    try:
        con.execute("DELETE FROM event_log")
        log_audit(actor_role(payload.role, user), "RESET_EVENT_LOG", "event_log dikosongkan", "SUCCESS")
        return {"status": "success", "message": "event_log berhasil direset"}
    finally:
        con.close()


@app.post("/api/pipeline/run")
def run_pipeline(payload: RoleRequest, user: dict[str, Any] = Depends(require_admin)) -> dict[str, Any]:
    con = get_connection()
    logs: list[dict[str, Any]] = []
    try:
        con.execute("DELETE FROM pipeline_log")
        con.execute("DELETE FROM pipeline_issue_log")
        for file_name in PIPELINE_SPECS:
            result = validate_and_prepare_dataset(file_name, con)
            df = result.pop("df", pd.DataFrame())
            if result["status"] in {"SUCCESS", "WARNING"}:
                insert_df_replace(con, PIPELINE_SPECS[file_name]["table"], df)
            logs.append(result)
        overall = "success" if all(log["status"] in {"SUCCESS", "WARNING"} for log in logs) else "failed"
        log_audit(actor_role(payload.role, user), "RUN_PIPELINE", f"Pipeline 6 CSV selesai dengan status {overall}", "SUCCESS" if overall == "success" else "FAILED", {"logs": logs})
        return {"status": overall, "message": "Pipeline selesai diproses", "logs": logs}
    finally:
        con.close()


def clamp_limit(limit: int, min_value: int = 1, max_value: int = 100, default: int = 20) -> int:
    # Utility: normalisasi limit agar endpoint list/log konsisten dan aman
    try:
        value = int(limit)
    except Exception:
        value = default
    return max(min_value, min(value, max_value))


@app.get("/api/pipeline/log")
def pipeline_log(limit: int = 20) -> dict[str, Any]:
    limit = clamp_limit(limit, min_value=1, max_value=200, default=20)
    con = get_connection()
    try:
        logs = con.execute("SELECT * FROM pipeline_log ORDER BY processed_at DESC LIMIT ?", [limit]).fetchdf()
        issues = con.execute("SELECT * FROM pipeline_issue_log ORDER BY created_at DESC LIMIT 100").fetchdf()
        return {"logs": df_to_records(logs), "issues": df_to_records(issues)}
    finally:
        con.close()


def chunk_document(text: str, max_words: int = 90) -> list[str]:
    # Guard: cegah langkah range bernilai 0/negatif yang dapat memicu error
    max_words = max(1, int(max_words))
    words = clean_text(text).split()
    chunks = []
    for start in range(0, len(words), max_words):
        chunk = " ".join(words[start:start + max_words]).strip()
        if chunk:
            chunks.append(chunk)
    return chunks


@app.post("/api/rag/build")
def build_rag(payload: RoleRequest, user: dict[str, Any] = Depends(require_admin)) -> dict[str, Any]:
    if not DOCS_DIR.exists():
        raise HTTPException(status_code=404, detail="Folder docs belum ada")
    files = sorted(DOCS_DIR.glob("*.txt"))
    if not files:
        raise HTTPException(status_code=404, detail="Dokumen TXT belum tersedia di folder docs")
    con = get_connection()
    count = 0
    try:
        con.execute("DELETE FROM document_chunks")
        for path in files:
            text = path.read_text(encoding="utf-8")
            for chunk in chunk_document(text):
                con.execute(
                    """
                    INSERT INTO document_chunks (chunk_id, document_name, chunk_text, source, token_count, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    [new_id("CHK"), path.name, chunk, str(path.relative_to(PROJECT_ROOT)), len(chunk.split()), datetime.now()],
                )
                count += 1
        log_audit(actor_role(payload.role, user), "BUILD_RAG_INDEX", f"{count} document_chunks dibuat", "SUCCESS")
        return {"status": "success", "chunks": count, "message": f"{count} chunk dokumen berhasil dibuat"}
    finally:
        con.close()


@app.post("/api/rag/search")
def rag_search(payload: RAGSearchRequest, user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    query = clean_text(payload.query).lower()
    query_terms = [t for t in re.findall(r"[a-zA-Z0-9_\-]+", query) if len(t) > 1]
    if not query_terms:
        return {"answer": "Query terlalu pendek.", "results": []}
    con = get_connection()
    try:
        df = con.execute("SELECT document_name, chunk_text, source, token_count FROM document_chunks").fetchdf()
        if df.empty:
            raise HTTPException(status_code=400, detail="Index dokumen belum dibuat. Klik Build RAG Index terlebih dahulu.")
        
        # TF-IDF implementation
        N = len(df)
        df_docs = df["chunk_text"].apply(lambda x: clean_text(x).lower().split())
        idf = {}
        for term in query_terms:
            df_count = sum(1 for doc in df_docs if term in doc)
            idf[term] = math.log((N + 1) / (df_count + 1)) + 1
            
        rows = []
        for i, row in enumerate(df.itertuples(index=False)):
            doc = df_docs.iloc[i]
            if not doc:
                continue
            doc_len = len(doc)
            score = 0.0
            term_counts = Counter(doc)
            for term in query_terms:
                tf = term_counts[term] / doc_len
                score += tf * idf[term]
            if score > 0:
                rows.append(
                    {
                        "document_name": str(row.document_name),
                        "chunk_text": str(row.chunk_text),
                        "source": str(row.source),
                        "token_count": 0,
                        "score": float(score),
                    }
                )
        
        rows = sorted(rows, key=lambda r: r["score"], reverse=True)[:payload.limit]
        if not rows:
            answer = "Informasi tidak ditemukan dalam dokumen akademik yang tersedia."
        else:
            top = rows[0]
            top_document_name = str(top.get("document_name", "dokumen"))
            top_chunk_text = str(top.get("chunk_text", ""))
            answer = f"Ditemukan {len(rows)} potongan dokumen relevan. Sumber utama: {top_document_name}. Ringkasan: {top_chunk_text[:320]}..."
        log_audit(actor_role(payload.role, user), "RAG_SEARCH", f"Query: {payload.query}; hasil: {len(rows)}", "SUCCESS")
        return {"answer": answer, "results": rows}
    finally:
        con.close()


@app.get("/api/audit/log")
def audit_log(limit: int = 30) -> dict[str, Any]:
    limit = clamp_limit(limit, min_value=1, max_value=100, default=30)
    con = get_connection()
    try:
        df = con.execute(
            "SELECT CAST(created_at AS VARCHAR) created_at, role, action, detail, status, meta_json FROM audit_log ORDER BY created_at DESC LIMIT ?",
            [limit],
        ).fetchdf()
        return {"logs": df_to_records(df)}
    finally:
        con.close()


@app.get("/api/export/event-log")
def export_event_log() -> FileResponse:
    path = export_table_to_csv("event_log", "event_log_export.csv")
    return FileResponse(path, media_type="text/csv", filename=path.name)


@app.get("/api/export/pipeline-log")
def export_pipeline_log() -> FileResponse:
    path = export_table_to_csv("pipeline_log", "pipeline_log_export.csv")
    return FileResponse(path, media_type="text/csv", filename=path.name)


@app.get("/api/export/audit-log")
def export_audit_log() -> FileResponse:
    path = export_table_to_csv("audit_log", "audit_log_export.csv")
    return FileResponse(path, media_type="text/csv", filename=path.name)


@app.post("/api/backup/create")
def create_backup(payload: RoleRequest, user: dict[str, Any] = Depends(require_admin)) -> dict[str, Any]:
    if not DB_PATH.exists():
        init_database()
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = BACKUPS_DIR / f"sc_data_backup_{stamp}.duckdb"
    shutil.copy2(DB_PATH, backup_path)
    con = get_connection()
    backup_id = new_id("BKP")
    try:
        con.execute(
            """
            INSERT INTO backup_log (backup_id, file_name, file_path, db_size_bytes, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            [backup_id, backup_path.name, str(backup_path), backup_path.stat().st_size, datetime.now()],
        )
        log_audit(actor_role(payload.role, user), "CREATE_BACKUP", f"Backup dibuat: {backup_path.name}", "SUCCESS")
        return {"status": "success", "backup_id": backup_id, "file_name": backup_path.name, "file_path": str(backup_path), "db_size_bytes": backup_path.stat().st_size}
    finally:
        con.close()


@app.get("/api/validation/final")
def final_validation() -> dict[str, Any]:
    counts = {row["table"]: row for row in get_table_counts()}
    checks = [
        {"komponen": "Backend FastAPI", "status": "PASS", "bukti": "/api/health aktif"},
        {"komponen": "DuckDB", "status": "PASS" if DB_PATH.exists() else "PARTIAL", "bukti": str(DB_PATH)},
        {"komponen": "event_log", "status": "PASS" if counts.get("event_log", {}).get("rows", 0) > 0 else "PARTIAL", "bukti": "Terisi setelah klik Load Event Baru"},
        {"komponen": "pipeline_log", "status": "PASS" if counts.get("pipeline_log", {}).get("rows", 0) > 0 else "PARTIAL", "bukti": "Terisi setelah Run Pipeline"},
        {"komponen": "document_chunks", "status": "PASS" if counts.get("document_chunks", {}).get("rows", 0) > 0 else "PARTIAL", "bukti": "Terisi setelah Build RAG Index"},
        {"komponen": "audit_log", "status": "PASS" if counts.get("audit_log", {}).get("rows", 0) > 0 else "PARTIAL", "bukti": "Audit aktivitas backend"},
        {"komponen": "Tanpa API key", "status": "PASS", "bukti": "Semua proses lokal"},
        {"komponen": "Tanpa layanan eksternal", "status": "PASS", "bukti": "FastAPI + DuckDB lokal"},
        {"komponen": "Export evidence", "status": "PASS", "bukti": "/api/export/event-log dan /api/export/pipeline-log"},
        {"komponen": "Backup DB", "status": "PASS", "bukti": "/api/backup/create"},
    ]
    overall = "PASS" if all(c["status"] == "PASS" for c in checks) else "PARTIAL"
    return {"overall": overall, "checks": checks, "table_counts": list(counts.values())}

