#!/bin/bash
set -e

# TV Box Player - Android TV Build Script
# This script builds the Android TV application

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ANDROID_TV_DIR="$PROJECT_ROOT/android-tv-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build type (debug or release)
BUILD_TYPE="${1:-debug}"

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Building Android TV App - $BUILD_TYPE${NC}"
echo -e "${GREEN}======================================${NC}"

cd "$ANDROID_TV_DIR"

# Check if gradlew exists
if [ ! -f "gradlew" ]; then
    echo -e "${RED}Error: gradlew not found in $ANDROID_TV_DIR${NC}"
    exit 1
fi

# Make gradlew executable
chmod +x gradlew

# Clean previous builds
echo -e "${YELLOW}Cleaning previous builds...${NC}"
./gradlew clean

# Build based on type
if [ "$BUILD_TYPE" == "release" ]; then
    echo -e "${YELLOW}Building release APK...${NC}"
    
    # Check for signing configuration
    if [ -f "release.keystore" ] && [ ! -z "$KEYSTORE_PASSWORD" ]; then
        echo -e "${GREEN}Using release keystore for signing${NC}"
        ./gradlew assembleRelease \
            -Pandroid.injected.signing.store.file=release.keystore \
            -Pandroid.injected.signing.store.password="$KEYSTORE_PASSWORD" \
            -Pandroid.injected.signing.key.alias="${KEY_ALIAS:-tvboxplayer}" \
            -Pandroid.injected.signing.key.password="${KEY_PASSWORD:-$KEYSTORE_PASSWORD}"
    else
        echo -e "${YELLOW}Warning: No release keystore found. Building with debug signing.${NC}"
        echo -e "${YELLOW}Set KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD environment variables for release signing.${NC}"
        ./gradlew assembleRelease
    fi
    
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
else
    echo -e "${YELLOW}Building debug APK...${NC}"
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

# Check if build succeeded
if [ -f "$APK_PATH" ]; then
    echo -e "${GREEN}======================================${NC}"
    echo -e "${GREEN}Build successful!${NC}"
    echo -e "${GREEN}======================================${NC}"
    
    # Get APK size
    APK_SIZE=$(stat -f%z "$APK_PATH" 2>/dev/null || stat -c%s "$APK_PATH")
    APK_SIZE_MB=$((APK_SIZE / 1024 / 1024))
    
    echo -e "${GREEN}APK Location: $APK_PATH${NC}"
    echo -e "${GREEN}APK Size: ${APK_SIZE_MB}MB${NC}"
    
    # Check size requirement
    if [ $APK_SIZE_MB -gt 50 ]; then
        echo -e "${YELLOW}Warning: APK size (${APK_SIZE_MB}MB) exceeds 50MB requirement!${NC}"
    fi
    
    # Generate checksum for release builds
    if [ "$BUILD_TYPE" == "release" ]; then
        echo -e "${YELLOW}Generating SHA-256 checksum...${NC}"
        sha256sum "$APK_PATH" > "$APK_PATH.sha256"
        echo -e "${GREEN}Checksum saved to: $APK_PATH.sha256${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}To install on device:${NC}"
    echo -e "  adb install -r $APK_PATH"
else
    echo -e "${RED}======================================${NC}"
    echo -e "${RED}Build failed!${NC}"
    echo -e "${RED}======================================${NC}"
    exit 1
fi
