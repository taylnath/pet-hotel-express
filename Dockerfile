FROM node

# create app directory
WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
COPY client/package*.json ./

RUN npm install
# for production only -- take this out?
RUN npm ci --only=production

# bundle app source
COPY . .

EXPOSE 80
EXPOSE 443

# run app
CMD [ "node", "server.js" ]
