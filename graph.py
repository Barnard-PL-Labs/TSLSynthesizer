#!/usr/bin/env python3

from matplotlib import pyplot as plt

with open("log.txt", "r") as f:
    data = [int(x) for x in f.read().split('\n')[:-1]]

assert len(data) == 1000

data.sort()
outlier_idx = 975
data = data[:outlier_idx]

plt.hist(data)
plt.title("Distribution of synthesis times")
plt.ylabel("Num. synthesis requests")
plt.xlabel("Time taken (milliseconds)")

plt.savefig("synthesis_time.svg", format="svg")
