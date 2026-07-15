from __future__ import annotations

from datetime import datetime

import duckdb

try:
    from .db import BACKEND_DIR, DB_PATH, OUTPUTS_DIR, BACKUPS_DIR, get_connection
except ImportError:  # allow: python backend/init_db.py
    import sys
    sys.path.append(str(__import__("pathlib").Path(__file__).resolve().parent.parent))
    from backend.db import BACKEND_DIR, DB_PATH, OUTPUTS_DIR, BACKUPS_DIR, get_connection

DDL = [
    """
    CREATE TABLE IF NOT EXISTS event_log (
        log_id VARCHAR PRIMARY KEY,
        event_id VARCHAR UNIQUE,
        nim VARCHAR,
        kode_mk VARCHAR,
        waktu_event TIMESTAMP,
        status_hadir VARCHAR,
        source_file VARCHAR,
        loaded_at TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS pipeline_log (
        pipeline_id VARCHAR PRIMARY KEY,
        dataset_name VARCHAR,
        total_rows INTEGER,
        valid_rows INTEGER,
        invalid_rows INTEGER,
        duplicate_rows INTEGER,
        missing_value_rows INTEGER,
        status VARCHAR,
        message VARCHAR,
        processed_at TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS pipeline_issue_log (
        issue_id VARCHAR PRIMARY KEY,
        pipeline_id VARCHAR,
        dataset_name VARCHAR,
        row_number INTEGER,
        issue_type VARCHAR,
        issue_detail VARCHAR,
        created_at TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS audit_log (
        audit_id VARCHAR PRIMARY KEY,
        role VARCHAR,
        action VARCHAR,
        detail VARCHAR,
        status VARCHAR,
        meta_json VARCHAR,
        created_at TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS document_chunks (
        chunk_id VARCHAR PRIMARY KEY,
        document_name VARCHAR,
        chunk_text VARCHAR,
        source VARCHAR,
        token_count INTEGER,
        created_at TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS mahasiswa (
        nim VARCHAR PRIMARY KEY,
        nama VARCHAR,
        prodi VARCHAR,
        semester INTEGER,
        status VARCHAR
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS dosen (
        nidn VARCHAR PRIMARY KEY,
        nama VARCHAR,
        prodi VARCHAR,
        email VARCHAR,
        status VARCHAR
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS mata_kuliah (
        kode_mk VARCHAR PRIMARY KEY,
        nama_mk VARCHAR,
        sks INTEGER,
        prodi VARCHAR,
        semester INTEGER
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS krs (
        krs_id VARCHAR PRIMARY KEY,
        nim VARCHAR,
        kode_mk VARCHAR,
        tahun_ajaran VARCHAR,
        semester_akademik VARCHAR,
        status VARCHAR
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS nilai (
        nilai_id VARCHAR PRIMARY KEY,
        nim VARCHAR,
        kode_mk VARCHAR,
        tugas DOUBLE,
        uts DOUBLE,
        uas DOUBLE,
        nilai_akhir DOUBLE,
        grade VARCHAR
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS kehadiran (
        hadir_id VARCHAR PRIMARY KEY,
        nim VARCHAR,
        kode_mk VARCHAR,
        tanggal DATE,
        status_hadir VARCHAR,
        keterangan VARCHAR
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS backup_log (
        backup_id VARCHAR PRIMARY KEY,
        file_name VARCHAR,
        file_path VARCHAR,
        db_size_bytes BIGINT,
        created_at TIMESTAMP
    )
    """,
]

INDEXES = [
    "CREATE INDEX IF NOT EXISTS idx_event_log_event_id ON event_log(event_id)",
    "CREATE INDEX IF NOT EXISTS idx_event_log_nim ON event_log(nim)",
    "CREATE INDEX IF NOT EXISTS idx_event_log_kode_mk ON event_log(kode_mk)",
    "CREATE INDEX IF NOT EXISTS idx_pipeline_log_dataset ON pipeline_log(dataset_name)",
    "CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action)",
    "CREATE INDEX IF NOT EXISTS idx_doc_chunks_name ON document_chunks(document_name)",
]


def _ensure_audit_columns(con: duckdb.DuckDBPyConnection) -> None:
    """Keep compatibility with earlier generated DB files."""
    cols = {row[1] for row in con.execute("PRAGMA table_info('audit_log')").fetchall()}
    if "status" not in cols:
        con.execute("ALTER TABLE audit_log ADD COLUMN status VARCHAR DEFAULT 'SUCCESS'")
    if "meta_json" not in cols:
        con.execute("ALTER TABLE audit_log ADD COLUMN meta_json VARCHAR DEFAULT '{}'")


def init_database() -> None:
    BACKEND_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    BACKUPS_DIR.mkdir(parents=True, exist_ok=True)
    con = get_connection()
    try:
        for ddl in DDL:
            con.execute(ddl)
        _ensure_audit_columns(con)
        for statement in INDEXES:
            try:
                con.execute(statement)
            except Exception:
                # DuckDB index support can vary; schema remains valid even if an index is skipped.
                pass
        con.execute(
            """
            INSERT INTO audit_log (audit_id, role, action, detail, status, meta_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            ["AUD-INIT-DB", "System", "INIT_DB", "Database schema checked/created", "SUCCESS", "{}", datetime.now()],
        ) if con.execute("SELECT COUNT(*) FROM audit_log WHERE audit_id='AUD-INIT-DB'").fetchone()[0] == 0 else None
    finally:
        con.close()
    print(f"DuckDB siap: {DB_PATH}")
    print("Tabel SC-DATA berhasil dibuat/dicek.")


if __name__ == "__main__":
    init_database()
