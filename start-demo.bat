@echo off
echo ====================================================
echo   LANDCHAIN - Smart India Hackathon 2026 (SIH26125)
echo   Starting Backend & Frontend Servers...
echo ====================================================

echo [1/2] Launching Backend Server on http://localhost:5000 ...
start "LANDCHAIN Backend" cmd /k "cd backend && npm start"

timeout /t 2 /nobreak >nul

echo [2/2] Launching Frontend Server on http://localhost:5173 ...
start "LANDCHAIN Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers launched!
echo Open http://localhost:5173 in your browser.
echo.
pause
