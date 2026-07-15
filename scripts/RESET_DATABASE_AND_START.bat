@echo off
title Reset Database and Start One Click
cd /d "%~dp0\.."
echo PERINGATAN: Ini akan menghapus backend\sc_data.duckdb dan output lama.
choice /C YN /M "Lanjut reset database?"
if errorlevel 2 exit /b 0
if exist backend\sc_data.duckdb del /f /q backend\sc_data.duckdb
if exist backend\outputs rmdir /s /q backend\outputs
if exist backend\backups rmdir /s /q backend\backups
call START_ONE_CLICK.bat
