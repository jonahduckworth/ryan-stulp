#!/usr/bin/env bash
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/activate.sh"
if [[ $# -eq 0 ]]; then
  echo 'Usage: bash scripts/cloud/run.sh <command> [arguments...]' >&2
  exit 2
fi
exec "$@"
