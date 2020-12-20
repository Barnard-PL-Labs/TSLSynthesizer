#! /usr/bin/env bash

file_name=$1
file_header=${file_name:0:-4}
tlsf="$file_header.tlsf"
aag="$file_header.aag"
js="$file_header.kt"

# Build TLSF
../tsltools/tsl2tlsf $file_name | cat > $tlsf

# Build AAG from docker
sudo docker run --rm -v $(pwd):/files -it strix_v2 /Strix/scripts/strix_tlsf.sh files/$tlsf > $aag

# Output result of aag
cat $aag | head -1

# Remove first line 
# https://stackoverflow.com/a/339941/11801882
tail -n +2 "$aag" > "$aag.tmp" && mv "$aag.tmp" "$aag"

# Change to unix format
dos2unix $aag 2> /dev/null

# Synthesize the resulting code
../tsltools/cfm2code JavaScript $aag > $js
