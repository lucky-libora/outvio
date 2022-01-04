FROM node:16.13.1-alpine
WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci --production

COPY ./ ./

CMD ['npm', 'start']




