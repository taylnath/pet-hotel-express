FROM node

WORKDIR /app/client
COPY ./client/package*.json ./

WORKDIR /app
COPY package*.json ./
RUN npm install

WORKDIR /app
COPY . .

ENV NODE_ENV=production

CMD [ "node", "server.js" ]
