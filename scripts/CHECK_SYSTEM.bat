@echo off
title Check ISTN SC-DATA System
cd /d "%~dp0\.."
echo Checking Python...
where py
where python
echo.
echo Checking project files...
if exist frontend\index.html (echo frontend\index.html OK) else (echo frontend\index.html MISSING)
if exist frontend\js\core\app.js (echo frontend\js\core\app.js OK) else (echo frontend\js\core\app.js MISSING)
if exist backend\main.py (echo backend\main.py OK) else (echo backend\main.py MISSING)
if exist backend\requirements.txt (echo backend\requirements.txt OK) else (echo backend\requirements.txt MISSING)
echo.
echo Checking backend health if running...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { Invoke-RestMethod http://127.0.0.1:8000/api/health } catch { Write-Host 'Backend belum aktif.' }"
pause
