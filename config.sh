#!/bin/bash

# optional install of required global NPM modules if they are not installed
echo ' --- NPM PREINSTALL REQS TEST ---'

function warningMsg () {
  echo '\033[0;33m'"$1"'\033[0m'
}

# test for npm modules
command -v which node >/dev/null 2>&1 || { HAS_NODE=0; warningMsg >&2 "warning: node not found ?"; }
command -v which npm >/dev/null 2>&1 || { HAS_NPM=0; warningMsg >&2 "warning: npm not found ?"; }

npm list -g --depth=0 | grep 'grunt-cli' >/dev/null 2>&1 || { HAS_GRUNT=0; warningMsg >&2 "warning: grunt-cli not installed -g"; }
npm list -g --depth=0 | grep 'bower' >/dev/null 2>&1 || { HAS_BOWER=0; warningMsg >&2 "warning: bower not installed -g"; }

echo -n 'Do you wish to install grunt-cli and bower locally ? This requires sudo. if unsure, answer no and install them yourself. the npm postinstall task which is run after this will likely error since grunt will not be installed if you choose no. (y/n) : '

read answer

if  [ $answer == y ]; then
  sudo npm install -g grunt-cli && sudo npm install -g bower
  exit 0
elif [ $answer == n ]; then
  echo 'grunt and bower are both needed to build this project. please install them yourself:'
  echo 'sudo npm install -g grunt-cli'
  echo 'sudo npm install -g bower'
fi

echo ' --- NPM INSTALL ---'
exit 0
