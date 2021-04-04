# FROM jacobwgillespie/nodejs-ffmpeg

FROM nikolaik/python-nodejs

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json /usr/src/app/
RUN npm install

# Copying source files
COPY . /usr/src/app

EXPOSE 8000

# Running the API
CMD "npm" "run" "start"