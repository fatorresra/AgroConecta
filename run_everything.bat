@echo off
REM Abre front-end en una nueva ventana
start cmd /k "cd /d %~dp0front-end && npm install && npm run dev"

REM Abre AuthenticationService en otra ventana
start cmd /k "cd /d %~dp0AuthenticationService && python -m venv .venv && call .venv\Scripts\activate && pip install --upgrade pip && pip install -r requirements.txt && python app.py"