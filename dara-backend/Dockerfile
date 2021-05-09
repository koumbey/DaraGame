FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . ./

EXPOSE 5000

WORKDIR /usr/src/app/bin

CMD [ "node", "www" ]

