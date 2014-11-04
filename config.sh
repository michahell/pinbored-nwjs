#!/bin/bash

# increase max open file size for OSX
# ulimit -S -n 4096

# optional install of required global NPM modules
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
exit 0
