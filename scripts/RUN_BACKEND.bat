@echo off
title ISTN Connect SC-DATA Backend POWERFUL V2
cd /d %~dp0
python -m pip install -r backend\requirements.txt
python backend\init_db.py
python backend\seed_data.py
python -m uvicorn backend.main:app --reload
pause

