#!/bin/bash

cd "$(dirname "$0")" # Change directory to the folder containing this file
cd ../../            # Change directory to project's root folder

source ./utils/bash-helpers/color-codes.sh

packageCjson="$("pwd")/node_modules/.bin/package-cjson"

updateAndGeneratePackageJson() {
    printf "\n${BLUE}$ pwd${NORMAL}\n"
                       pwd

    printf "\n${BLUE}$ $packageCjson --mode update-and-generate-package-json${NORMAL}\n"
                       $packageCjson --mode update-and-generate-package-json
}

updateAndGeneratePackageJson

printf "\n"
printf "${GREEN} ✔ Done ${NORMAL}\n\n";
