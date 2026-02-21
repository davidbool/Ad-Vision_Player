#!/bin/bash
set -e

# TV Box Player - Version Management Script
# This script manages version numbers across all apps

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display usage
usage() {
    echo "Usage: $0 <command> [version]"
    echo ""
    echo "Commands:"
    echo "  get                  - Display current versions"
    echo "  set <version>        - Set version for all apps (e.g., 1.2.0)"
    echo "  bump <major|minor|patch> - Bump version number"
    echo ""
    echo "Examples:"
    echo "  $0 get"
    echo "  $0 set 1.2.0"
    echo "  $0 bump minor"
    exit 1
}

# Function to get current Android TV version
get_androidtv_version() {
    VERSION=$(grep "versionName = " "$PROJECT_ROOT/android-tv-app/app/build.gradle.kts" | sed 's/.*versionName = "\(.*\)".*/\1/')
    VERSION_CODE=$(grep "versionCode = " "$PROJECT_ROOT/android-tv-app/app/build.gradle.kts" | sed 's/.*versionCode = \(.*\)/\1/')
    echo "$VERSION ($VERSION_CODE)"
}

# Function to get current Mobile App version
get_mobile_version() {
    VERSION=$(grep '"version":' "$PROJECT_ROOT/mobile-app/package.json" | sed 's/.*"version": "\(.*\)".*/\1/')
    echo "$VERSION"
}

# Function to set Android TV version
set_androidtv_version() {
    local NEW_VERSION=$1
    local VERSION_CODE=$(date +%s)
    
    # Update build.gradle.kts
    sed -i.bak "s/versionName = \".*\"/versionName = \"$NEW_VERSION\"/" "$PROJECT_ROOT/android-tv-app/app/build.gradle.kts"
    sed -i.bak "s/versionCode = .*/versionCode = $VERSION_CODE/" "$PROJECT_ROOT/android-tv-app/app/build.gradle.kts"
    rm "$PROJECT_ROOT/android-tv-app/app/build.gradle.kts.bak"
    
    echo -e "${GREEN}✓ Android TV version set to $NEW_VERSION (code: $VERSION_CODE)${NC}"
}

# Function to set Mobile App version
set_mobile_version() {
    local NEW_VERSION=$1
    
    cd "$PROJECT_ROOT/mobile-app"
    npm version $NEW_VERSION --no-git-tag-version
    
    echo -e "${GREEN}✓ Mobile App version set to $NEW_VERSION${NC}"
}

# Function to bump version
bump_version() {
    local BUMP_TYPE=$1
    local CURRENT_VERSION=$(get_mobile_version)
    
    IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
    MAJOR="${VERSION_PARTS[0]}"
    MINOR="${VERSION_PARTS[1]}"
    PATCH="${VERSION_PARTS[2]}"
    
    case $BUMP_TYPE in
        major)
            MAJOR=$((MAJOR + 1))
            MINOR=0
            PATCH=0
            ;;
        minor)
            MINOR=$((MINOR + 1))
            PATCH=0
            ;;
        patch)
            PATCH=$((PATCH + 1))
            ;;
        *)
            echo -e "${RED}Error: Invalid bump type. Use major, minor, or patch${NC}"
            exit 1
            ;;
    esac
    
    NEW_VERSION="$MAJOR.$MINOR.$PATCH"
    echo "$NEW_VERSION"
}

# Main script
COMMAND=${1:-""}

case $COMMAND in
    get)
        echo -e "${BLUE}======================================${NC}"
        echo -e "${BLUE}Current Versions${NC}"
        echo -e "${BLUE}======================================${NC}"
        echo -e "${YELLOW}Android TV:${NC} $(get_androidtv_version)"
        echo -e "${YELLOW}Mobile App:${NC} $(get_mobile_version)"
        ;;
    
    set)
        VERSION=${2:-""}
        if [ -z "$VERSION" ]; then
            echo -e "${RED}Error: Version number required${NC}"
            usage
        fi
        
        # Validate version format (semantic versioning)
        if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo -e "${RED}Error: Invalid version format. Use semantic versioning (e.g., 1.2.0)${NC}"
            exit 1
        fi
        
        echo -e "${BLUE}Setting version to $VERSION for all apps...${NC}"
        set_androidtv_version "$VERSION"
        set_mobile_version "$VERSION"
        
        echo ""
        echo -e "${GREEN}======================================${NC}"
        echo -e "${GREEN}Version updated successfully!${NC}"
        echo -e "${GREEN}======================================${NC}"
        echo -e "${YELLOW}Don't forget to:${NC}"
        echo -e "  1. Update CHANGELOG.md"
        echo -e "  2. Commit the changes: git commit -am 'Bump version to $VERSION'"
        echo -e "  3. Tag the release: git tag -a v$VERSION -m 'Version $VERSION'"
        echo -e "  4. Push with tags: git push && git push --tags"
        ;;
    
    bump)
        BUMP_TYPE=${2:-""}
        if [ -z "$BUMP_TYPE" ]; then
            echo -e "${RED}Error: Bump type required (major, minor, or patch)${NC}"
            usage
        fi
        
        CURRENT_VERSION=$(get_mobile_version)
        NEW_VERSION=$(bump_version "$BUMP_TYPE")
        
        echo -e "${BLUE}Bumping $BUMP_TYPE version: $CURRENT_VERSION → $NEW_VERSION${NC}"
        
        set_androidtv_version "$NEW_VERSION"
        set_mobile_version "$NEW_VERSION"
        
        echo ""
        echo -e "${GREEN}======================================${NC}"
        echo -e "${GREEN}Version bumped successfully!${NC}"
        echo -e "${GREEN}======================================${NC}"
        ;;
    
    *)
        echo -e "${RED}Error: Unknown command '$COMMAND'${NC}"
        usage
        ;;
esac
