@echo off
title VidyaSetu - School Management ERP
color 0B

echo ===============================================================
echo        VidyaSetu - School Management Software (विद्यासेतु)
echo          CBSE / State Board School ERP with Parent Portal
echo ===============================================================
echo.

if not exist node_modules (
    echo [1/2] First time setup: Installing required packages...
    echo (Kripya 1-2 minute intezar karein...)
    echo.
    call npm install
    echo.
)

echo [2/2] Starting School App...
echo Browser will open automatically at http://localhost:3000
echo.

start http://localhost:3000
call npx vite --port 3000 --host

pause
