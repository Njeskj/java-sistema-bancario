@echo off
chcp 65001 >nul
title Test Menu
color 0A

:MENU
cls
echo.
echo ========================================================
echo                    MENU TESTE
echo ========================================================
echo.
echo   [1] Opcao 1
echo   [0] Sair
echo.
set /p "opcao=Digite sua opcao: "

if "%opcao%"=="1" goto OP1
if "%opcao%"=="0" goto END
goto MENU

:OP1
echo Opcao 1 selecionada
pause
goto MENU

:END
echo Saindo...
timeout /t 2 /nobreak >nul
exit
