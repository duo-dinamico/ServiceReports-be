FROM node:16-slim

WORKDIR /app

COPY package.json ./
RUN npm install
COPY . .
EXPOSE 9090
CMD ["npm", "start"]