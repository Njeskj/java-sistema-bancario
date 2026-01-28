@echo off
chcp 65001 >nul
title Test MySQL Call
color 0A

echo Testando call com mysql...
call :CHECK_MYSQL
echo Resultado: %MYSQL_STATUS%
pause
goto FIM

:CHECK_MYSQL
echo [STATUS] MySQL...
mysql -u root -e "SELECT 1;" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo          [OK] MySQL esta rodando
    set MYSQL_STATUS=OK
) else (
    echo          [ERRO] MySQL nao esta rodando
    set MYSQL_STATUS=ERRO
)
goto :EOF

:FIM
exit
