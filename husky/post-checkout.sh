#!/bin/bash

# cd to the folder containing this script
cd "$(dirname "$0")"

../scripts/health-checks/check-node-version.js

../scripts/health-checks/compare-package-json-cjson.sh

../scripts/health-checks/check-npm-install-status/check-npm-install-status.js
