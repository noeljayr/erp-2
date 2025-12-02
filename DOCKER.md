# Docker Setup

This project includes Docker configurations for both development and production environments.

## Prerequisites

- Docker installed on your system
- Docker Compose installed

## Development Environment

### Using Docker Compose (Recommended)

Start the development server with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

The application will be available at `http://localhost:3000`

To run in detached mode:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

To stop the containers:

```bash
docker-compose -f docker-compose.dev.yml down
```

### Using Docker directly

Build the development image:

```bash
docker build -f Dockerfile.dev -t nuxt-app-dev .
```

Run the container:

```bash
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules nuxt-app-dev
```

## Production Environment

### Using Docker Compose (Recommended)

Build and start the production server:

```bash
docker-compose up --build
```

To run in detached mode:

```bash
docker-compose up -d
```

To stop the containers:

```bash
docker-compose down
```

### Using Docker directly

Build the production image:

```bash
docker build -t nuxt-app .
```

Run the container:

```bash
docker run -p 3000:3000 nuxt-app
```

## Environment Variables

To use environment variables:

1. Create a `.env` file in the root directory
2. Uncomment the `env_file` section in the respective docker-compose file
3. Add your environment variables to the `.env` file

Example `.env` file:

```env
API_BASE_URL=https://api.example.com
NODE_ENV=production
```

## Useful Commands

### View logs

```bash
# Development
docker-compose -f docker-compose.dev.yml logs -f

# Production
docker-compose logs -f
```

### Rebuild containers

```bash
# Development
docker-compose -f docker-compose.dev.yml up --build

# Production
docker-compose up --build
```

### Execute commands inside container

```bash
# Development
docker-compose -f docker-compose.dev.yml exec app sh

# Production
docker-compose exec app sh
```

### Clean up

Remove all containers, networks, and volumes:

```bash
# Development
docker-compose -f docker-compose.dev.yml down -v

# Production
docker-compose down -v
```

## Notes

- The development setup includes volume mounting for hot-reload functionality
- The production build uses multi-stage builds for optimized image size
- Node modules are excluded from volume mounting to prevent conflicts
- Port 24678 is exposed in development for Nuxt devtools
