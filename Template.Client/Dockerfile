# Stage 1: Build the client application
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine
# COPY the custom configuration file into the Nginx default config location
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]