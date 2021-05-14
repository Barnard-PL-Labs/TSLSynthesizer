import subprocess
import shlex
import os
from tqdm import tqdm

with open("specs.log", "r") as f:
    specs = f.read()

after_i = 0
timeout = 100

spec_list = specs.split("\n***\n\n")[after_i:]

assert len(spec_list) == (1000 - after_i)

def run_once(spec, index):
    with open("tmp.tsl", "w") as f:
        f.write(spec)
    try:
        subprocess.run(shlex.split("./synthesize.sh tmp.tsl"), timeout=timeout)
    except subprocess.TimeoutExpired:
        with open("time.log", "a") as f:
            f.write(str(index+after_i) + '+f\n')
        os.system("sudo killall strix")


for n, single_spec in tqdm(enumerate(spec_list), total=len(spec_list)):
    run_once(single_spec,n)
