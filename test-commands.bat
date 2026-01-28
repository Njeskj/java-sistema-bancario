@echo off
chcp 65001 >nul
title Test Batch Commands
color 0A

echo Testando comandos...
echo.

echo 1. Testando mysql...
mysql -u root -e "SELECT 1;" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    [OK] MySQL funciona
) else (
    echo    [ERRO] MySQL nao funciona
)

echo.
echo 2. Testando netstat...
netstat -ano | findstr :8081 | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    [OK] Porta 8081 em uso
) else (
    echo    [INFO] Porta 8081 livre
)

echo.
echo 3. Testando for com netstat...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
    echo    Encontrado PID: %%a
)

echo.
echo 4. Testando set com espacos...
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
echo    JAVA_HOME definido

echo.
echo Testes concluidos!
pause
