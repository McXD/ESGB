# Use a Node.js base image
FROM node:18

# Set the working directory to /usr/src/app (inside the container)
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the api directory (fabric/api)
COPY ./api/package*.json ./api/
COPY . .

# Install dependencies
WORKDIR /usr/src/app/api
RUN npm install --production

# Set the working directory to the api directory
WORKDIR /usr/src/app/api
COPY api/ .

# Expose the application on port 3001
EXPOSE 3001

# Start the API server
CMD ["node", "app.js"]
