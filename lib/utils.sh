#!/bin/bash

require_cmd() {
    local cmd="$1"
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Error: $cmd is not installed or not in PATH." >&2
        exit 1
    fi
}

require_file() {
    local file="$1"
    if [ ! -f "$file" ]; then
        echo "Error: $file not found." >&2
        exit 1
    fi
}

create_dir_if_missing() {
    local dir="$1"

    if [ ! -d "$dir" ]; then
        echo "Creating missing directory: $dir"
        mkdir -p "$dir"
    fi
}
 
create_file_if_missing() {
    local file="$1"
    local dir
    dir=$(dirname "$file")

    create_dir_if_missing "$dir"

    if [ ! -f "$file" ]; then
        echo "Creating missing file: $file"
        touch "$file"
    fi
}
