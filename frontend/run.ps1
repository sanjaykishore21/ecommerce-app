# Ensure Node.js and system tools are in PATH for all child processes
$env:PATH = "C:\Program Files\nodejs;C:\Windows\System32;C:\Windows\System32\WindowsPowerShell\v1.0;" + $env:PATH

Set-Location -Path $PSScriptRoot

$node = "C:\Program Files\nodejs\node.exe"
$npmCli = "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"

# Check if node_modules is complete (vite installed)
if (-not (Test-Path "node_modules\vite")) {
    Write-Host "[INFO] Cleaning previous partial install..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

    Write-Host "[INFO] Installing frontend dependencies..." -ForegroundColor Cyan
    & $node $npmCli install
}

Write-Host "[INFO] Starting Vite development server on http://localhost:5173 ..." -ForegroundColor Green
& $node $npmCli run dev
