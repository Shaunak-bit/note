# Docker Setup Guide

This guide explains how to build and run your application using Docker.

## Files Created

- **Dockerfile.frontend** - Multi-stage Docker build for Next.js frontend
- **Dockerfile.backend** - Multi-stage Docker build for Express backend with Prisma
- **docker-compose.yml** - Docker Compose configuration for all services (frontend, backend, PostgreSQL)
- **.dockerignore** - Files to exclude from Docker build context
- **.env.docker.example** - Example environment variables

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Set up environment variables

```bash
# Copy the example environment file
cp .env.docker.example .env.docker

# Edit .env.docker with your actual values
# Important: Set JWT_SECRET, DATABASE_URL, and email credentials
```

### 2. Build and run all services

```bash
# Build images and start containers
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 3. Access your application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: postgres on port 5432

### 4. Stop the services

```bash
docker-compose down

# To also remove volumes (database data)
docker-compose down -v
```

## Building Individual Images

### Build Frontend Only

```bash
docker build -f Dockerfile.frontend -t myapp-frontend:latest .
```

### Build Backend Only

```bash
docker build -f Dockerfile.backend -t myapp-backend:latest .
```

## Running Containers Individually

### Frontend Container

```bash
docker run -p 3000:3000 myapp-frontend:latest
```

### Backend Container

```bash
docker run -p 5000:5000 \
  -e JWT_SECRET=your_secret \
  -e DATABASE_URL=postgresql://... \
  myapp-backend:latest
```

## Useful Docker Compose Commands

```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose stop

# Resume services
docker-compose start

# Remove everything
docker-compose down -v

# Execute command in running container
docker-compose exec backend npm run dev
docker-compose exec frontend npm start
```

## Best Practices

1. **Environment Security**: Never commit `.env.docker` files. Use `.env.docker.example` as template.
2. **Build Optimization**: Both Dockerfiles use multi-stage builds to minimize final image size.
3. **Health Checks**: Both services include health checks for better monitoring.
4. **Database**: PostgreSQL is automatically started with Docker Compose.
5. **Network**: Services communicate via internal Docker network (`app-network`).

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

```bash
# Change ports in docker-compose.yml
# Example: change "3000:3000" to "8000:3000"
```

### Database Connection Errors

Ensure `DATABASE_URL` in `.env.docker` points to the postgres service:
```
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/myapp
```

### Build Failures

```bash
# Clean build (removes cache)
docker-compose build --no-cache

# Check Docker logs
docker logs container_id
```

### Running Prisma Migrations

```bash
# After backend starts, run migrations
docker-compose exec backend npx prisma migrate deploy

# Or seed database
docker-compose exec backend npx prisma db seed
```

## Next Steps

1. Update `.env.docker` with your environment variables
2. Run `docker-compose up --build`
3. Monitor logs with `docker-compose logs -f`
4. Access frontend at http://localhost:3000
