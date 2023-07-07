#!/bin/bash

# Database Configuration
DB_CONTAINER_NAME="ctnr"
DB_NAME="mysql"
DB_USER="root"
DB_PASSWORD="mysecret"

# Backup Filename and Path
BACKUP_DIR="/path/to/backup/directory"
BACKUP_FILE="${BACKUP_DIR}/backup.sql"

# Backup Command
docker exec ${DB_CONTAINER_NAME} mysqldump -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${BACKUP_FILE}
