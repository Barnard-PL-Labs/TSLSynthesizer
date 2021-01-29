#!/usr/bin/env python3
import os
from datetime import datetime

with open("log_6_iff.txt", "r") as f:
    timed_out_idx = []
    for data_point in f.read().split('\n')[:-1]:
        if(data_point[-1] == 'f'):
            timed_out_idx.append(int(data_point[:-2]))

with open("complexRandSpecs_6_iff.log", "r") as f:
    specs = f.read()

spec_list = specs.split("\n***\n\n")

timed_out_specs = []
for idx in timed_out_idx:
    timed_out_specs.append((idx, spec_list[idx]))

def run_once(spec):
    with open("temp.tsl", "w") as f:
        f.write(spec)
    os.system("./synthesize.sh temp.tsl")

num_iters = len(timed_out_specs)

for n ,(idx, single_spec) in enumerate(timed_out_specs):
    run_once(single_spec)
    now = datetime.now().strftime("%H:%M:%S")
    print(f"Starting index {idx} at {now}")
    print(f"Iter: {n}/{num_iters}")
