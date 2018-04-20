#!/bin/sh

docker build -t barbican .
docker run -d -p 3210:3210 barbican
