@echo off
title Aurora E-Commerce Backend
cd /d "%~dp0"
echo ========================================================
echo   Starting Aurora E-Commerce Spring Boot Backend...
echo ========================================================
echo.
call mvnw.cmd spring-boot:run
pause
