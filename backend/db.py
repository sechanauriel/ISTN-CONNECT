from __future__ import annotations

from datetime import datetime
from pathlib import Path
import json
import uuid
import time
import threading
from typing import Any, Iterable

import duckdb
import pandas as pd

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent
DB_PATH = BACKEND_DIR / "sc_data.duckdb"
OUTPUTS_DIR = BACKEND_DIR / "outputs"
BACKUPS_DIR = BACKEND_DIR / "backups"

REQUIRED_TABLES = [
    "event_log",
    "pipeline_log",
    "pipeline_issue_log",
    "audit_log",
    "document_chunks",
    "mahasiswa",
    "dosen",
    "mata_kuliah",
    "krs",
    "nilai",
    "kehadiran",
    "backup_log",
]


def ensure_dirs() -> None:
    BACKEND_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    BACKUPS_DIR.mkdir(parents=True, exist_ok=True)


_DB_WRITE_LOCK = threading.RLock()

def get_connection(read_only: bool = False, retries: int = 8, delay: float = 0.05) -> duckdb.DuckDBPyConnection:
    ensure_dirs()
    last_err: Exception | None = None
    for attempt in range(max(1, retries)):
        try:
            return duckdb.connect(str(DB_PATH), read_only=read_only)
        except Exception as exc:
            last_err = exc
            if attempt >= retries - 1:
                break
            time.sleep(delay * (attempt + 1))
    raise last_err if last_err else RuntimeError("Gagal membuka koneksi DuckDB")


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def new_id(prefix: str = "ID") -> str:
    return f"{prefix}-{uuid.uuid4().hex[:12].upper()}"


def execute(query: str, params: Iterable[Any] | None = None) -> None:
    with _DB_WRITE_LOCK:
        con = get_connection()
        try:
            if params is None:
                con.execute(query)
            else:
                con.execute(query, list(params))
        finally:
            con.close()


def fetch_df(query: str, params: Iterable[Any] | None = None) -> pd.DataFrame:
    con = get_connection()
    try:
        if params is None:
            return con.execute(query).fetchdf()
        return con.execute(query, list(params)).fetchdf()
    finally:
        con.close()


def df_to_records(df: pd.DataFrame) -> list[dict[str, Any]]:
    if df is None or df.empty:
        return []
    clean = df.copy()
    for col in clean.columns:
        if pd.api.types.is_datetime64_any_dtype(clean[col]):
            clean[col] = clean[col].astype(str)
        elif pd.api.types.is_timedelta64_dtype(clean[col]):
            clean[col] = clean[col].astype(str)
    clean = clean.where(pd.notnull(clean), None)
    return clean.to_dict(orient="records")


def fetch_all(query: str, params: Iterable[Any] | None = None) -> list[dict[str, Any]]:
    return df_to_records(fetch_df(query, params))


def table_exists(con: duckdb.DuckDBPyConnection, table_name: str) -> bool:
    rows = con.execute("SHOW TABLES").fetchall()
    return table_name in {row[0] for row in rows}


def get_table_counts() -> list[dict[str, Any]]:
    con = get_connection()
    try:
        existing = {row[0] for row in con.execute("SHOW TABLES").fetchall()}
        results: list[dict[str, Any]] = []
        for table in REQUIRED_TABLES:
            if table in existing:
                rows = int(con.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0])
                results.append({"table": table, "rows": rows, "status": "OK"})
            else:
                results.append({"table": table, "rows": 0, "status": "MISSING"})
        return results
    finally:
        con.close()


def get_db_size_bytes() -> int:
    return DB_PATH.stat().st_size if DB_PATH.exists() else 0


def log_audit(role: str, action: str, detail: str, status: str = "SUCCESS", meta: dict[str, Any] | None = None) -> None:
    with _DB_WRITE_LOCK:
        con = get_connection()
        try:
            con.execute(
                """
                INSERT INTO audit_log (audit_id, role, action, detail, status, meta_json, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                [
                    new_id("AUD"),
                    role or "System",
                    action,
                    detail,
                    status,
                    json.dumps(meta or {}, ensure_ascii=False),
                    datetime.now(),
                ],
            )
        finally:
            con.close()


def export_table_to_csv(table_name: str, output_name: str | None = None) -> Path:
    ensure_dirs()
    allowed = set(REQUIRED_TABLES)
    if table_name not in allowed:
        raise ValueError(f"Table export tidak diizinkan: {table_name}")
    output = OUTPUTS_DIR / (output_name or f"{table_name}_export.csv")
    df = fetch_df(f"SELECT * FROM {table_name}")
    df.to_csv(output, index=False)
    return output


def safe_int(value: Any, default: int = 0) -> int:
    try:
        return int(value)
    except Exception:
        return default


def safe_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except Exception:
        return default
