#! /usr/bin/env bash

file_name=$1
file_header=${file_name%%.*}
tlsf="$file_header.tlsf"
aag="$file_header.aag"
js="$file_header.js"

# Build TLSF
tsltools/tsl2tlsf $file_name | cat > $tlsf

# Build AAG from docker
sudo docker run --rm -v $(pwd):/files -i wonhyukchoi/tlsf_to_aag /Strix/scripts/strix_tlsf.sh files/$tlsf > $aag

# Change to unix format
dos2unix $aag 2> /dev/null

# Check for realizability
is_realizable=$(head -n1 $aag)

if [ "$is_realizable" = "UNREALIZABLE" ]; then
	echo $is_realizable >&2
	exit 1
fi

# Remove first line 
# https://stackoverflow.com/a/339941/11801882
tail -n +2 "$aag" > "$aag.tmp" && mv "$aag.tmp" "$aag"

# Synthesize the resulting code
tsltools/cfm2code $aag --webaudio 
