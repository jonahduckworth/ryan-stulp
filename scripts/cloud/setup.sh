#!/usr/bin/env bash
set -euo pipefail
ryan_repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
export RYAN_CLOUD_TOOLS="${RYAN_CLOUD_TOOLS:-$ryan_repo_root/.cloud-tools}"
export npm_config_cache="$RYAN_CLOUD_TOOLS/npm-cache"
if ! (source "$ryan_repo_root/scripts/cloud/activate.sh") 2>/dev/null; then
  npm install --prefix "$RYAN_CLOUD_TOOLS/node22" --registry=https://registry.npmjs.org \
    --no-package-lock --no-audit --no-fund --save-exact node@22.23.3 npm@10.9.8
fi
source "$ryan_repo_root/scripts/cloud/activate.sh"
cd "$ryan_repo_root"
node --version
npm --version
npm ci --include=dev --no-audit --no-fund
# Matching browser and recording binaries; no system packages or privileges changed.
./node_modules/.bin/playwright install chromium ffmpeg
