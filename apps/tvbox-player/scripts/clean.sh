#!/bin/bash
set -e

# TV Box Player - Clean Script
# This script cleans build artifacts and caches

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Clean target (all, android-tv, mobile)
TARGET="${1:-all}"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}TV Box Player - Clean Script${NC}"
echo -e "${BLUE}======================================${NC}"

# Function to clean Android TV
clean_androidtv() {
    echo -e "${YELLOW}Cleaning Android TV build...${NC}"
    
    cd "$PROJECT_ROOT/android-tv-app"
    
    # Make gradlew executable
    chmod +x gradlew
    
    # Gradle clean
    ./gradlew clean
    
    # Remove build directories
    rm -rf app/build
    rm -rf build
    rm -rf .gradle
    
    echo -e "${GREEN}✓ Android TV cleaned${NC}"
}

# Function to clean Mobile App
clean_mobile() {
    echo -e "${YELLOW}Cleaning Mobile App build...${NC}"
    
    cd "$PROJECT_ROOT/mobile-app"
    
    # Remove node_modules (optional)
    if [ "$2" == "--deep" ]; then
        echo -e "${YELLOW}Removing node_modules...${NC}"
        rm -rf node_modules
    fi
    
    # Remove build directories
    rm -rf android/app/build
    rm -rf android/build
    rm -rf android/.gradle
    rm -rf ios/build
    rm -rf ios/Pods
    
    # Remove Metro bundler cache
    rm -rf $TMPDIR/react-*
    rm -rf $TMPDIR/metro-*
    
    # Remove Jest cache
    npx jest --clearCache 2>/dev/null || true
    
    echo -e "${GREEN}✓ Mobile App cleaned${NC}"
}

# Function to clean all
clean_all() {
    clean_androidtv
    echo ""
    clean_mobile "$@"
    
    # Remove top-level build directories
    echo -e "${YELLOW}Cleaning root build directories...${NC}"
    rm -rf "$PROJECT_ROOT/build"
    
    echo ""
    echo -e "${GREEN}======================================${NC}"
    echo -e "${GREEN}All builds cleaned successfully!${NC}"
    echo -e "${GREEN}======================================${NC}"
}

# Main script
case $TARGET in
    all)
        clean_all "$@"
        ;;
    
    android-tv|androidtv)
        clean_androidtv
        ;;
    
    mobile)
        clean_mobile "$@"
        ;;
    
    *)
        echo -e "${RED}Error: Unknown target '$TARGET'${NC}"
        echo "Usage: $0 [all|android-tv|mobile] [--deep]"
        echo ""
        echo "Options:"
        echo "  --deep    Also remove node_modules"
        exit 1
        ;;
esac
