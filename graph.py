#!/usr/bin/env python3

from matplotlib import pyplot as plt

with open("log.txt", "r") as f:
    data = [int(x) for x in f.read().split('\n')[:-1]]

assert len(data) == 1000

plt.hist(data)
plt.savefig("synthesis_time.svg", format="svg")
