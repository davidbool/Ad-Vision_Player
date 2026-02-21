#!/bin/bash
set -e

# TV Box Player - Test Runner Script
# This script runs tests for all applications

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test target (all, android-tv, mobile)
TARGET="${1:-all}"

# Function to run Android TV tests
run_androidtv_tests() {
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}Running Android TV Tests${NC}"
    echo -e "${BLUE}======================================${NC}"
    
    cd "$PROJECT_ROOT/android-tv-app"
    
    # Make gradlew executable
    chmod +x gradlew
    
    # Run unit tests
    echo -e "${YELLOW}Running unit tests...${NC}"
    ./gradlew test --no-daemon
    
    # Run lint
    echo -e "${YELLOW}Running lint checks...${NC}"
    ./gradlew lintDebug --no-daemon
    
    echo -e "${GREEN}✓ Android TV tests completed${NC}"
}

# Function to run Mobile App tests
run_mobile_tests() {
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}Running Mobile App Tests${NC}"
    echo -e "${BLUE}======================================${NC}"
    
    cd "$PROJECT_ROOT/mobile-app"
    
    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies...${NC}"
        npm ci
    fi
    
    # Run lint
    echo -e "${YELLOW}Running lint checks...${NC}"
    npm run lint
    
    # Run type check
    echo -e "${YELLOW}Running TypeScript type check...${NC}"
    npm run type-check
    
    # Run tests
    echo -e "${YELLOW}Running unit tests...${NC}"
    npm test -- --coverage --watchAll=false
    
    echo -e "${GREEN}✓ Mobile App tests completed${NC}"
}

# Main script
case $TARGET in
    all)
        echo -e "${BLUE}Running all tests...${NC}"
        echo ""
        
        # Run Android TV tests
        run_androidtv_tests
        echo ""
        
        # Run Mobile tests
        run_mobile_tests
        echo ""
        
        echo -e "${GREEN}======================================${NC}"
        echo -e "${GREEN}All tests completed successfully!${NC}"
        echo -e "${GREEN}======================================${NC}"
        ;;
    
    android-tv|androidtv)
        run_androidtv_tests
        ;;
    
    mobile)
        run_mobile_tests
        ;;
    
    *)
        echo -e "${RED}Error: Unknown target '$TARGET'${NC}"
        echo "Usage: $0 [all|android-tv|mobile]"
        exit 1
        ;;
esac
