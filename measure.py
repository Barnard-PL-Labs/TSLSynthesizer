import os
from tqdm import tqdm

with open("randSpecs.log", "r") as f:
    specs = f.read()

spec_list = specs.split("\n***\n\n")

def run_once(spec):
    with open("temp.tsl", "w") as f:
        f.write(spec)
    os.system("./synthesize.sh temp.tsl")

for single_spec in tqdm(spec_list):
    run_once(single_spec)
