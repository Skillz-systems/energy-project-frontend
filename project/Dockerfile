# Set the base image
FROM node:20-alpine

# Create a user
RUN addgroup -S app && adduser -S -G app app

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker cache)
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy all project files (excluding node_modules)
COPY . .

# Expose the port
EXPOSE 5173

# Command to run the app
CMD ["npm", "run", "dev"]
