#!/bin/bash

# NASA Media Explorer - Universal Docker Runner
# Supports both development and production modes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default configuration
MODE="prod"
PORT="8080"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dev|--development)
      MODE="dev"
      PORT="8000"
      shift
      ;;
    --prod|--production)
      MODE="prod"
      PORT="8080"
      shift
      ;;
    --clean)
      echo -e "${YELLOW}🧹 Cleaning up all containers and images...${NC}"
      
      # Stop and remove Docker Compose services
      echo -e "${YELLOW}Stopping Docker Compose services...${NC}"
      docker-compose --profile dev --profile prod down --remove-orphans 2>/dev/null || true
      
      # Remove containers (both manual and compose created)
      echo -e "${YELLOW}Removing containers...${NC}"
      docker rm -f \
        nasa-media-explorer-local \
        nasa-media-explorer-dev-local \
        $(docker ps -aq --filter "name=nasa-media-explorer") \
        2>/dev/null || true
      
      # Remove images (both manual and compose created)
      echo -e "${YELLOW}Removing images...${NC}"
      docker rmi -f \
        nasa-media-explorer \
        nasa-media-explorer:dev \
        $(docker images --filter "reference=nasa-media-explorer*" -q) \
        2>/dev/null || true
      
      # Clean up dangling images and build cache
      echo -e "${YELLOW}Cleaning up dangling images and cache...${NC}"
      docker image prune -f 2>/dev/null || true
      docker builder prune -f 2>/dev/null || true
      
      echo -e "${GREEN}✅ Cleanup complete!${NC}"
      exit 0
      ;;
    -h|--help)
      echo "NASA Media Explorer Docker Runner"
      echo ""
      echo "Usage: $0 [--dev|--prod|--clean] [--help]"
      echo ""
      echo "Options:"
      echo "  --dev, --development    Run in development mode with hot reload (port 8000)"
      echo "  --prod, --production    Run in production mode (port 8080) [default]"
      echo "  --clean                 Clean up all containers and images"
      echo "  -h, --help             Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

if [ "$MODE" = "dev" ]; then
    echo -e "${BLUE}🚀 Starting NASA Media Explorer in Development Mode...${NC}"
    echo -e "${YELLOW}🔥 Hot reload enabled - changes will be reflected immediately${NC}"
    
    # Use Docker Compose for development
    echo -e "${YELLOW}📦 Starting with Docker Compose (development profile)...${NC}"
    docker-compose --profile dev up --build nasa-media-explorer-dev
    
else
    echo -e "${GREEN}🚀 Starting NASA Media Explorer in Production Mode...${NC}"
    
    # Use Docker Compose for production too
    echo -e "${YELLOW}📦 Starting with Docker Compose (production profile)...${NC}"
    docker-compose --profile prod up --build nasa-media-explorer-prod
fi
