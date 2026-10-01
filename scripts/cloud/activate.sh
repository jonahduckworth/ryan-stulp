#!/usr/bin/env bash
# Source this file for interactive work; run.sh sources it for every command.
ryan_activation_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
export RYAN_CLOUD_TOOLS="${RYAN_CLOUD_TOOLS:-$ryan_activation_root/.cloud-tools}"
export npm_config_cache="$RYAN_CLOUD_TOOLS/npm-cache"
ryan_activation_prefix="$RYAN_CLOUD_TOOLS/node22"
# Reuse the runtime already supplied by this cloud workspace when available.
if [[ ! -x "$ryan_activation_prefix/node_modules/.bin/node" && -x /workspace/.onboarding/node22/node_modules/.bin/node ]]; then
  ryan_activation_prefix=/workspace/.onboarding/node22
fi
if [[ ! -x "$ryan_activation_prefix/node_modules/.bin/node" ]] ||
   [[ "$("$ryan_activation_prefix/node_modules/.bin/node" --version)" != v22.23.3 ]] ||
   [[ ! -x "$ryan_activation_prefix/node_modules/.bin/npm" ]] ||
   [[ "$("$ryan_activation_prefix/node_modules/.bin/node" "$ryan_activation_prefix/node_modules/npm/bin/npm-cli.js" --version)" != 10.9.8 ]]; then
  echo 'Cloud Node runtime missing or mismatched. Run: bash scripts/cloud/setup.sh' >&2
  return 1
fi
export PATH="$ryan_activation_prefix/node_modules/.bin:$PATH"
export PLAYWRIGHT_BROWSERS_PATH="$RYAN_CLOUD_TOOLS/browsers"
export NEXT_TELEMETRY_DISABLED=1
unset ryan_activation_prefix ryan_activation_root
