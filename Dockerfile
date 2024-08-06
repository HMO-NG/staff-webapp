# Stage 1: Build the app
FROM node:lts-alpine3.20 AS appbuild

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install
COPY . .

RUN yarn run build

## Stage 2: Prepare the final image with only static files
FROM nginx:alpine3.19
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=appbuild /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]