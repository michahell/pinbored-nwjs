
# increase max open file size for OSX
ulimit -S -n 4096

# export environment variable required for testing on node-webkit
export NODEWEBKIT_BIN='/Applications/node-webkit.app/Contents/MacOS/node-webkit'