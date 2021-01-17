#! /usr/bin/env bash

file_name=$1
file_header=${file_name:0:-4}
tlsf="$file_header.tlsf"
aag="$file_header.aag"
js="$file_header.js"
start=$(date +%s%N | cut -b1-13)

# Build TLSF
tsltools/tsl2tlsf $file_name | cat > $tlsf

# Build AAG from docker
sudo docker run --rm -v $(pwd):/files -i wonhyukchoi/tlsf_to_aag /Strix/scripts/strix_tlsf.sh files/$tlsf > /dev/null

end=$(date +%s%N | cut -b1-13)
elapsed=$[ end - start ]
echo $elapsed >> log.txt
