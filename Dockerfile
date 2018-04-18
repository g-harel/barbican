FROM node:latest

WORKDIR /tmp/barbican

RUN apt-get -y update  && \
    apt-get -y upgrade && \
    apt-get -y install    \
        libcairo2-dev     \
        libjpeg-dev       \
        libpango1.0-dev   \
        libgif-dev        \
        build-essential   \
        g++

#copies all top-level files
COPY *.* ./

RUN npm install --global typescript ts-node && \
    npm install --only=production

EXPOSE 3210

CMD ts-node server.ts
