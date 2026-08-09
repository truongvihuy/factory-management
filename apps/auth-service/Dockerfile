FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN corepack enable \
    && yarn install --immutable

COPY apps/auth-service ./apps/auth-service
COPY tsconfig.base.json ./tsconfig.base.json

RUN yarn workspace @fms/auth-service build

WORKDIR /app/apps/auth-service

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]