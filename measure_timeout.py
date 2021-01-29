import subprocess
import shlex
import os
from tqdm import tqdm

with open("complexRandSpecs_4_iff_predicate.log", "r") as f:
    specs = f.read()

spec_list = specs.split("\n***\n\n")

assert len(spec_list) == 1000

def run_once(spec, index):
    with open("temp.tsl", "w") as f:
        f.write(spec)
    try:
        subprocess.run(shlex.split("./synthesize.sh temp.tsl"), timeout=15)
    except subprocess.TimeoutExpired:
        with open("log.txt", "a") as f:
            f.write(str(index) + '+f\n')
        os.system("sudo killall strix")


for n, single_spec in tqdm(enumerate(spec_list), total=len(spec_list)):
    run_once(single_spec,n)
