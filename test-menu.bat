@echo off
chcp 65001 >nul
title Test
color 0A

:MENU
cls
echo.
echo Menu principal

call :CHECK_MYSQL

echo.
echo Fim do menu
pause
goto :EOF

:CHECK_MYSQL
echo [STATUS] MySQL...
mysql -u root -e "SELECT 1;" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo          [OK] MySQL OK
) else (
    echo          [ERRO] MySQL ERRO
)
goto :EOF
