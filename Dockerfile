FROM node

WORKDIR /app/client
COPY ./client/package*.json ./

WORKDIR /app
COPY package*.json ./
RUN npm install

WORKDIR /app
COPY . .

WORKDIR /app
RUN npm run build --prefix client

ENV NODE_ENV=production

CMD [ "node", "server.js" ]
