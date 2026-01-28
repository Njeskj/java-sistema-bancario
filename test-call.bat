@echo off
chcp 65001 >nul
title Test with Call
color 0A

echo Antes do call
call :TESTE
echo Depois do call
pause
goto FIM

:TESTE
echo Dentro da funcao TESTE
goto :EOF

:FIM
exit
