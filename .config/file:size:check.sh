#!/bin/bash

. "$PWD/lib/utils.sh"

MAX_SIZE=$((1024*1024*1)) # 1MB

ALL_FILES=$(git ls-files)

for file in $ALL_FILES; do
  if [ -f "$file" ]; then
    FILE_SIZE=$(wc -c <"$file")
    
    if [ "$FILE_SIZE" -gt "$MAX_SIZE" ]; then
      echo "File $file is larger than 1MB"
      echo "File Size:     $FILE_SIZE bytes"
      echo "Max Size:      $MAX_SIZE bytes"
      exit 1
    fi
  fi
done