#!/usr/bin/env python3

import numpy as np
import sys
from matplotlib import pyplot as plt
from collections import namedtuple, Counter
DataPoint = namedtuple("DataPoint", ("time", "real"))

file_name = sys.argv[1]

with open(file_name, "r") as f:
    data = []
    for data_point in f.read().split('\n')[:-1]:
        time = int(data_point[:-2])
        realizable = data_point[-1]
        data.append(DataPoint(time=time, real=realizable))

assert len(data) == 1000

times = [x.time for x in data if x.real != "f"]
if file_name == "log_4_iff.txt":
    times = [t for t in times if t < 10000]
realizables = [x.real for x in data]
print(Counter(realizables))
print("median", np.median(times))
print("mean", np.mean(times))

times.sort()

plt.hist(times, edgecolor="black")
plt.title("Distribution of synthesis times")
plt.ylabel("Num. synthesis requests")
plt.xlabel("Time taken (milliseconds)")

plt.savefig("synthesis_time.svg", format="svg")
