#!/bin/sh
#parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
#cd "$parent_path"

# Build Production Manifest
echo "Generating the development manifest.json..."
export REACT_APP_ENV=dev
cp ./scripts/chrome-extension/base_manifest.json public/manifest.json
echo "Building the development chrome-extension..."
webpack --config build-config/webpack/webpack.chrome-extension.config.js --mode=development --watch