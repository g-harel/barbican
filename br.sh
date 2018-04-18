#!/bin/sh

docker build -t barbican .
docker run -p 3210:3210 barbican
