@echo off
title Sistema Bancario
cd /d "%~dp0"
javac -d bin -cp mysql-connector-j-8.3.0.jar -encoding UTF-8 src\Main.java src\dao\*.java src\model\*.java src\service\*.java src\util\*.java src\view\*.java
if errorlevel 1 (
    echo Erro na compilacao!
    pause
    exit /b 1
)
java -cp "bin;mysql-connector-j-8.3.0.jar" Main
pause
