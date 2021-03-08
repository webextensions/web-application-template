#!/bin/bash

cd "$(dirname "$0")" # Change directory to the folder containing this file
cd ../../../         # Change directory to project's root folder

source ./utils/bash-helpers/color-codes.sh

if which depcheck > /dev/null; then
    :   # do nothing because depcheck exists
else
    printf "${RED}To use this script, you need to install depcheck globally using:\n    $ npm install --global depcheck\n${NORMAL}"
    exit 1
fi

printf "${BLUE}$ pwd\n${NORMAL}"
                 pwd

printf "\n"

printf "${BLUE}$ depcheck\n${NORMAL}"
                 depcheck
