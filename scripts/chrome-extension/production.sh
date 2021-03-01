#!/bin/sh
#parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
#cd "$parent_path"

# Build Production Manifest
echo "Generating the production manifest.json..."
export REACT_APP_BACKEND_SERVER_ADDRESS=peak-backend.onrender.com
export REACT_APP_APP_SERVER_ADDRESS=peak-app-server.onrender.com
export REACT_APP_ENV=prod
cp ./scripts/chrome-extension/base_manifest.json public/manifest.json

echo "Building the production chrome-extension..."
webpack --config build-config/webpack/webpack.chrome-extension.config.js --mode=production
