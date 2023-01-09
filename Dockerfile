FROM node:18.10.0
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install jsonwebtoken bcrypt
COPY . /app
EXPOSE 3010
CMD [ "npm", "start" ]
