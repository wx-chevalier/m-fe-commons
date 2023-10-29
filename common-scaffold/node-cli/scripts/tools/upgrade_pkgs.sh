#!/bin/bash
set -ex

ncu -u

(cd ./packages/mfs-cli && ncu -u)

