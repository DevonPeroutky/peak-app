#!/bin/bash
export BROWSER=none
export PORT=3000
export REACT_APP_DIST=electron
export REACT_APP_ENV=dev
react-scripts start

echo "Running electron in watch mode"
wait-on http://localhost:3000 && tsc -p electron -w

echo "Compiling Electron process"
wait-on http://localhost:3000 && tsc -p electron && electron ."


# concurrently
#   \"BROWSER=none REACT_APP_DIST=electron REACT_APP_ENV=dev react-scripts start\"
#   \"wait-on http://localhost:3000 && tsc -p electron -w\"
#   \"wait-on http://localhost:3000 && tsc -p electron && electron .\"
