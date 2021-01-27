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
sudo docker run --rm -v $(pwd):/files -i wonhyukchoi/tlsf_to_aag /Strix/scripts/strix_tlsf.sh files/$tlsf > $aag

end=$(date +%s%N | cut -b1-13)
elapsed=$[ end - start ]

# Change to unix format
dos2unix $aag 2> /dev/null

# Check for realizability
is_realizable=$(head -n1 $aag)

realizable="y"
if [ "$is_realizable" = "UNREALIZABLE" ]; then
	realizable="n"	
fi

result="$elapsed+$realizable"

echo $result >> log.txt






