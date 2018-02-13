#!/bin/bash

export PORT=5104

cd ~/www/memory
./bin/memory stop || true
./bin/memory start

