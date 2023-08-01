#!/bin/bash

# This script runs all health checks in one go

cd "$(dirname "$0")"    # Change directory to the folder containing this file
cd ../../               # Change directory to project's root folder

source ./utils/bash-helpers/color-codes.sh

printf "\n${BLUE}$ cd \"$(dirname "$0")\" ${YELLOW}# cd to the directory containing this file${NORMAL}\n"
                   cd  "$(dirname "$0")"

printf "\n${BLUE}$ ./check-node-version.mjs --return-exit-code${NORMAL}\n"
                   ./check-node-version.mjs --return-exit-code
exitCodeNodeVersion=$?

printf "\n${BLUE}$ ./ensure-no-npm-links.sh${NORMAL}\n"
                   ./ensure-no-npm-links.sh
exitCodeNoNpmLinks=$?

printf "\n${BLUE}$ ./compare-package-json-cjson.sh${NORMAL}\n"
                   ./compare-package-json-cjson.sh
exitCodeComparePackageJsonCjson=$?

printf "\n${BLUE}$ ./check-npm-install-status/check-npm-install-status.mjs --return-exit-code${NORMAL}\n"
                   ./check-npm-install-status/check-npm-install-status.mjs --return-exit-code
exitCodeCheckNpmInstallStatus=$?

printf "\n${BLUE}$ npm run lint${NORMAL}\n"
                   npm run lint
exitCodeLint=$?

printf "\n${BLUE}$ npm run mocha${NORMAL}\n"
                   npm run mocha
exitCodeMocha=$?


if [ "$exitCodeNodeVersion" == "0" ] &&
   [ "$exitCodeNoNpmLinks" == "0" ] &&
   [ "$exitCodeComparePackageJsonCjson" == "0" ] &&
   [ "$exitCodeCheckNpmInstallStatus" == "0" ] &&
   [ "$exitCodeLint" == "0" ] &&
   [ "$exitCodeMocha" == "0" ]; then
    printf "\n"
    printf "${GREEN}Success: All is well :-) ${NORMAL}\n"
    exit 0
else
    if [ "$exitCodeNodeVersion" != "0" ]; then
        printf "\n${RED}Error: Please run \"nvm use\" to use the correct node version${NORMAL}"
    fi
    if [ "$exitCodeNoNpmLinks" != "0" ]; then
        printf "\n${RED}Error: You might be having some npm links under node_modules/ directory${NORMAL}"
    fi
    if [ "$exitCodeComparePackageJsonCjson" != "0" ]; then
        printf "\n${RED}Error: package.json and package.cjson are not equivalent${NORMAL}"
    fi
    if [ "$exitCodeCheckNpmInstallStatus" != "0" ]; then
        printf "\n${RED}Error: You might need to run npm install${NORMAL}"
    fi
    if [ "$exitCodeLint" != "0" ]; then
        printf "\n${RED}Error: Failure in code linting${NORMAL}"
    fi
    if [ "$exitCodeMocha" != "0" ]; then
        printf "\n${RED}Error: Failure in running Mocha tests${NORMAL}"
    fi
    printf "\n"
    node -e "require('node-notifier').notify({title: 'Something is wrong', message: '\n\u2000\n:-(\n\u2000\nPlease check'});"
    exit 1
fi
