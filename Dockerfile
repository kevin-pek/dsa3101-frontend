FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV production

COPY server/* .

COPY --from=builder /app/dist dist

RUN npm ci

EXPOSE 3000

CMD ["node", "index.js"]