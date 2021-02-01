#!/usr/bin/env bash

inkscape $1 --export-area-drawing --batch-process --export-type=pdf --export-filename=$2
