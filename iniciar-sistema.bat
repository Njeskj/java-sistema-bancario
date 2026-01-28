@echo off
chcp 65001 >nul
title iBank - Sistema Bancario - Monitor
color 0A

:MENU
cls
echo.
echo ========================================================
echo      iBank - Sistema Bancario v2.0 - Monitor
echo ========================================================
echo.

:: Verificar status dos servicos
call :CHECK_MYSQL
call :CHECK_BACKEND
call :CHECK_FRONTEND
call :CHECK_MOBILE

echo.
echo ========================================================
echo                    MENU DE OPCOES
echo ========================================================
echo.
echo   [1] Iniciar todos os servicos
echo   [2] Iniciar Backend Spring Boot
echo   [3] Iniciar Frontend React + Vite
echo   [4] Iniciar Mobile React Native (Expo)
echo   [5] Parar Backend
echo   [6] Parar Frontend
echo   [7] Parar Mobile
echo   [8] Parar todos os servicos
echo   [9] Atualizar status
echo   [0] Sair
echo.
echo ========================================================
echo.
choice /c 1234567890 /t 30 /d 9 /n /m "Digite sua opcao (atualiza em 30s): "
set opcao=%ERRORLEVEL%

if %opcao%==1 goto START_ALL
if %opcao%==2 goto START_BACKEND
if %opcao%==3 goto START_FRONTEND
if %opcao%==4 goto START_MOBILE
if %opcao%==5 goto STOP_BACKEND
if %opcao%==6 goto STOP_FRONTEND
if %opcao%==7 goto STOP_MOBILE
if %opcao%==8 goto STOP_ALL
if %opcao%==9 goto MENU
if %opcao%==10 goto END
goto MENU

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

:CHECK_BACKEND
echo [STATUS] Backend Spring Boot...
netstat -ano | findstr :8081 | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo          [OK] Backend rodando na porta 8081
    set BACKEND_STATUS=OK
) else (
    echo          [PARADO] Backend nao esta rodando
    set BACKEND_STATUS=PARADO
)
goto :EOF

:CHECK_FRONTEND
echo [STATUS] Frontend React + Vite...
netstat -ano | findstr :3000 | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo          [OK] Frontend rodando na porta 3000
    set FRONTEND_STATUS=OK
) else (
    echo          [PARADO] Frontend nao esta rodando
    set FRONTEND_STATUS=PARADO
)
goto :EOF

:CHECK_MOBILE
echo [STATUS] Mobile React Native ^(Expo^)...
netstat -ano | findstr :19000 | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo          [OK] Mobile ^(Expo^) rodando na porta 19000
    set MOBILE_STATUS=OK
) else (
    echo          [PARADO] Mobile nao esta rodando
    set MOBILE_STATUS=PARADO
)
goto :EOF

:START_ALL
cls
echo.
echo ========================================================
echo          Iniciando Sistema Completo
echo ========================================================
echo.

:: Configurar variaveis de ambiente
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
set "PATH=%JAVA_HOME%\bin;Z:\laragon\bin\maven\bin;%PATH%"

:: Verifica se o MySQL esta rodando
echo [1/5] Verificando MySQL...
mysql -u root -e "SELECT 1;" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo       MySQL nao esta rodando!
    echo.
    echo       SOLUCAO: Inicie o MySQL primeiro
    echo.
    pause
    goto MENU
)
echo       MySQL esta rodando

:: Para processos antigos nas portas
echo.
echo [2/5] Liberando portas...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :19000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul
echo       Portas liberadas

:: Inicia o Backend
echo.
echo [3/5] Iniciando Backend Spring Boot (porta 8081)...
echo       Aguarde aproximadamente 15 segundos...
start "iBank Backend" cmd /k "cd /d Z:\laragon\www\java\backend && set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot" && set "PATH=%%JAVA_HOME%%\bin;Z:\laragon\bin\maven\bin;%%PATH%%" && echo Iniciando Backend... && mvn spring-boot:run"
timeout /t 10 /nobreak >nul
echo       Backend iniciado

:: Inicia o Frontend
echo.
echo [4/5] Iniciando Frontend React + Vite (porta 3000)...
start "iBank Frontend" cmd /k "cd /d Z:\laragon\www\java\frontend-web && echo Iniciando Frontend... && npx vite"
timeout /t 5 /nobreak >nul
echo       Frontend iniciado

:: Inicia o Mobile
echo.
echo [5/5] Iniciando Mobile React Native + Expo (porta 19000)...
start "iBank Mobile" cmd /k "cd /d Z:\laragon\www\java\frontend-mobile && echo Iniciando Mobile... && npm start"
timeout /t 5 /nobreak >nul
echo       Mobile iniciado

echo.
echo ========================================================
echo               SISTEMA INICIADO!
echo ========================================================
echo.
echo   Backend:  http://localhost:8081
echo   Frontend: http://localhost:3000
echo   Mobile:   Expo DevTools (porta 19000)
echo.
pause
goto MENU

:START_BACKEND
cls
echo.
echo Iniciando Backend Spring Boot...
echo.
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
set "PATH=%JAVA_HOME%\bin;Z:\laragon\bin\maven\bin;%PATH%"

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

start "iBank Backend" cmd /k "cd /d Z:\laragon\www\java\backend && set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot" && set "PATH=%%JAVA_HOME%%\bin;Z:\laragon\bin\maven\bin;%%PATH%%" && echo Iniciando Backend... && mvn spring-boot:run"
echo Backend iniciando em nova janela...
echo.
timeout /t 5 /nobreak >nul
goto MENU

:START_FRONTEND
cls
echo.
echo Iniciando Frontend React + Vite...
echo.
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

start "iBank Frontend" cmd /k "cd /d Z:\laragon\www\java\frontend-web && echo Iniciando Frontend... && npx vite"
echo Frontend iniciando em nova janela...
echo.
timeout /t 5 /nobreak >nul
goto MENU

:START_MOBILE
cls
echo.
echo Iniciando Mobile React Native + Expo...
echo.
echo NOTA: Certifique-se de ter instalado as dependencias com 'npm install'
echo.
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :19000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

start "iBank Mobile" cmd /k "cd /d Z:\laragon\www\java\frontend-mobile && echo Iniciando Mobile... && npm start"
echo.
echo Mobile iniciando...
echo.
echo Para testar:
echo   - Instale o app 'Expo Go' no seu celular
echo   - Escaneie o QR Code que aparecera na janela
echo   - Ou pressione 'a' para Android ou 'i' para iOS
echo.
timeout /t 5 /nobreak >nul
goto MENU

:STOP_BACKEND
cls
echo.
echo Parando Backend...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
echo Backend parado.
echo.
timeout /t 2 /nobreak >nul
goto MENU

:STOP_FRONTEND
cls
echo.
echo Parando Frontend...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
echo Frontend parado.
echo.
timeout /t 2 /nobreak >nul
goto MENU

:STOP_MOBILE
cls
echo.
echo Parando Mobile...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :19000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
echo Mobile parado.
echo.
timeout /t 2 /nobreak >nul
goto MENU

:STOP_ALL
cls
echo.
echo Parando todos os servicos...
echo.
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
    echo Parando Backend (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Parando Frontend (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :19000 ^| findstr LISTENING') do (
    echo Parando Mobile (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)
echo.
echo Todos os servicos foram parados.
echo.
timeout /t 3 /nobreak >nul
goto MENU

:END
cls
echo.
echo Encerrando monitor...
echo.
echo AVISO: Os servicos continuarao rodando em segundo plano.
echo        Para para-los, use a opcao 8 do menu.
echo.
timeout /t 3 /nobreak >nul
exit
