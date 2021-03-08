#!/bin/bash

# Colors:
# https://stackoverflow.com/questions/5412761/using-colors-with-printf/5413029#5413029
# https://stackoverflow.com/questions/4332478/read-the-current-text-color-in-a-xterm/4332530#4332530
# https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux/5947802#5947802
# https://stackoverflow.com/questions/2616906/how-do-i-output-coloured-text-to-a-linux-terminal#comment35479579_17469726

 NORMAL="\033[0m"    #  NORMAL=$(tput sgr0)
  BLACK="\033[0;30m" #   BLACK=$(tput setaf 0)
    RED="\033[0;31m" #     RED=$(tput setaf 1)
  GREEN="\033[0;32m" #   GREEN=$(tput setaf 2)
 YELLOW="\033[0;33m" #  YELLOW=$(tput setaf 3)
   BLUE="\033[0;34m" #    BLUE=$(tput setaf 4)
MAGENTA="\033[0;35m" # MAGENTA=$(tput setaf 5)
   CYAN="\033[0;36m" #    CYAN=$(tput setaf 6)
  WHITE="\033[0;37m" #   WHITE=$(tput setaf 7)
   GRAY="\033[0;90m" #    GRAY=$(tput setaf 8)
   BOLD="\033[1m"    #    BOLD=$(tput bold)
