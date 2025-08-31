# Stage 1: Build React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build React app (just build; no hardcoded ENV)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy default runtime env script (will be overwritten in prod)
COPY ./docker/env-config.js /usr/share/nginx/html/env-config.js

# Optional: custom nginx.conf for SPA routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
