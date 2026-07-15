from __future__ import annotations

import json
import time
import urllib.error
import urllib.request
import webbrowser
import sys
import subprocess
from pathlib import Path

BASE_URL = "http://127.0.0.1:8000"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
backend_process = None


def get(path: str) -> dict:
    with urllib.request.urlopen(BASE_URL + path, timeout=8) as response:
        return json.loads(response.read().decode("utf-8"))


def post(path: str, payload: dict | None = None, token: str | None = None) -> dict:
    body = json.dumps(payload or {}).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(
        BASE_URL + path,
        data=body,
        headers=headers,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def wait_for_backend(max_seconds: int = 20) -> bool:
    global backend_process
    print("[1/6] Menunggu backend FastAPI aktif...")
    deadline = time.time() + max_seconds
    
    # Try first
    try:
        if get("/api/health"):
            return True
    except Exception:
        pass
        
    print("      Backend belum aktif. Memulai Uvicorn secara otomatis...")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=str(PROJECT_ROOT)
    )
    
    while time.time() < deadline:
        try:
            result = get("/api/health")
            print(f"      Backend OK | database={result.get('database')} | version={result.get('version')}")
            return True
        except Exception:
            time.sleep(1)
    return False


def safe_step(label: str, fn):
    print(label)
    try:
        result = fn()
        print("      OK")
        preview = json.dumps(result, ensure_ascii=False)[:500]
        print(f"      {preview}")
        return result
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        print(f"      WARNING HTTP {exc.code}: {detail[:500]}")
    except Exception as exc:
        print(f"      WARNING: {exc}")
    return None


def main() -> None:
    if not wait_for_backend():
        print("Backend gagal dihidupkan. Proses dihentikan.")
        raise SystemExit(1)
        
    print("[1.5/6] Mendapatkan token admin...")
    login_result = post("/api/auth/login", {"role": "Administrator", "username": "admin"})
    token = login_result.get("token") if login_result else None
    if not token:
        print("Gagal mendapatkan token auth. Proses dihentikan.")
        raise SystemExit(1)

    safe_step("[2/6] Auto-load Event Monitor ke event_log DuckDB...", lambda: post("/api/events/load", {"batch_size": 50, "role": "Administrator"}, token=token))
    safe_step("[3/6] Auto-run Data Pipeline 6 CSV ke DuckDB...", lambda: post("/api/pipeline/run", {"role": "Administrator"}, token=token))
    safe_step("[4/6] Auto-build RAG Index ke document_chunks...", lambda: post("/api/rag/build", {"role": "Administrator"}, token=token))
    safe_step("[5/6] Auto-create backup DuckDB...", lambda: post("/api/backup/create", {"role": "Administrator"}, token=token))
    validation = safe_step("[6/6] Final validation otomatis...", lambda: get("/api/validation/final"))

    print("\nMembuka browser otomatis...")
    webbrowser.open(BASE_URL + "/api/db/tables")
    webbrowser.open(BASE_URL + "/api/validation/final")
    webbrowser.open((PROJECT_ROOT / "frontend" / "index.html").resolve().as_uri())

    print("\nSELESAI. Database Proof, Final Validation, dan Web Portal sudah dibuka.")
    if validation:
        print(f"Overall validation: {validation.get('overall')}")


if __name__ == "__main__":
    main()
