#!/bin/bash

cd "$(dirname "$0")"    # Change directory to the folder containing this file
cd ../../               # Change directory to project's root folder

source ./utils/bash-helpers/color-codes.sh

printf "\n${YELLOW}About to clean up node_modules directory (will be reinstalled automatically).${NORMAL}"

if which countdown > /dev/null; then
    : # do nothing (as such) because countdown exists
else
    printf "\n${YELLOW}Installing @webextensions/countdown\n${NORMAL}"
    npm install --global @webextensions/countdown
fi

printf "\n${YELLOW}Countdown: ${NORMAL}"

countdown 5

## Alternative Approach 1
# printf "\n"
# npx --yes --prefer-offline @webextensions/countdown 5

## Alternative Approach 2
# printf  "5" ; sleep 1
# printf " 4" ; sleep 1
# printf " 3" ; sleep 1
# printf " 2" ; sleep 1
# printf " 1" ; sleep 1

if [ $? -ne 0 ]; then
    printf "\n${RED}Aborted${NORMAL}\n"
    exit 1
fi

printf "\n${GREEN}Go ahead ...${NORMAL}\n"

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
