@echo off
title Stop ISTN SC-DATA Backend
cd /d "%~dp0\.."
echo Menutup backend FastAPI di port 8000...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $items=Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue; foreach($i in $items){ if($i.OwningProcess){ Stop-Process -Id $i.OwningProcess -Force -ErrorAction SilentlyContinue } }; Write-Host 'Backend port 8000 dihentikan.' } catch { Write-Host 'Tidak ada backend aktif atau gagal stop.' }"
pause
