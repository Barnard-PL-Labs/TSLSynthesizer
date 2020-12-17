#! /usr/bin/env bash

file_name=$1
file_header=${file_name:0:-4}
tlsf="$file_header.tlsf"
aag="$file_header.aag"

# Build TLSF
../tsltools/tsl2tlsf $file_name | cat > $tlsf

# Build AAG from docker
sudo docker run --rm -v $(pwd):/files -it strix_v2 /Strix/scripts/strix_tlsf.sh files/$tlsf > $aag

# Output result of aag
cat $aag
