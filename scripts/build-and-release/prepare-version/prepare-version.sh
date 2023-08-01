#!/bin/bash

# This script assists in preparing changes for a new release version (to be followed by git commit, tag and push operations).

# Steps that happen when a new version is created by "npm version ..." command:
#     (Note: Paths are w.r.t. project root)
#
#     Step 1: (Handled by "npm version ..." command)
#         Update and git add ./package.json
#         Update and git add ./package-lock.json
#     Step 2: (Handled by npm script "version")
#         Update and git add ./package.cjson
#     Step 3: (Handled by "npm version ..." command)
#         git commit -m "<version>"
#         git tag -a "v<version>" -m "<version>"
#     Step 4: (Should be handled by npm script "postversion")
#         git push --follow-tags

cd "$(dirname "$0")" # Change directory to the folder containing this file
cd ../../../         # Change directory to project's root folder

source ./utils/bash-helpers/color-codes.sh

# https://stackoverflow.com/questions/2870992/automatic-exit-from-bash-shell-script-on-error
# https://stackoverflow.com/questions/821396/aborting-a-shell-script-if-any-command-returns-a-non-zero-value
set -e

if which jq > /dev/null; then
    : # do nothing because "jq" already exists
else
    printf "${RED}To use this script ($0), we need to install jq using:${NORMAL}"
    printf "\n${RED}    $ sudo apt install jq${NORMAL}"
    printf "\n"
    exit 1
fi

packageVersionWithQuotes=$(jq ".version" ./package.json)
packageVersionWithoutQuotes=$(jq --raw-output ".version" ./package.json)

# Update and git add:
#     ./package.cjson

sed -i --regexp-extended 's/"version": "[0-9.]+"/"version": '$packageVersionWithQuotes'/' ./package.cjson

set -x

git add ./package.cjson
