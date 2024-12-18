# STAGE 1
FROM node:18.17.0-alpine as builder
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./

RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install
COPY --chown=node:node . .
RUN npx prisma generate
RUN npm run build
RUN npm run postbuild

# STAGE 2
FROM node:18.17.0-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
# RUN npm install --save-dev sequelize-cli
RUN npm install --production
COPY --from=builder /home/node/app/build ./build

COPY --chown=node:node .env .
# COPY --chown=node:node .sequelizerc .
COPY --chown=node:node  /prisma ./prisma

RUN npx prisma generate
EXPOSE 80
CMD [ "node", "build/src/main.js" ]
