#!/bin/bash
set -e

# TV Box Player - Mobile Android Build Script
# This script builds the React Native mobile app for Android

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MOBILE_DIR="$PROJECT_ROOT/mobile-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build type (debug or release)
BUILD_TYPE="${1:-debug}"
# Output type (apk or aab)
OUTPUT_TYPE="${2:-apk}"

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Building Mobile Android App - $BUILD_TYPE ($OUTPUT_TYPE)${NC}"
echo -e "${GREEN}======================================${NC}"

cd "$MOBILE_DIR"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

echo -e "${YELLOW}Node version: $(node --version)${NC}"
echo -e "${YELLOW}NPM version: $(npm --version)${NC}"

# Install dependencies
echo -e "${YELLOW}Installing npm dependencies...${NC}"
npm ci

# Navigate to android directory
cd android

# Make gradlew executable
chmod +x gradlew

# Clean previous builds
echo -e "${YELLOW}Cleaning previous builds...${NC}"
./gradlew clean

# Build based on type
if [ "$BUILD_TYPE" == "release" ]; then
    echo -e "${YELLOW}Building release $OUTPUT_TYPE...${NC}"
    
    # Check for signing configuration
    if [ -f "app/release.keystore" ] && [ ! -z "$KEYSTORE_PASSWORD" ]; then
        echo -e "${GREEN}Using release keystore for signing${NC}"
        
        if [ "$OUTPUT_TYPE" == "aab" ]; then
            ./gradlew bundleRelease \
                -Pandroid.injected.signing.store.file=release.keystore \
                -Pandroid.injected.signing.store.password="$KEYSTORE_PASSWORD" \
                -Pandroid.injected.signing.key.alias="${KEY_ALIAS:-mobileapp}" \
                -Pandroid.injected.signing.key.password="${KEY_PASSWORD:-$KEYSTORE_PASSWORD}"
            OUTPUT_PATH="app/build/outputs/bundle/release/app-release.aab"
        else
            ./gradlew assembleRelease \
                -Pandroid.injected.signing.store.file=release.keystore \
                -Pandroid.injected.signing.store.password="$KEYSTORE_PASSWORD" \
                -Pandroid.injected.signing.key.alias="${KEY_ALIAS:-mobileapp}" \
                -Pandroid.injected.signing.key.password="${KEY_PASSWORD:-$KEYSTORE_PASSWORD}"
            OUTPUT_PATH="app/build/outputs/apk/release/app-release.apk"
        fi
    else
        echo -e "${YELLOW}Warning: No release keystore found. Building with debug signing.${NC}"
        echo -e "${YELLOW}Set KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD environment variables.${NC}"
        
        if [ "$OUTPUT_TYPE" == "aab" ]; then
            ./gradlew bundleRelease
            OUTPUT_PATH="app/build/outputs/bundle/release/app-release.aab"
        else
            ./gradlew assembleRelease
            OUTPUT_PATH="app/build/outputs/apk/release/app-release.apk"
        fi
    fi
else
    echo -e "${YELLOW}Building debug APK...${NC}"
    ./gradlew assembleDebug
    OUTPUT_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

# Check if build succeeded
if [ -f "$OUTPUT_PATH" ]; then
    echo -e "${GREEN}======================================${NC}"
    echo -e "${GREEN}Build successful!${NC}"
    echo -e "${GREEN}======================================${NC}"
    
    # Get file size
    FILE_SIZE=$(stat -f%z "$OUTPUT_PATH" 2>/dev/null || stat -c%s "$OUTPUT_PATH")
    FILE_SIZE_MB=$((FILE_SIZE / 1024 / 1024))
    
    echo -e "${GREEN}Output: $OUTPUT_PATH${NC}"
    echo -e "${GREEN}Size: ${FILE_SIZE_MB}MB${NC}"
    
    # Generate checksum for release builds
    if [ "$BUILD_TYPE" == "release" ]; then
        echo -e "${YELLOW}Generating SHA-256 checksum...${NC}"
        sha256sum "$OUTPUT_PATH" > "$OUTPUT_PATH.sha256"
        echo -e "${GREEN}Checksum saved to: $OUTPUT_PATH.sha256${NC}"
    fi
    
    if [ "$OUTPUT_TYPE" == "apk" ]; then
        echo ""
        echo -e "${GREEN}To install on device:${NC}"
        echo -e "  adb install -r $OUTPUT_PATH"
    fi
else
    echo -e "${RED}======================================${NC}"
    echo -e "${RED}Build failed!${NC}"
    echo -e "${RED}======================================${NC}"
    exit 1
fi
