#!/bin/bash

# Study Application Test Runner
# Runs all tests across all services

set -e

echo "🧪 Running Study Application Test Suite"
echo "================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
OVERALL_STATUS=0

# Frontend Tests
echo -e "\n${YELLOW}📦 Frontend Tests${NC}"
echo "-------------------"
cd services/frontend
if npm test; then
    echo -e "${GREEN}✓ Frontend tests passed${NC}"
else
    echo -e "${RED}✗ Frontend tests failed${NC}"
    OVERALL_STATUS=1
fi
cd ../..

# Gateway Tests
echo -e "\n${YELLOW}🌐 Gateway Tests${NC}"
echo "------------------"
cd services/gateway
if npm test; then
    echo -e "${GREEN}✓ Gateway tests passed${NC}"
else
    echo -e "${RED}✗ Gateway tests failed${NC}"
    OVERALL_STATUS=1
fi
cd ../..

# AI Engine Tests
echo -e "\n${YELLOW}🤖 AI Engine Tests${NC}"
echo "-------------------"
cd services/ai-engine
if python -m pytest tests/ -v; then
    echo -e "${GREEN}✓ AI Engine tests passed${NC}"
else
    echo -e "${RED}✗ AI Engine tests failed${NC}"
    OVERALL_STATUS=1
fi
cd ../..

# Summary
echo -e "\n================================="
if [ $OVERALL_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
else
    echo -e "${RED}✗ Some tests failed${NC}"
fi

exit $OVERALL_STATUS
