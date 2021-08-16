#! /usr/bin/env bash

# Install node.js dependencies
npm install child_process
npm install express
npm install fs

# Build tsltools
git clone https://github.com/wonhyukchoi/tsltools
cd tsltools
make
cd -

echo "Requesting sudo access for docker."
sudo docker pull wonhyukchoi/tlsf_to_aag
