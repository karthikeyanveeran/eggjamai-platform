@echo off
echo Starting EggJam.ai Development Environment...

echo.
echo Starting Backend (FastAPI)...
cd backend
start "Backend" cmd /k "python -m uvicorn main:app --reload --port 8000"

echo.
echo Starting Frontend (Vite + React)...
cd ..\frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo Development servers starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to continue...
pause