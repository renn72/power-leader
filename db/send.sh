#!/bin/bash

# Check if a directory argument was passed

REMOTE_DIR="blackout_db_1"
REMOTE_HOST="root@170.64.228.123"
FILES=("local.db-shm" "local.db" "local.db-info" "local.db-wal")

for file in "${FILES[@]}"; do
  scp "./$file" "$REMOTE_HOST:./$REMOTE_DIR/$file"
done
