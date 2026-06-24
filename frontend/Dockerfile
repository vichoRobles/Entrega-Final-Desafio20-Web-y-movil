# frontend/Dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

# Use CMD to start the dev server AFTER the container is built
CMD ["npm", "run", "dev"]