#!/bin/bash
export BROWSER=none
export PORT=3001
export REACT_APP_DIST=electron
export REACT_APP_ENV=dev
react-scripts start &

echo "Running electron in watch mode"
wait-on http://localhost:3001 && tsc -p electron -w

echo "Compiling Electron process"
wait-on http://localhost:3001 && tsc -p electron && electron ."