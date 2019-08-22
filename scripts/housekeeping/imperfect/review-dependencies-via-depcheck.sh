#!/bin/bash

cd "$(dirname "$0")" # Change directory to the folder containing this file
cd ../../..          # Change directory to project's root folder

# Colors:
# http://stackoverflow.com/questions/5412761/using-colors-with-printf/5413029#5413029
# http://stackoverflow.com/questions/4332478/read-the-current-text-color-in-a-xterm/4332530#4332530
NORMAL=$(tput sgr0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
BLUE=$(tput setaf 4)
GRAY=$(tput setaf 240)

if which depcheck > /dev/null; then
    :   # do nothing because depcheck exists
else
    printf "${RED}To use this script, you need to install depcheck globally using:\n    $ npm install --global depcheck\n${NORMAL}"
    exit 1
fi

echo "${BLUE}$ pwd${NORMAL}"
               pwd

echo ""

echo "${BLUE}$ depcheck${NORMAL}"
               depcheck
