import subprocess
import shlex
import os
from tqdm import tqdm

with open("complexRandSpecs_6_iff.log", "r") as f:
    specs = f.read()

after_i = 34

spec_list = specs.split("\n***\n\n")
spec_list = specs.split("\n***\n\n")[after_i:]

assert len(spec_list) == (1000 - after_i)

def run_once(spec, index):
    with open("temp.tsl", "w") as f:
        f.write(spec)
    try:
        subprocess.run(shlex.split("./synthesize.sh temp.tsl"), timeout=10)
    except subprocess.TimeoutExpired:
        with open("log.txt", "a") as f:
            f.write(str(index+after_i) + '+f\n')
        os.system("sudo killall strix")


for n, single_spec in tqdm(enumerate(spec_list), total=len(spec_list)):
    run_once(single_spec,n)
