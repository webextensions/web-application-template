#!/bin/bash

cd "$(dirname "$0")"    # Change directory to the folder containing this file
cd ../../               # Change directory to project's root folder

source ./utils/bash-helpers/color-codes.sh

printf "\n${BLUE}Checking for npm-linked packages: ${NORMAL}"

# https://stackoverflow.com/questions/6565694/inform-right-hand-side-of-pipeline-of-left-side-failure#comment39203082_17611122
# https://askubuntu.com/questions/522051/how-to-list-all-symbolic-links-in-a-directory/522059#522059
# Note: Not using "grep ^l" because grep exits with code 1 when no results are found
matchCount=$(set -o pipefail ; find ./node_modules/ -maxdepth 1 -type l -ls | wc -l)
exitCode="$?"

if [[ $exitCode != "0" ]]; then
    printf "${RED}Error: Could not execute the check for npm linked packages\n${NORMAL}"
    exit 1
fi

if [[ $matchCount == "0" ]]; then
    printf "${GREEN}Folder node_modules/ is free of npm-linked packages\n\n${NORMAL}"
    exit 0
else
    printf "${RED}npm linked package(s) found\n${NORMAL}"
    printf "${YELLOW}Warning: Get rid of npm-linked packages (they are generally used for debugging purposes)${NORMAL}"

    printf "\n${YELLOW}\n# List the npm-linked packages${NORMAL}\n"
    printf "${BLUE}$ ls -l ./node_modules | grep ^l\n${NORMAL}"
                     ls -l ./node_modules | grep ^l
    printf "\n"
    exit 1
fi
