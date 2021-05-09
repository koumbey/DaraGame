FROM node:14

WORKDIR /app

COPY package*.json ./

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

RUN yarn install

RUN npm install react-scripts@3.4.1 -g --silent

COPY . ./

EXPOSE 3000

# start app
CMD ["npm", "start"]