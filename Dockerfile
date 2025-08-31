# Stage 1: Build React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build React app (do NOT hardcode env variables here)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config (optional, for SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy runtime env template
COPY ./docker/env-config.js /usr/share/nginx/html/env-config.js

# Copy entrypoint script
COPY ./docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

# Use entrypoint to replace placeholders in env-config.js with actual env variables
ENTRYPOINT ["/docker-entrypoint.sh"]
