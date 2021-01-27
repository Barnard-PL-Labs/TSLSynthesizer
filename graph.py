#!/usr/bin/env python3

from matplotlib import pyplot as plt
from collections import namedtuple, Counter
DataPoint = namedtuple("DataPoint", ("time", "real"))

with open("log.txt", "r") as f:
    data = []
    for data_point in f.read().split('\n')[:-1]:
        time = int(data_point[:-2])
        realizable = data_point[-1]
        data.append(DataPoint(time=time, real=realizable))

assert len(data) == 1000

times = [x.time for x in data]
realizables = [x.real for x in data]
print(Counter(realizables))

times.sort()
outlier_idx = 975
times = times[:outlier_idx]

plt.hist(times)
plt.title("Distribution of synthesis times")
plt.ylabel("Num. synthesis requests")
plt.xlabel("Time taken (milliseconds)")

plt.savefig("synthesis_time.svg", format="svg")
