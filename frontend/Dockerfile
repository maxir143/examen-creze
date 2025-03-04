# Use a Node.js base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Astro project
COPY . .

# Build the Astro project
RUN npm run build

# Expose the port Astro uses (default: 3000)
EXPOSE 3000

# Start the Astro server
CMD ["npm", "run", "preview"]