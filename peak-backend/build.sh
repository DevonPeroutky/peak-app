#!/usr/bin/env bash
# exit on error
set -o errexit

# Pre-flight check
echo "RENDER_EXTERNAL_HOSTNAME is $RENDER_EXTERNAL_HOSTNAME"

# Initial setup
echo "Compiling production..."
mix deps.get --only prod
MIX_ENV=prod mix compile
echo "Finished!"

# Compile assets
# npm install --prefix ./assets
# npm run deploy --prefix ./assets
echo "Generating the digest..."
mix phx.digest
echo "Finished!"

# Build the release and overwrite the existing release directory
MIX_ENV=prod mix release --overwrite
echo "Finished!"
