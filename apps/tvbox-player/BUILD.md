# Build Guide - TV Box Player

This guide provides comprehensive instructions for building the TV Box Player applications for all platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Android TV App](#android-tv-app)
- [Mobile App - Android](#mobile-app---android)
- [Mobile App - iOS](#mobile-app---ios)
- [Build Scripts](#build-scripts)
- [Troubleshooting](#troubleshooting)
- [Build Optimization](#build-optimization)

## Prerequisites

### General Requirements

- **Git**: Version control
- **Operating System**: 
  - Linux, macOS, or Windows with WSL for Android builds
  - macOS required for iOS builds

### Android Development

- **Java Development Kit (JDK)**: Version 17 or higher
  ```bash
  # Check Java version
  java -version
  ```
  
- **Android SDK**: API Level 23+ (Android 6.0)
  - Set `ANDROID_HOME` or `ANDROID_SDK_ROOT` environment variable
  - Install Android SDK Build-Tools 34.0.0
  - Install Android SDK Platform 34
  
  ```bash
  # Set environment variable (Linux/macOS)
  export ANDROID_HOME=$HOME/Android/Sdk
  export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
  ```

### React Native (Mobile App)

- **Node.js**: Version 18 or higher
  ```bash
  # Check Node.js version
  node --version
  ```
  
- **npm**: Version 9 or higher
  ```bash
  # Check npm version
  npm --version
  ```

### iOS Development (macOS only)

- **Xcode**: Version 14 or higher
  - Install from Mac App Store
  - Install Xcode Command Line Tools:
    ```bash
    xcode-select --install
    ```
  
- **CocoaPods**: Dependency manager for iOS
  ```bash
  sudo gem install cocoapods
  ```

## Quick Start

### Automated Setup

Run the setup script to configure your development environment:

```bash
# From project root
./scripts/setup.sh
```

This script will:
1. Check all prerequisites
2. Install dependencies for Android TV app
3. Install dependencies for Mobile app
4. Configure iOS dependencies (macOS only)
5. Create sample environment files

### Manual Setup

If you prefer manual setup:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd tvbox-player
   ```

2. **Setup Android TV App**:
   ```bash
   cd android-tv-app
   chmod +x gradlew
   ./gradlew tasks
   ```

3. **Setup Mobile App**:
   ```bash
   cd mobile-app
   npm install
   
   # iOS only (macOS)
   cd ios && pod install && cd ..
   ```

## Android TV App

### Project Structure

```
android-tv-app/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/tvboxplayer/
│   │   │   ├── res/
│   │   │   └── AndroidManifest.xml
│   │   └── test/
│   └── build.gradle.kts
├── build.gradle.kts
└── gradlew
```

### Build Commands

#### Debug Build

```bash
# Using build script (recommended)
./scripts/build-android-tv.sh debug

# Or using Gradle directly
cd android-tv-app
./gradlew assembleDebug
```

Output: `android-tv-app/app/build/outputs/apk/debug/app-debug.apk`

#### Release Build

```bash
# Using build script (recommended)
./scripts/build-android-tv.sh release

# Or using Gradle directly
cd android-tv-app
./gradlew assembleRelease
```

Output: `android-tv-app/app/build/outputs/apk/release/app-release.apk`

### Signing Configuration

For release builds, you need to configure signing:

1. **Generate a keystore** (first time only):
   ```bash
   keytool -genkey -v -keystore release.keystore \
     -alias tvboxplayer \
     -keyalg RSA \
     -keysize 2048 \
     -validity 10000
   ```

2. **Configure signing** via environment variables:
   ```bash
   export KEYSTORE_PASSWORD=your_keystore_password
   export KEY_ALIAS=tvboxplayer
   export KEY_PASSWORD=your_key_password
   ```

3. **Build with signing**:
   ```bash
   ./scripts/build-android-tv.sh release
   ```

### Testing

```bash
cd android-tv-app

# Run unit tests
./gradlew test

# Run lint checks
./gradlew lintDebug

# Run all tests
./scripts/test.sh android-tv
```

### Installation

```bash
# Connect Android TV Box via ADB
adb connect <device-ip>:5555

# Install APK
adb install -r android-tv-app/app/build/outputs/apk/debug/app-debug.apk
```

## Mobile App - Android

### Project Structure

```
mobile-app/
├── android/
│   ├── app/
│   │   ├── src/
│   │   └── build.gradle
│   ├── build.gradle
│   └── gradlew
├── src/
├── package.json
└── tsconfig.json
```

### Build Commands

#### Debug Build

```bash
# Using build script (recommended)
./scripts/build-mobile-android.sh debug

# Or manually
cd mobile-app
npm install
cd android && ./gradlew assembleDebug
```

Output: `mobile-app/android/app/build/outputs/apk/debug/app-debug.apk`

#### Release Build - APK

```bash
# Using build script (recommended)
./scripts/build-mobile-android.sh release apk

# Or manually
cd mobile-app/android
./gradlew assembleRelease
```

Output: `mobile-app/android/app/build/outputs/apk/release/app-release.apk`

#### Release Build - AAB (App Bundle)

For Google Play Store submission:

```bash
# Using build script (recommended)
./scripts/build-mobile-android.sh release aab

# Or manually
cd mobile-app/android
./gradlew bundleRelease
```

Output: `mobile-app/android/app/build/outputs/bundle/release/app-release.aab`

### Signing Configuration

1. **Generate a keystore** (first time only):
   ```bash
   cd mobile-app/android/app
   keytool -genkey -v -keystore release.keystore \
     -alias mobileapp \
     -keyalg RSA \
     -keysize 2048 \
     -validity 10000
   ```

2. **Configure signing** via environment variables:
   ```bash
   export KEYSTORE_PASSWORD=your_keystore_password
   export KEY_ALIAS=mobileapp
   export KEY_PASSWORD=your_key_password
   ```

3. **Build with signing**:
   ```bash
   ./scripts/build-mobile-android.sh release
   ```

### Testing

```bash
cd mobile-app

# Run unit tests
npm test

# Run lint
npm run lint

# Run type check
npm run type-check

# Run all tests
./scripts/test.sh mobile
```

### Running on Device/Emulator

```bash
# Start Metro bundler
cd mobile-app
npm start

# In another terminal, install and run
npm run android
```

## Mobile App - iOS

**Note**: iOS builds require macOS.

### Project Structure

```
mobile-app/
├── ios/
│   ├── tvboxplayermobile/
│   ├── tvboxplayermobile.xcodeproj
│   ├── tvboxplayermobile.xcworkspace
│   ├── Podfile
│   └── Pods/
└── src/
```

### Build Commands

#### Debug Build

```bash
# Using build script (recommended)
./scripts/build-mobile-ios.sh Debug build

# Or manually
cd mobile-app
npm install
cd ios && pod install && cd ..

cd ios
xcodebuild -workspace tvboxplayermobile.xcworkspace \
  -scheme tvboxplayermobile \
  -configuration Debug \
  -destination 'generic/platform=iOS Simulator' \
  clean build
```

#### Release Build & Archive

```bash
# Using build script (recommended)
./scripts/build-mobile-ios.sh Release archive

# Or manually
cd mobile-app/ios
xcodebuild -workspace tvboxplayermobile.xcworkspace \
  -scheme tvboxplayermobile \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath ../build/tvboxplayer.xcarchive \
  clean archive
```

### Signing Configuration

1. **Apple Developer Account**: Required for distribution
2. **Certificates**: Create in Apple Developer Portal
   - Development Certificate
   - Distribution Certificate
   
3. **Provisioning Profiles**: 
   - Development Profile
   - App Store Distribution Profile

4. **Configure in Xcode**:
   - Open `mobile-app/ios/tvboxplayermobile.xcworkspace`
   - Select project → Signing & Capabilities
   - Select your team and signing certificates

### Export IPA

Create `ExportOptions.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <true/>
</dict>
</plist>
```

Export the archive:

```bash
xcodebuild -exportArchive \
  -archivePath build/tvboxplayer.xcarchive \
  -exportPath build/export \
  -exportOptionsPlist ExportOptions.plist
```

### Testing

```bash
cd mobile-app

# Run tests
npm test

# Run on iOS Simulator
npm run ios
```

## Build Scripts

The project includes several utility scripts in the `scripts/` directory:

### Setup Script

```bash
./scripts/setup.sh
```

Configures the development environment and installs all dependencies.

### Build Scripts

```bash
# Android TV
./scripts/build-android-tv.sh [debug|release]

# Mobile Android
./scripts/build-mobile-android.sh [debug|release] [apk|aab]

# Mobile iOS (macOS only)
./scripts/build-mobile-ios.sh [Debug|Release] [build|archive]
```

### Test Script

```bash
# Run all tests
./scripts/test.sh all

# Run Android TV tests only
./scripts/test.sh android-tv

# Run Mobile app tests only
./scripts/test.sh mobile
```

### Clean Script

```bash
# Clean all builds
./scripts/clean.sh all

# Clean specific project
./scripts/clean.sh android-tv
./scripts/clean.sh mobile

# Deep clean (includes node_modules)
./scripts/clean.sh all --deep
```

### Version Management Script

```bash
# Get current versions
./scripts/version.sh get

# Set version for all apps
./scripts/version.sh set 1.2.0

# Bump version
./scripts/version.sh bump patch  # 1.0.0 → 1.0.1
./scripts/version.sh bump minor  # 1.0.0 → 1.1.0
./scripts/version.sh bump major  # 1.0.0 → 2.0.0
```

## Troubleshooting

### Common Issues

#### Android SDK Not Found

```
Error: ANDROID_HOME is not set
```

**Solution**:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### Gradle Daemon Issues

```
Error: Gradle daemon disappeared unexpectedly
```

**Solution**:
```bash
cd android-tv-app  # or mobile-app/android
./gradlew --stop
./gradlew clean
```

#### Node Modules Issues

```
Error: Cannot find module 'react-native'
```

**Solution**:
```bash
cd mobile-app
rm -rf node_modules package-lock.json
npm install
```

#### CocoaPods Issues (iOS)

```
Error: Unable to find a specification for ...
```

**Solution**:
```bash
cd mobile-app/ios
rm -rf Pods Podfile.lock
pod cache clean --all
pod install --repo-update
```

#### Out of Memory During Build

**Solution**:
```bash
# Increase Gradle memory
export GRADLE_OPTS="-Xmx4g -XX:MaxMetaspaceSize=512m"
```

### Build Size Issues

If APK size exceeds 50MB:

1. **Enable ProGuard/R8**:
   - Already enabled in release builds
   
2. **Remove unused resources**:
   ```kotlin
   android {
       buildTypes {
           release {
               isShrinkResources = true
           }
       }
   }
   ```

3. **Use APK Splits** (if needed):
   ```kotlin
   android {
       splits {
           abi {
               isEnable = true
               reset()
               include("armeabi-v7a", "arm64-v8a", "x86", "x86_64")
               isUniversalApk = true
           }
       }
   }
   ```

4. **Optimize images**: Use WebP format for images

5. **Analyze APK**:
   ```bash
   cd android-tv-app
   ./gradlew assembleRelease
   # Use Android Studio → Build → Analyze APK
   ```

## Build Optimization

### Gradle Optimization

Add to `gradle.properties`:

```properties
# Enable Gradle caching
org.gradle.caching=true

# Enable parallel builds
org.gradle.parallel=true

# Configure workers
org.gradle.workers.max=4

# Increase memory
org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError
```

### React Native Optimization

1. **Enable Hermes** (already enabled):
   ```gradle
   project.ext.react = [
       enableHermes: true
   ]
   ```

2. **Optimize Metro bundler**:
   ```javascript
   // metro.config.js
   module.exports = {
     transformer: {
       minifierPath: 'metro-minify-terser',
       minifierConfig: {
         compress: { drop_console: true }
       }
     }
   };
   ```

## Build Requirements Summary

### Android TV App
- **Size**: < 50MB (requirement)
- **Min SDK**: 23 (Android 6.0)
- **Target SDK**: 34 (Android 14)
- **Build Time**: ~2-5 minutes (clean build)

### Mobile App - Android
- **Min SDK**: 21 (Android 5.0)
- **Target SDK**: 34 (Android 14)
- **Build Time**: ~3-7 minutes (clean build)

### Mobile App - iOS
- **Min iOS**: 12.0
- **Xcode**: 14+
- **Build Time**: ~5-10 minutes (clean build)

## Next Steps

After building successfully:
1. See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
2. See [CI_CD.md](CI_CD.md) for CI/CD pipeline information
3. Review app store submission guidelines

## Additional Resources

- [Android Developer Guide](https://developer.android.com/studio/build)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [iOS App Distribution Guide](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)
