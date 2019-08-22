#!/bin/bash

cd "$(dirname "$0")"    # Change directory to the folder containing this file
cd ../..                # Change directory to project's root folder

./node_modules/.bin/package-cjson compare-silent || exit 1
