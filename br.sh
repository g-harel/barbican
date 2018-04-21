#!/bin/sh

docker build -t barbican .
docker run -d -p 4321:4321 barbican
