@echo off
title VidyaSetu - School Management ERP
color 0B

echo ===============================================================
echo        VidyaSetu - School Management Software (विद्यासेतु)
echo          CBSE / State Board School ERP with Parent Portal
echo ===============================================================
echo.
echo Starting School ERP Server on Port 3000...
echo The application will open automatically in your browser at:
echo http://localhost:3000
echo.
echo Press Ctrl + C in this terminal window to stop the server anytime.
echo.

start http://localhost:3000
npx vite --port 3000 --host

pause
