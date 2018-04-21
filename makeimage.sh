#!/bin/sh

DIR=dist
NAME=barbican
PORT=4321

rm -rf ./$DIR
npm run build

docker build -t $NAME .
docker run -d -p $PORT:$PORT $NAME
