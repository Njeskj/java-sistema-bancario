@echo off
chcp 65001 >nul
title iBank - Sistema Bancário
color 0A

echo.
echo ╔═══════════════════════════════════════════════════╗
echo ║          iBank - Sistema Bancário v2.0            ║
echo ╚═══════════════════════════════════════════════════╝
echo.

:: Verifica se o MySQL está rodando
echo [1/4] Verificando MySQL...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo       ✓ MySQL rodando
) else (
    echo       ✗ MySQL não está rodando!
    echo.
    echo       SOLUÇÃO: Abra o Laragon e clique em "Start All"
    echo.
    pause
    exit /b 1
)

:: Para processos antigos nas portas 8081 e 3000
echo.
echo [2/4] Liberando portas 8081 e 3000...
powershell -Command "$procs = Get-NetTCPConnection -LocalPort 8081,3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique; if ($procs) { $procs | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } }"
timeout /t 2 /nobreak >nul
echo       ✓ Portas liberadas

:: Inicia o Backend Spring Boot
echo.
echo [3/4] Iniciando Backend Spring Boot (porta 8081)...
echo       Aguarde ~15 segundos para o Spring Boot inicializar...
start "iBank Backend" powershell -NoExit -Command "cd 'c:\laragon\www\java\backend'; $env:JAVA_HOME = 'C:\Program Files\Java\jdk-17'; Write-Host '═══════════════════════════════════════' -ForegroundColor Cyan; Write-Host '   iBank Backend - Spring Boot' -ForegroundColor Green; Write-Host '═══════════════════════════════════════' -ForegroundColor Cyan; Write-Host ''; & 'C:\Program Files\Java\jdk-17\bin\java.exe' '-Dserver.port=8081' -jar 'target\ibank-system-2.0.0.jar'"
timeout /t 15 /nobreak >nul
echo       ✓ Backend iniciado (verifique a janela PowerShell)

:: Inicia o Frontend React
echo.
echo [4/4] Iniciando Frontend React (porta 3000)...
start "iBank Frontend" powershell -NoExit -Command "cd 'c:\laragon\www\java\frontend-web'; Write-Host '═══════════════════════════════════════' -ForegroundColor Cyan; Write-Host '   iBank Frontend - React + Vite' -ForegroundColor Green; Write-Host '═══════════════════════════════════════' -ForegroundColor Cyan; Write-Host ''; npm run dev"
timeout /t 8 /nobreak >nul
echo       ✓ Frontend iniciado (verifique a janela PowerShell)

echo.
echo ╔═══════════════════════════════════════════════════╗
echo ║              SISTEMA INICIADO!                    ║
echo ╚═══════════════════════════════════════════════════╝
echo.
echo   Backend:  http://localhost:8081/api
echo   Frontend: http://localhost:3000
echo   Também:   http://java.local:3000
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   LOGIN DO SISTEMA
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   Email: admin@ibank.com
echo   Senha: 123456
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo   Aguardando inicialização completa...
timeout /t 3 /nobreak >nul

:: Abre o navegador
start http://localhost:3000/login

echo.
echo   ✓ Navegador aberto em http://localhost:3000/login
echo.
echo   Pressione qualquer tecla para fechar (sistema continuará rodando)
pause >nul
