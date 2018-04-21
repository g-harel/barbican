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

COPY package.json ./

RUN npm install --only=production

# copies all other top-level files.
# not done earlier to use cached npm install on re-builds
COPY dist ./

EXPOSE 4321

CMD node server.js
