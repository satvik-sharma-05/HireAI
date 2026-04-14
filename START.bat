@echo off
echo ========================================
echo   HireAI Lite - Starting Project
echo ========================================
echo.

echo [1/2] Starting Backend (FastAPI)...
start cmd /k "cd backend && pip install -r requirements.txt && python -m spacy download en_core_web_sm && uvicorn main:app --reload"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend (Next.js)...
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ========================================
echo   Project Started!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause > nul
