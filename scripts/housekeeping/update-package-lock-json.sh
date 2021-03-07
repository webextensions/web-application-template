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

cd "$(dirname "$0")"    # Change directory to the folder containing this file
cd ../../               # Change directory to project's root folder

printf "\n${YELLOW}About to clean up node_modules directory (will be reinstalled automatically):${NORMAL}"
printf " 5" ; sleep 1
printf " 4" ; sleep 1
printf " 3" ; sleep 1
printf " 2" ; sleep 1
printf " 1" ; sleep 1
printf " Start"
printf "\n"

updatePackageLockJson() {
    printf "\n${BLUE}$ pwd${NORMAL}\n"
                       pwd

    printf "\n${BLUE}$ rm -f package-lock.json${NORMAL}\n"
                       rm -f package-lock.json

    printf "\n${BLUE}$ rm -rf node_modules${NORMAL}\n"
                       rm -rf node_modules

    printf "\n${BLUE}$ npm install${NORMAL}\n"
                       npm install
}

updatePackageLockJson
