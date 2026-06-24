# frontend/Dockerfile
# Stage 1: Build the React Ionic app
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run dev

# Stage 2: Serve with NGINX
FROM nginx:alpine
# Copy the build output. Note: Ionic React usually outputs to "build" or "dist". 
# Change "dist" below to "build" if your setup outputs there.
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]