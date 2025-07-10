#!/bin/bash

# Check if a directory argument was passed
if [ -z "$1" ]; then
  echo "Usage: $0 <remote_directory>"
  exit 1
fi

REMOTE_DIR="$1"
REMOTE_HOST="root@170.64.228.123"
FILES=("local.db-shm" "local.db" "local.db-info" "local.db-wal")

for file in "${FILES[@]}"; do
  scp "$REMOTE_HOST:./$REMOTE_DIR/$file" "./$file"
done
