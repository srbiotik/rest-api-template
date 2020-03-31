FROM node:12.13

WORKDIR /opt

COPY . .

RUN npm install

CMD ["/opt/node_modules/.bin/babel-node", "index.js"]
