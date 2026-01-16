#!/bin/bash

# Study Application Setup Script
# Installs dependencies for all services

set -e

echo "🚀 Setting up Study Application"
echo "========================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Frontend Setup
echo -e "\n${YELLOW}📦 Setting up Frontend${NC}"
cd services/frontend
cp .env.example .env 2>/dev/null || echo ".env already exists"
npm install
echo -e "${GREEN}✓ Frontend setup complete${NC}"
cd ../..

# Gateway Setup
echo -e "\n${YELLOW}🌐 Setting up Gateway${NC}"
cd services/gateway
cp .env.example .env 2>/dev/null || echo ".env already exists"
npm install
echo -e "${GREEN}✓ Gateway setup complete${NC}"
cd ../..

# AI Engine Setup
echo -e "\n${YELLOW}🤖 Setting up AI Engine${NC}"
cd services/ai-engine
cp .env.example .env 2>/dev/null || echo ".env already exists"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-test.txt
echo -e "${GREEN}✓ AI Engine setup complete${NC}"
cd ../..

echo -e "\n${GREEN}✓ All services set up successfully!${NC}"
echo ""
echo "To start the application:"
echo "  docker compose -f infrastructure/docker-compose.yml up --build"
echo ""
echo "To run tests:"
echo "  bash scripts/test-all.sh"
