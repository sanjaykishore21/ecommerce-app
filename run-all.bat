@echo off
title Launch Aurora E-Commerce Full-Stack App
cd /d "%~dp0"

echo ========================================================
echo   Starting AURORA Full-Stack E-Commerce Application
echo ========================================================
echo.

echo [1/2] Launching Spring Boot Backend on http://localhost:8080 ...
start "Aurora Backend" cmd /c "cd /d "%~dp0backend" && start.bat"

echo [2/2] Launching React Frontend on http://localhost:5173 ...
start "Aurora Frontend" cmd /c "cd /d "%~dp0frontend" && start.bat"

echo.
echo Both servers are starting up!
echo Open http://localhost:5173 in your browser when ready.
echo.
pause
