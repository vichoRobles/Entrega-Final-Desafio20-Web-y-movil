# backend/Dockerfile
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your backend runs on (assuming 3000, change if different)
EXPOSE 3000

# Start the application
# Note: Ensure your package.json has a "start" script that runs the compiled JS (e.g., "node dist/index.js")
CMD ["npm", "run", "dev"]