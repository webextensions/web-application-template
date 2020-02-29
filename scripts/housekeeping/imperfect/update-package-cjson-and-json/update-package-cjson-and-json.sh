#!/bin/bash

# Colors:
# http://stackoverflow.com/questions/5412761/using-colors-with-printf/5413029#5413029
# http://stackoverflow.com/questions/4332478/read-the-current-text-color-in-a-xterm/4332530#4332530
NORMAL=$(tput sgr0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
GRAY="\033[0;30m"

cd "$(dirname "$0")" # Change directory to the folder containing this file
cd ../../../..       # Change directory to project's root folder

# Bring package.cjson and package.json in sync before any potential updates
./scripts/housekeeping/generate-package-json.sh

# Make changes for the potential updates
./scripts/housekeeping/imperfect/update-package-cjson-and-json/update-package-cjson.js

# Bring package.cjson and package.json in sync after package.cjson has been updated
./scripts/housekeeping/generate-package-json.sh

printf "${GREEN} ✓ Done ${NORMAL}\n";
