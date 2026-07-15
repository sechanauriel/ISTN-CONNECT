@echo off
start "" "http://127.0.0.1:8000/api/health"
start "" "http://127.0.0.1:8000/api/db/tables"
start "" "http://127.0.0.1:8000/api/validation/final"
start "" "%~dp0index.html"
