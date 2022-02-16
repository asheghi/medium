FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
#RUN npm ci --only=production

# Bundle app source
COPY . .

#added to npm build script
#RUN npx prisma generate --schema ./server/prisma/schema.prisma

RUN npm run build

EXPOSE 3000

RUN mkdir "/data"

CMD [ "npm", "run", "start" ]
