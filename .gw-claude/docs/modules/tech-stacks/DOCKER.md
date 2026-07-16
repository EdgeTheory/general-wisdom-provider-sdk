# Docker Technology Stack

## Docker Best Practices Philosophy

### Core Principles
- **Use specific base image tags, not `latest`**: Ensure reproducible builds
- **Minimize layers**: Combine RUN commands to reduce image size
- **Use .dockerignore**: Exclude unnecessary files from build context
- **Run as non-root user**: Security best practice for production
- **Use COPY not ADD**: Unless extracting archives, prefer COPY
- **Set HEALTHCHECK**: Essential for production container management

## Container Development Best Practices

### Multi-Stage Python Dockerfile with UV
```dockerfile
# Build stage
FROM python:3.12-slim as builder
WORKDIR /app

# Install UV for fast package management
RUN pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies using UV
RUN uv sync --frozen --no-dev

# Runtime stage
FROM python:3.12-slim

# Create non-root user with specific UID/GID
RUN groupadd -g 1001 -r appuser && \
    useradd -r -g appuser -u 1001 appuser

# Set up application directory
WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder --chown=appuser:appuser /app/.venv /app/.venv

# Copy application code
COPY --chown=appuser:appuser . .

# Set environment variables
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Expose port and start application
EXPOSE 8000
CMD ["python", "main.py"]
```

### Traditional Python Multi-Stage Build
```dockerfile
# Multi-stage build for Python applications
FROM python:3.11-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy dependencies from builder stage
COPY --from=builder /root/.local /home/appuser/.local

# Set up application directory
WORKDIR /app
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Set environment variables
ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONPATH=/app

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Expose port and start application
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Node.js Dockerfile
```dockerfile
# Multi-stage build for Node.js applications
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set up application
WORKDIR /app
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .

USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

## Docker Compose for Development

### Full-Stack Application
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/appdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d appdb"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    name: app-network
```

### Production Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    image: myapp/frontend:latest
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`myapp.com`)"
      - "traefik.http.services.frontend.loadbalancer.server.port=3000"

  backend:
    image: myapp/backend:latest
    restart: unless-stopped
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  traefik:
    image: traefik:v2.10
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/etc/traefik/traefik.yml
```

## Container Security

### Security Best Practices
```dockerfile
# Security-hardened Dockerfile
FROM node:18-alpine

# Install security updates
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Create non-root user with specific UID/GID
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -D -H -u 1001 -s /sbin/nologin nodejs

# Set up application with minimal permissions
WORKDIR /app
COPY --chown=nodejs:nodejs package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --chown=nodejs:nodejs . .

# Remove unnecessary files and set permissions
RUN find /app -type f -name "*.md" -delete && \
    find /app -type f -name "*.txt" -delete && \
    chmod -R 755 /app

# Switch to non-root user
USER nodejs

# Security labels
LABEL security.no-new-privileges=true
LABEL security.read-only-root-filesystem=true

# Run with security options
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "--max-old-space-size=512", "server.js"]
```

### Docker Security Scanning
```bash
# Scan images for vulnerabilities
docker scout cves myapp:latest

# Trivy security scanning
trivy image --severity HIGH,CRITICAL myapp:latest

# Run security benchmark
docker-bench-security
```

## Container Orchestration

### Docker Swarm Configuration
```yaml
# docker-stack.yml
version: '3.8'

services:
  app:
    image: myapp:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
    networks:
      - app-network
    secrets:
      - db_password
      - api_key

  database:
    image: postgres:15
    deploy:
      placement:
        constraints:
          - node.role == manager
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - db_data:/var/lib/postgresql/data

secrets:
  db_password:
    external: true
  api_key:
    external: true

volumes:
  db_data:

networks:
  app-network:
    driver: overlay
```

## Monitoring & Logging

### Container Monitoring
```yaml
# monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro

volumes:
  prometheus_data:
  grafana_data:
```

## Performance Optimization

### Image Size Optimization
```dockerfile
# Optimized multi-stage build
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs
CMD ["node", "dist/server.js"]
```

## Validation Commands

```bash
# Build and test
docker build -t myapp:latest .
docker run --rm myapp:latest npm test

# Security scanning
docker scout quickview
docker scout cves --only-severity critical,high

# Performance testing
docker stats
docker system df
docker system prune

# Health checks
docker inspect --format='{{json .State.Health}}' container_name

# Compose validation
docker-compose config
docker-compose up --dry-run
```

This Docker configuration ensures secure, scalable, and maintainable containerized applications with comprehensive monitoring and optimization.
