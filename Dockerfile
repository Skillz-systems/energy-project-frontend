# Set the base image
FROM node:20-alpine

# Create a user with permissions to run the app
RUN addgroup -S app && adduser -S -G app app

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Change ownership of the node_modules directory to the app user
RUN chown -R app:app /app/node_modules

# Copy the rest of the app's source code
COPY --chown=app:app . .

# Switch to the app user
USER app

# Expose the app port
EXPOSE 5173

# Command to run the app
CMD ["npm", "run", "dev"]
