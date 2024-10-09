# Use Node.js base image
FROM node:18

# Install Docker (required to run Docker commands)
RUN apt-get update && apt-get install -y docker.io

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of your Next.js app code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000 (internally)
EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
