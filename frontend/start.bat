@echo off
title Aurora E-Commerce Frontend
cd /d "%~dp0"

echo ========================================================
echo   Starting Aurora E-Commerce React Frontend...
echo ========================================================
echo.

:: Ensure Node.js and system tools are in PATH for child processes (esbuild, vite)
set "PATH=C:\Program Files\nodejs;C:\Windows\System32;C:\Windows\System32\WindowsPowerShell\v1.0;%PATH%"

set "NODE_EXE=C:\Program Files\nodejs\node.exe"
set "NPM_CLI=C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"

if not exist "%NODE_EXE%" (
    set "NODE_EXE=node"
)

if not exist "node_modules\vite" (
    echo [INFO] Cleaning and installing dependencies...
    rmdir /s /q "node_modules" 2>nul
    del "package-lock.json" 2>nul
    if exist "%NPM_CLI%" (
        "%NODE_EXE%" "%NPM_CLI%" install
    ) else (
        call npm install
    )
)

echo [INFO] Starting Vite development server on http://localhost:5173 ...
if exist "%NPM_CLI%" (
    "%NODE_EXE%" "%NPM_CLI%" run dev
) else (
    call npm run dev
)

pause
