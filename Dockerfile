# Set the base image to create the image for a React app
FROM node:20-alpine

# Create a user with permissions to run the app
RUN addgroup -S app && adduser -S -G app app

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Change ownership of the /app directory and node_modules to the app user
RUN chown -R app:app /app

# Install dependencies as root (needed to avoid permission issues during installation)
USER root

# Install dependencies
RUN npm install

# Ensure app user has access to node_modules
RUN chown -R app:app /app/node_modules

# Switch to app user for the rest of the build process
USER app

# Copy the rest of the files, ensuring ownership is correct
COPY --chown=app:app . .

# Expose port 5173
EXPOSE 5173

# Command to run the app
CMD ["npm", "run", "dev"]
