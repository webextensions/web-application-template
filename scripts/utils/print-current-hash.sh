#!/bin/bash

cd "$(dirname "$0")"    # Change directory to the folder containing this file
cd ../../               # Change directory to project's root folder

source ./utils/bash-helpers/color-codes.sh

# https://stackoverflow.com/questions/949314/how-to-retrieve-the-hash-for-the-current-commit-in-git/949391#949391
printf "At commit: ${BLUE}$(git rev-parse --short HEAD)\n${NORMAL}"
