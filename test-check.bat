@echo off
chcp 65001 >nul

echo Testando funcao CHECK_MYSQL...
call :CHECK_MYSQL
echo Funcao executada!
pause
goto :EOF

:CHECK_MYSQL
echo [STATUS] MySQL...
mysql -u root -e "SELECT 1;" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo          [OK] MySQL esta rodando na porta 3306
    set MYSQL_STATUS=OK
) else (
    echo          [ERRO] MySQL nao esta rodando
    set MYSQL_STATUS=ERRO
)
goto :EOF
