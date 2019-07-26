FROM selenium/node-firefox
WORKDIR /discordbot

MAINTAINER NeonLe

COPY . /discordbot

USER root

RUN sudo -s
RUN sudo apt-get update
RUN sudo apt-get -y install build-essential
RUN sudo apt-get install curl gnupg -yq
RUN sudo curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN sudo apt-get -y install nodejs
RUN npm install
RUN npm install ffmpeg-binaries

EXPOSE 8080
CMD "echo" "Dockerizing Ez katka"
CMD [ "node", "index.js"]
