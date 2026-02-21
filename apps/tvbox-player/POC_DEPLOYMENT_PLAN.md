# TV Box Player - Proof of Concept Build and Deployment Guide

**Date**: 2026-02-20  
**Status**: In Progress  
**Purpose**: Build and deploy PoC applications for Android TV Box and iPhone

## Overview

This document tracks the process of building and deploying the TV Box Player applications as a proof of concept.

## Current State

### What We Have
✅ Complete project structure and architecture  
✅ Build scripts for all platforms  
✅ CI/CD workflows configured  
✅ Comprehensive documentation  
✅ Test infrastructure  

### What's Missing for Builds
❌ Android TV: Missing Gradle wrapper (gradlew)  
❌ Mobile: Native iOS and Android projects not initialized  
❌ iOS: Requires Apple Developer credentials for signing  
❌ Release signing: No keystores configured  

## Build Strategy

### Option 1: Debug Builds (Recommended for PoC)
**Pros:**
- No signing certificates required
- Quick to build and deploy
- Good for testing and demonstration

**Cons:**
- Can't be distributed via app stores
- Android requires "Install from unknown sources"
- iOS requires device UUIDs or ad-hoc distribution

### Option 2: Release Builds
**Pros:**
- Production-ready
- Can submit to app stores
- Better security

**Cons:**
- Requires Apple Developer account ($99/year)
- Requires signing certificates setup
- More complex process

## Deployment Options

### A. GitHub Releases (Recommended - Free)
**Advantages:**
- Free hosting
- Automatic via GitHub Actions
- Built-in version control
- Direct download links
- Checksum verification

**Setup:**
```bash
# Tag a version to trigger release
git tag -a v0.1.0-poc -m "Proof of Concept Release"
git push origin v0.1.0-poc
```

### B. Cloud Storage (AWS S3, Google Cloud Storage, Azure Blob)
**Advantages:**
- Fast CDN delivery
- Custom domain possible
- More control over access

**Disadvantages:**
- Requires cloud account and credentials
- Potential costs
- More setup complexity

### C. Direct Web Hosting
**Advantages:**
- Simple HTTP download
- Custom website

**Disadvantages:**
- Requires web server
- Bandwidth costs

## Implementation Plan

### Phase 1: Project Initialization ⏳

#### Step 1.1: Initialize Android TV Gradle Project
```bash
cd android-tv-app
gradle wrapper --gradle-version 8.2
```

#### Step 1.2: Initialize React Native Native Projects
```bash
cd mobile-app
npx react-native init TVBoxPlayerMobile --template react-native-template-typescript
# Copy native folders to our project
```

### Phase 2: Build Applications 🔨

#### Step 2.1: Build Android TV APK
```bash
cd android-tv-app
./gradlew assembleDebug
# Output: app/build/outputs/apk/debug/app-debug.apk
```

#### Step 2.2: Build Android Mobile APK
```bash
cd mobile-app/android
./gradlew assembleDebug
# Output: app/build/outputs/apk/debug/app-debug.apk
```

#### Step 2.3: Build iOS IPA (Requires macOS)
```bash
cd mobile-app/ios
pod install
xcodebuild -workspace TVBoxPlayer.xcworkspace -scheme TVBoxPlayer -configuration Debug
# Create IPA archive
```

### Phase 3: Package for Distribution 📦

#### Create Release Package Structure
```
releases/
├── v0.1.0-poc/
│   ├── tvbox-player-androidtv-v0.1.0.apk
│   ├── tvbox-player-androidtv-v0.1.0.apk.sha256
│   ├── tvbox-player-android-v0.1.0.apk
│   ├── tvbox-player-android-v0.1.0.apk.sha256
│   ├── tvbox-player-ios-v0.1.0.ipa (if available)
│   ├── tvbox-player-ios-v0.1.0.ipa.sha256
│   ├── INSTALLATION-GUIDE.md
│   └── README.md
```

### Phase 4: Deploy to Cloud ☁️

#### GitHub Releases Deployment
1. Create release tag
2. Upload artifacts via GitHub CLI or web interface
3. Generate download URLs

#### Alternative: Manual Upload
1. Build all applications
2. Generate checksums
3. Upload to chosen platform
4. Share download links

### Phase 5: Create Installation Guides 📱

#### Android TV Box Installation
1. Enable "Unknown Sources" in settings
2. Download APK from release URL
3. Install using file manager or adb
4. Grant required permissions

#### iPhone Installation (Without App Store)
**Option A: TestFlight (Requires Apple Developer)**
- Upload to TestFlight
- Share beta test link
- Users install via TestFlight app

**Option B: Ad-hoc Distribution**
- Register device UUIDs
- Build signed IPA with ad-hoc profile
- Install via Apple Configurator or Xcode

**Option C: Enterprise Distribution** (Requires Enterprise Account)
- Build with enterprise certificate
- Host IPA on web server
- Install via itms-services:// link

## Current Progress

### Completed ✅
- [x] Infrastructure assessment
- [x] Documentation review
- [x] Build strategy defined
- [x] Deployment options identified

### In Progress ⏳
- [ ] Initialize Android TV Gradle wrapper
- [ ] Initialize React Native native projects
- [ ] Build Android TV debug APK
- [ ] Build Android mobile debug APK
- [ ] Set up deployment location

### Pending 📋
- [ ] iOS build (requires macOS or CI runner)
- [ ] Create installation guides
- [ ] Upload to deployment location
- [ ] Test downloads and installations

## Required Information

To complete this PoC deployment, please provide:

1. **Deployment Preference:**
   - [ ] Use GitHub Releases (recommended, free)
   - [ ] Use AWS S3 (provide credentials)
   - [ ] Use Google Cloud Storage (provide credentials)
   - [ ] Use Azure Blob Storage (provide credentials)
   - [ ] Other: __________________

2. **iOS Signing:**
   - [ ] I have Apple Developer account (provide certificates)
   - [ ] Build unsigned for testing only
   - [ ] Skip iOS for now, Android only

3. **Build Type:**
   - [ ] Debug builds (no signing required)
   - [ ] Release builds (provide keystore/certificates)

4. **Access Level:**
   - [ ] Public download (anyone can access)
   - [ ] Private/restricted (authentication required)

## Next Steps

Once the above information is provided, I will:
1. Initialize the native projects
2. Build the applications
3. Deploy to the chosen platform
4. Create installation documentation
5. Provide download links and instructions

## Notes

- **App Store Submission** not included in PoC scope (requires review process, time, and fees)
- **Core Features** are skeleton/stub implementations - apps will install but need feature development
- **Testing** on actual devices recommended but not required for PoC
- **Signing Certificates** if needed, can be generated or provided by you

## Contact for Approvals

Please confirm:
- Deployment method preference
- iOS signing approach
- Any cloud credentials needed
- Timeline expectations

---

**Document Owner**: Development Team  
**Last Updated**: 2026-02-20  
**Version**: 0.1.0
