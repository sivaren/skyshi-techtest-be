FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . ./

EXPOSE 3030

ENTRYPOINT ["npm", "start"]
