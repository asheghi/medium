FROM node:24-bookworm-slim

WORKDIR /usr/src/app
ENV DATA_DIR=/data

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund

COPY . .
RUN npm run prisma:gen && npm run build
RUN mkdir -p /data && chown -R node:node /data /usr/src/app

EXPOSE 3000
ENV NODE_ENV=production
USER node

CMD [ "npm", "run", "start:docker" ]
