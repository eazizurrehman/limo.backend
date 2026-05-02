#!/usr/bin/env bash
# Runs after tsc-watch compilation. tsc-watch --onSuccess accepts only a single
# command (not `a && b`), so this script chains tsc-alias + node.

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

"$ROOT/node_modules/.bin/tsc-alias" -p tsconfig.json
exec node dist/index
