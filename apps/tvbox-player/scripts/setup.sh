#!/bin/bash
set -e

# TV Box Player - Setup Script
# This script sets up the development environment

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}TV Box Player - Setup Script${NC}"
echo -e "${BLUE}======================================${NC}"

# Check operating system
OS="$(uname -s)"
echo -e "${YELLOW}Operating System: $OS${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Java
echo ""
echo -e "${BLUE}Checking Java...${NC}"
if command_exists java; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}✓ Java installed: $JAVA_VERSION${NC}"
else
    echo -e "${RED}✗ Java not found${NC}"
    echo -e "${YELLOW}Please install Java 17 or higher${NC}"
    exit 1
fi

# Check Node.js
echo ""
echo -e "${BLUE}Checking Node.js...${NC}"
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
    
    # Check version is >= 18
    NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo -e "${YELLOW}Warning: Node.js 18 or higher is recommended${NC}"
    fi
else
    echo -e "${RED}✗ Node.js not found${NC}"
    echo -e "${YELLOW}Please install Node.js 18 or higher${NC}"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

# Check Android SDK
echo ""
echo -e "${BLUE}Checking Android SDK...${NC}"
if [ ! -z "$ANDROID_HOME" ] || [ ! -z "$ANDROID_SDK_ROOT" ]; then
    SDK_PATH="${ANDROID_HOME:-$ANDROID_SDK_ROOT}"
    echo -e "${GREEN}✓ Android SDK found: $SDK_PATH${NC}"
else
    echo -e "${YELLOW}⚠ ANDROID_HOME not set${NC}"
    echo -e "${YELLOW}Set ANDROID_HOME environment variable to your Android SDK path${NC}"
fi

# Check for iOS requirements (macOS only)
if [[ "$OS" == "Darwin" ]]; then
    echo ""
    echo -e "${BLUE}Checking iOS development tools...${NC}"
    
    if command_exists xcodebuild; then
        XCODE_VERSION=$(xcodebuild -version | head -n 1)
        echo -e "${GREEN}✓ Xcode installed: $XCODE_VERSION${NC}"
    else
        echo -e "${YELLOW}⚠ Xcode not found${NC}"
        echo -e "${YELLOW}Install Xcode from the App Store for iOS development${NC}"
    fi
    
    if command_exists pod; then
        POD_VERSION=$(pod --version)
        echo -e "${GREEN}✓ CocoaPods installed: $POD_VERSION${NC}"
    else
        echo -e "${YELLOW}⚠ CocoaPods not found${NC}"
        echo -e "${YELLOW}Install CocoaPods: sudo gem install cocoapods${NC}"
    fi
fi

# Setup Android TV App
echo ""
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}Setting up Android TV App${NC}"
echo -e "${BLUE}======================================${NC}"

cd "$PROJECT_ROOT/android-tv-app"

# Make gradlew executable
chmod +x gradlew

echo -e "${YELLOW}Syncing Gradle...${NC}"
./gradlew tasks > /dev/null 2>&1 || true

echo -e "${GREEN}✓ Android TV App setup complete${NC}"

# Setup Mobile App
echo ""
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}Setting up Mobile App${NC}"
echo -e "${BLUE}======================================${NC}"

cd "$PROJECT_ROOT/mobile-app"

echo -e "${YELLOW}Installing npm dependencies...${NC}"
npm install

# Make Android gradlew executable
chmod +x android/gradlew

# Setup iOS if on macOS
if [[ "$OS" == "Darwin" ]] && command_exists pod; then
    echo -e "${YELLOW}Installing iOS dependencies...${NC}"
    cd ios
    pod install
    cd ..
    echo -e "${GREEN}✓ iOS dependencies installed${NC}"
fi

echo -e "${GREEN}✓ Mobile App setup complete${NC}"

# Create .env.example if it doesn't exist
if [ ! -f "$PROJECT_ROOT/mobile-app/.env.example" ]; then
    echo -e "${YELLOW}Creating .env.example...${NC}"
    cat > "$PROJECT_ROOT/mobile-app/.env.example" <<EOF
# Mobile App Environment Variables
API_URL=http://localhost:8080
GOOGLE_DRIVE_CLIENT_ID=your-client-id-here
EOF
    echo -e "${GREEN}✓ Created .env.example${NC}"
    echo -e "${YELLOW}Copy .env.example to .env and configure your values${NC}"
fi

# Make all scripts executable
echo ""
echo -e "${YELLOW}Making scripts executable...${NC}"
chmod +x "$PROJECT_ROOT/scripts"/*.sh
echo -e "${GREEN}✓ Scripts are executable${NC}"

# Final summary
echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Review and configure .env files"
echo -e "  2. Build Android TV: ./scripts/build-android-tv.sh"
echo -e "  3. Build Mobile Android: ./scripts/build-mobile-android.sh"
if [[ "$OS" == "Darwin" ]]; then
    echo -e "  4. Build Mobile iOS: ./scripts/build-mobile-ios.sh"
fi
echo -e ""
echo -e "${BLUE}For more information, see BUILD.md${NC}"
