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
BOLD=$(tput bold)

cd "$(dirname "$0")"    # Change directory to the folder containing this file
cd ../../               # Change directory to project's root folder

# https://stackoverflow.com/questions/949314/how-to-retrieve-the-hash-for-the-current-commit-in-git/949391#949391
echo "At commit: ${BLUE}$(git rev-parse --short HEAD)${NORMAL}"
