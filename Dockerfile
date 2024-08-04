<<<<<<< HEAD
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
=======
# Stage 1: Build the app
FROM node:lts-alpine3.20 AS appbuild

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install
COPY . .

RUN yarn run build

## Stage 2: Prepare the final image with only static files
FROM alpine:3.20

COPY --from=appbuild /app/build /usr/share/nginx/html

FROM nginx:alpine3.19
COPY --from=appbuild /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
>>>>>>> 8cfdd60 (working solution)
