FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

# Build du frontend Vue.js
RUN cd client && npm install && npm run build

EXPOSE 3000

CMD ["node", "src/server.js"]
