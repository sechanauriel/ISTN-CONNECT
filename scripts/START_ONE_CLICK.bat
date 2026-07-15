@echo off
setlocal EnableDelayedExpansion
title ISTN Connect SC-DATA DuckDB - ONE CLICK ULTRA V3
cd /d "%~dp0\.."

echo ============================================================
echo  ISTN CONNECT SC-DATA DUCKDB - ONE CLICK ULTRA V3
echo ============================================================
echo  Proses otomatis:
echo  1. Cek Python
echo  2. Buat virtual environment lokal .venv
echo  3. Install dependency otomatis ke .venv
echo  4. Init DuckDB dan seed data
echo  5. Jalankan FastAPI backend
echo  6. Auto-load event_log, pipeline_log, document_chunks, backup
echo  7. Buka web, Database Proof, dan Final Validation
echo ============================================================
echo.

set "PY_CMD="
where py >nul 2>nul
if %ERRORLEVEL%==0 (
    set "PY_CMD=py -3"
) else (
    where python >nul 2>nul
    if %ERRORLEVEL%==0 set "PY_CMD=python"
)

if not defined PY_CMD (
    echo [ERROR] Python belum terdeteksi di komputer ini.
    echo Install Python 3.10+ sekali saja dari python.org lalu centang "Add Python to PATH".
    echo Setelah itu jalankan file ini lagi.
    pause
    exit /b 1
)

echo [1/7] Python ditemukan: %PY_CMD%
%PY_CMD% --version

echo.
echo [2/7] Menyiapkan virtual environment lokal .venv ...
if not exist ".venv\Scripts\python.exe" (
    %PY_CMD% -m venv .venv
    if errorlevel 1 (
        echo [ERROR] Gagal membuat .venv.
        pause
        exit /b 1
    )
) else (
    echo .venv sudah ada, lanjut.
)

set "VENV_PY=%CD%\.venv\Scripts\python.exe"

echo.
echo [3/7] Install dependency otomatis ke .venv ...
"%VENV_PY%" -m pip install --upgrade pip
"%VENV_PY%" -m pip install -r backend\requirements.txt
if errorlevel 1 (
    echo [ERROR] Gagal install dependency. Cek koneksi internet atau cache pip.
    pause
    exit /b 1
)

echo.
echo [4/7] Init DuckDB dan seed data ...
"%VENV_PY%" backend\init_db.py
"%VENV_PY%" backend\seed_data.py
if errorlevel 1 (
    echo [ERROR] Gagal init database atau seed data.
    pause
    exit /b 1
)

echo.
echo [5/7] Menutup backend lama di port 8000 jika ada ...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $p=(Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -First 1).OwningProcess; if($p){ Stop-Process -Id $p -Force; Start-Sleep -Seconds 2 } } catch {}"

echo.
echo [6/7] Menjalankan backend FastAPI di window terpisah ...
start "SC-DATA Backend API" cmd /k "cd /d "%CD%" && "%VENV_PY%" -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"

echo.
echo [7/7] Auto demo: isi DuckDB dan buka browser ...
"%VENV_PY%" backend\one_click_demo.py
if errorlevel 1 (
    echo [WARNING] Auto demo gagal. Coba buka manual: http://127.0.0.1:8000/api/health
)

echo.
echo ============================================================
echo  ONE CLICK SELESAI
echo ============================================================
echo  Backend API:       http://127.0.0.1:8000/api/health
echo  Database Proof:    http://127.0.0.1:8000/api/db/tables
echo  Final Validation:  http://127.0.0.1:8000/api/validation/final
echo  Frontend:          index.html
echo.
echo  Jangan tutup window "SC-DATA Backend API" selama demo.
echo ============================================================
pause

