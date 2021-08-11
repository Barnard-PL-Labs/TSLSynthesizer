#! /usr/bin/env bash

file_name=$1
file_header=${file_name%%.*}
modTsl="$newTSLMT.tsl"
tlsf="$file_header.tlsf"
aag="$file_header.aag"
js="$file_header.js"

# Run TSLMT -> TSL 
temos/temos.sh $file_name | cat > $modTsl
#./temos.sh $file_name | cat > $modTsl

# Build TLSF
tsltools/tsl2tlsf $modTsl | cat > $tlsf

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
tsltools/cfm2code $aag -o temp.js --webaudio 
chmod 744 temp.js
echo "$(cat temp.js)"
