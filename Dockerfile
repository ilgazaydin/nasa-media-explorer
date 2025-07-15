# NASA Media Explorer - Multi-stage Docker Build
# Stage 1: Build the application
FROM node:20-alpine AS builder

# Accept build argument for environment
ARG NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application based on environment
RUN if [ "$NODE_ENV" = "development" ]; then npm run build:dev; else npm run build; fi

# Stage 2: Production image with nginx
FROM nginx:alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy custom nginx server configuration
COPY docker/nginx-default.conf /etc/nginx/conf.d/default.conf

# Create necessary directories and set permissions
RUN mkdir -p /tmp /usr/share/nginx/html \
    /tmp/nginx-client-body /tmp/nginx-proxy /tmp/nginx-fastcgi \
    /tmp/nginx-uwsgi /tmp/nginx-scgi && \
    chown -R nginx:nginx /tmp /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Use dumb-init as entrypoint for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
