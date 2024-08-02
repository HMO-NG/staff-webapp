# Use an official node image as the base image for building
FROM node:20.16.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use the Caddy image to serve the built application
FROM caddy:2.4.5-alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/caddy

# Expose port 80
EXPOSE 80
