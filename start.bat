@echo off
title Zenith - Cyber Risk Platform Launcher
color 0C

echo ========================================================
echo        ZENITH - CYBER RISK & DEFENSE PLATFORM
echo                    SIH26105
echo ========================================================
echo.

cd /d "%~dp0"

echo [*] Starting Backend API (FastAPI) on Port 8001...
start "Zenith - Backend API (Port 8001)" cmd /k "cd /d "%~dp0backend" && python -m uvicorn zenith_backend.main:app --reload --port 8001"

echo [*] Starting Frontend UI (Vite / React) on Port 5173...
start "Zenith - Frontend UI (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo [*] Waiting for services to initialize...
timeout /t 3 /nobreak >nul

echo [*] Opening Zenith in default browser...
start http://localhost:5173

echo.
echo ========================================================
echo  [+] Backend API:     http://127.0.0.1:8001
echo  [+] Swagger Docs:    http://127.0.0.1:8001/docs
echo  [+] Frontend App:    http://localhost:5173
echo ========================================================
echo.
echo  Keep the opened terminal windows running while using Zenith.
echo  Press any key to close this launcher window.
pause >nul
