#!/bin/bash
set -e

# TV Box Player - Mobile iOS Build Script
# This script builds the React Native mobile app for iOS

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MOBILE_DIR="$PROJECT_ROOT/mobile-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build configuration (Debug or Release)
CONFIGURATION="${1:-Debug}"
# Build action (build or archive)
ACTION="${2:-build}"

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Building Mobile iOS App - $CONFIGURATION${NC}"
echo -e "${GREEN}======================================${NC}"

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}Error: iOS builds require macOS${NC}"
    exit 1
fi

cd "$MOBILE_DIR"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

echo -e "${YELLOW}Node version: $(node --version)${NC}"
echo -e "${YELLOW}NPM version: $(npm --version)${NC}"

# Check Xcode
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}Error: Xcode is not installed${NC}"
    exit 1
fi

echo -e "${YELLOW}Xcode version: $(xcodebuild -version | head -n 1)${NC}"

# Install dependencies
echo -e "${YELLOW}Installing npm dependencies...${NC}"
npm ci

# Install CocoaPods dependencies
echo -e "${YELLOW}Installing CocoaPods dependencies...${NC}"
cd ios
pod install
cd ..

# Find workspace
WORKSPACE="ios/tvboxplayermobile.xcworkspace"
SCHEME="tvboxplayermobile"

if [ ! -d "$WORKSPACE" ]; then
    echo -e "${RED}Error: Workspace not found at $WORKSPACE${NC}"
    exit 1
fi

cd ios

# Build or Archive
if [ "$ACTION" == "archive" ]; then
    echo -e "${YELLOW}Archiving iOS app...${NC}"
    
    ARCHIVE_PATH="$PROJECT_ROOT/build/tvboxplayer.xcarchive"
    
    xcodebuild \
        -workspace "$WORKSPACE" \
        -scheme "$SCHEME" \
        -configuration "$CONFIGURATION" \
        -destination 'generic/platform=iOS' \
        -archivePath "$ARCHIVE_PATH" \
        clean archive
    
    if [ -d "$ARCHIVE_PATH" ]; then
        echo -e "${GREEN}======================================${NC}"
        echo -e "${GREEN}Archive successful!${NC}"
        echo -e "${GREEN}======================================${NC}"
        echo -e "${GREEN}Archive: $ARCHIVE_PATH${NC}"
        
        # Export IPA if export options provided
        if [ -f "../ExportOptions.plist" ]; then
            echo -e "${YELLOW}Exporting IPA...${NC}"
            
            EXPORT_PATH="$PROJECT_ROOT/build/export"
            mkdir -p "$EXPORT_PATH"
            
            xcodebuild \
                -exportArchive \
                -archivePath "$ARCHIVE_PATH" \
                -exportPath "$EXPORT_PATH" \
                -exportOptionsPlist "../ExportOptions.plist"
            
            IPA_FILE=$(find "$EXPORT_PATH" -name "*.ipa" | head -n 1)
            if [ -f "$IPA_FILE" ]; then
                echo -e "${GREEN}IPA exported: $IPA_FILE${NC}"
                
                # Get IPA size
                IPA_SIZE=$(stat -f%z "$IPA_FILE")
                IPA_SIZE_MB=$((IPA_SIZE / 1024 / 1024))
                echo -e "${GREEN}IPA Size: ${IPA_SIZE_MB}MB${NC}"
            fi
        else
            echo -e "${YELLOW}Note: Create ExportOptions.plist to export IPA${NC}"
        fi
    else
        echo -e "${RED}Archive failed!${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Building iOS app...${NC}"
    
    xcodebuild \
        -workspace "$WORKSPACE" \
        -scheme "$SCHEME" \
        -configuration "$CONFIGURATION" \
        -destination 'generic/platform=iOS Simulator' \
        clean build
    
    echo -e "${GREEN}======================================${NC}"
    echo -e "${GREEN}Build successful!${NC}"
    echo -e "${GREEN}======================================${NC}"
    
    echo ""
    echo -e "${GREEN}To run in simulator:${NC}"
    echo -e "  cd mobile-app && npm run ios"
fi
