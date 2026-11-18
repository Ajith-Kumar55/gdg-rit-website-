# One-Click Launcher for GDG on Campus - RIT Hassan Full-Stack Website
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  GDG ON CAMPUS - RAJEEV INSTITUTE OF TECHNOLOGY, HASSAN  " -ForegroundColor White
Write-Host "  Launching Full-Stack Backend (8000) & Frontend (5173)   " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start FastAPI Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$RootDir\backend'; python run.py"

# Start Vite Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$RootDir\frontend'; npm run dev -- --port 5173"

Start-Sleep -Seconds 3
Write-Host ""
Write-Host "[OK] Public Website: http://localhost:5173" -ForegroundColor Green
Write-Host "[OK] Admin Portal:   http://localhost:5173/admin/login" -ForegroundColor Yellow
Write-Host "[OK] API Docs:       http://localhost:8000/docs" -ForegroundColor Cyan

Start-Process "http://localhost:5173"
