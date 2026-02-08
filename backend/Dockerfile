# Use official Node runtime as a parent image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose port and run the server
EXPOSE 3000
CMD ["node", "src/server.js"]
