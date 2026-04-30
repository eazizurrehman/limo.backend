#!/bin/bash

branch="$(git rev-parse --abbrev-ref HEAD)"

PROTECTED_BRANCHES=(main master prod production staging)

for protected in "${PROTECTED_BRANCHES[@]}"; do
  if [ "$branch" = "$protected" ]; then
    echo "Error: Direct commits to $branch branch are not allowed."
    exit 1
  fi
done