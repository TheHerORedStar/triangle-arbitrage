FROM node:14.14.0-alpine3.12
RUN apk add git

WORKDIR /app
COPY ./package.json package.json

RUN npm install

COPY ./ ./

ENTRYPOINT ["npm", "run", "start"]

