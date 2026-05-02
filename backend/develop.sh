#!/usr/bin/env bash
set -e

# nvm conflicts with npm_config_prefix set by Homebrew Node installs
unset npm_config_prefix

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use 20
export PATH="$NVM_BIN:$PATH"

exec node_modules/.bin/strapi develop
