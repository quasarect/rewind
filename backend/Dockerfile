# backend image for rewind
FROM node

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

RUN npm install typescript -g

COPY . .

EXPOSE 3000

RUN ["tsc"]

CMD ["npm","run","dev:test"]

