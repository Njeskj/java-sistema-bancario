@echo off
REM Script de Backup Automático do MySQL para Windows
REM Agendar no Task Scheduler

SET DB_NAME=java
SET DB_USER=root
SET DB_PASS=
SET BACKUP_DIR=C:\backups\mysql
SET DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
SET DATE=%DATE: =0%
SET BACKUP_FILE=%BACKUP_DIR%\%DB_NAME%_backup_%DATE%.sql

REM Criar diretório se não existir
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo [%date% %time%] Iniciando backup do banco %DB_NAME%...

REM Realizar backup
"C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysqldump.exe" -u %DB_USER% %DB_NAME% > "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo [%date% %time%] Backup criado com sucesso: %BACKUP_FILE%
    
    REM Comprimir com 7zip se disponível
    if exist "C:\Program Files\7-Zip\7z.exe" (
        "C:\Program Files\7-Zip\7z.exe" a -sdel "%BACKUP_FILE%.7z" "%BACKUP_FILE%"
        echo [%date% %time%] Backup comprimido: %BACKUP_FILE%.7z
    )
    
    REM Remover backups com mais de 30 dias
    forfiles /p "%BACKUP_DIR%" /m "%DB_NAME%_backup_*.sql*" /d -30 /c "cmd /c del @path" 2>nul
    
    echo [%date% %time%] Backup concluído com sucesso!
) else (
    echo [%date% %time%] ERRO: Falha ao criar backup!
    exit /b 1
)
