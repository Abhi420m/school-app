@echo off
title Push to GitHub - VidyaSetu ERP
color 0A

echo ===================================================
echo         Push VidyaSetu School ERP to GitHub
echo ===================================================
echo.
set /p REPO_URL="Apna GitHub Repository URL enter karein (e.g. https://github.com/username/school-app.git): "
if "%REPO_URL%"=="" goto error

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

echo.
echo ===================================================
echo    Done! Aapka code GitHub par upload ho gaya!
echo ===================================================
pause
exit

:error
echo.
echo [ERROR] Aapne koi Repository URL enter nahi kiya.
pause
