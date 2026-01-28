#!/bin/bash

# Script de Backup Automático do MySQL
# Configurar no cron: 0 2 * * * /path/to/backup-mysql.sh

# Configurações
DB_NAME="${DB_NAME:-java}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/mysql}"
RETENTION_DAYS=30
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_$DATE.sql.gz"

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

# Log
echo "[$(date)] Iniciando backup do banco $DB_NAME..."

# Realizar backup
if [ -z "$DB_PASS" ]; then
    mysqldump -u "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"
else
    mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$BACKUP_FILE"
fi

# Verificar sucesso
if [ $? -eq 0 ]; then
    echo "[$(date)] Backup criado com sucesso: $BACKUP_FILE"
    
    # Tamanho do arquivo
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "[$(date)] Tamanho do backup: $SIZE"
    
    # Remover backups antigos
    echo "[$(date)] Removendo backups com mais de $RETENTION_DAYS dias..."
    find "$BACKUP_DIR" -name "${DB_NAME}_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    
    # Upload para S3/Azure (opcional)
    # aws s3 cp "$BACKUP_FILE" s3://mybucket/backups/
    # az storage blob upload --account-name myaccount --container backups --file "$BACKUP_FILE"
    
    echo "[$(date)] Backup concluído com sucesso!"
    exit 0
else
    echo "[$(date)] ERRO: Falha ao criar backup!"
    exit 1
fi
