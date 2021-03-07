#!/bin/bash

cd "$(dirname "$0")" # Change directory to the folder containing this file
cd ../..             # Change directory to project's root folder

# Generate package.json from package.cjson
./node_modules/.bin/package-cjson --mode generate-package-json || exit 1
