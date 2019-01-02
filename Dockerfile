FROM node:carbon
#creating a work dir/folder to store src code
WORKDIR /usr/src/app
COPY . .
RUN npm i
RUN npm i -g gulp
RUN gulp build
RUN npm prune --production
WORKDIR /usr/src/app/dist
EXPOSE 8585
# run npm script start
CMD [ "npm", "start" ]