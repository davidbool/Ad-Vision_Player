# Build and Deployment Scripts

This directory contains utility scripts for building, testing, and managing the TV Box Player project.

## Available Scripts

### 🛠️ Setup and Installation

#### `setup.sh`
Sets up the development environment and installs all dependencies.

```bash
./scripts/setup.sh
```

**What it does**:
- Checks for required tools (Java, Node.js, Android SDK, Xcode)
- Installs Android TV app dependencies
- Installs Mobile app npm dependencies
- Installs iOS CocoaPods dependencies (macOS only)
- Creates example environment files
- Makes all scripts executable

**Requirements**:
- Java 17+
- Node.js 18+
- Android SDK (ANDROID_HOME set)
- Xcode and CocoaPods (macOS, for iOS builds)

---

### 🔨 Build Scripts

#### `build-android-tv.sh`
Builds the Android TV application.

```bash
# Debug build
./scripts/build-android-tv.sh debug

# Release build
./scripts/build-android-tv.sh release
```

**Outputs**:
- Debug: `android-tv-app/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android-tv-app/app/build/outputs/apk/release/app-release.apk`

**Environment Variables** (for release signing):
- `KEYSTORE_PASSWORD` - Keystore password
- `KEY_ALIAS` - Key alias (default: "tvboxplayer")
- `KEY_PASSWORD` - Key password

**Features**:
- Automatic size verification (< 50MB requirement)
- SHA-256 checksum generation for releases
- Color-coded output for easy reading
- Gradle daemon management

---

#### `build-mobile-android.sh`
Builds the React Native mobile app for Android.

```bash
# Debug APK
./scripts/build-mobile-android.sh debug

# Release APK
./scripts/build-mobile-android.sh release apk

# Release AAB (for Play Store)
./scripts/build-mobile-android.sh release aab
```

**Outputs**:
- Debug: `mobile-app/android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `mobile-app/android/app/build/outputs/apk/release/app-release.apk`
- Release AAB: `mobile-app/android/app/build/outputs/bundle/release/app-release.aab`

**Environment Variables** (for release signing):
- `KEYSTORE_PASSWORD` - Keystore password
- `KEY_ALIAS` - Key alias (default: "mobileapp")
- `KEY_PASSWORD` - Key password

**Features**:
- Automatic npm dependency installation
- SHA-256 checksum generation for releases
- Support for both APK and AAB output formats

---

#### `build-mobile-ios.sh`
Builds the React Native mobile app for iOS (macOS only).

```bash
# Debug build
./scripts/build-mobile-ios.sh Debug build

# Release build
./scripts/build-mobile-ios.sh Release build

# Archive for distribution
./scripts/build-mobile-ios.sh Release archive
```

**Outputs**:
- Build: Compiled app in Xcode build directory
- Archive: `build/tvboxplayer.xcarchive`
- IPA: `build/export/*.ipa` (if ExportOptions.plist exists)

**Requirements**:
- macOS
- Xcode 14+
- CocoaPods

**Features**:
- Automatic CocoaPods installation
- Workspace-based build
- Archive and IPA export support
- Xcode version checking

---

### 🧪 Testing

#### `test.sh`
Runs tests for all or specific applications.

```bash
# Run all tests
./scripts/test.sh all

# Android TV tests only
./scripts/test.sh android-tv

# Mobile app tests only
./scripts/test.sh mobile
```

**What it tests**:

**Android TV**:
- Unit tests (JUnit)
- Lint checks
- Build verification

**Mobile App**:
- ESLint (code style)
- TypeScript type checking
- Jest unit tests with coverage

**Features**:
- Automated dependency installation
- Coverage report generation
- Color-coded test results

---

### 🧹 Maintenance

#### `clean.sh`
Cleans build artifacts and caches.

```bash
# Clean everything
./scripts/clean.sh all

# Clean Android TV only
./scripts/clean.sh android-tv

# Clean Mobile app only
./scripts/clean.sh mobile

# Deep clean (includes node_modules)
./scripts/clean.sh all --deep
```

**What it removes**:

**Android TV**:
- `app/build/`
- `build/`
- `.gradle/`

**Mobile App**:
- `android/app/build/`
- `android/build/`
- `android/.gradle/`
- `ios/build/`
- `ios/Pods/`
- Metro bundler cache
- Jest cache
- `node_modules/` (with --deep flag)

**Use cases**:
- Resolve build issues
- Free up disk space
- Clean slate before important builds

---

### 📦 Version Management

#### `version.sh`
Manages version numbers across all applications.

```bash
# Display current versions
./scripts/version.sh get

# Set version for all apps
./scripts/version.sh set 1.2.0

# Bump version (patch)
./scripts/version.sh bump patch   # 1.0.0 → 1.0.1

# Bump version (minor)
./scripts/version.sh bump minor   # 1.0.0 → 1.1.0

# Bump version (major)
./scripts/version.sh bump major   # 1.0.0 → 2.0.0
```

**What it updates**:
- Android TV: `versionName` and `versionCode` in `build.gradle.kts`
- Mobile App: `version` in `package.json`

**Features**:
- Semantic versioning support (MAJOR.MINOR.PATCH)
- Automatic version code generation for Android
- Synchronized versioning across platforms
- Git tagging reminders

**Version numbering rules**:
- **MAJOR**: Breaking changes (2.0.0)
- **MINOR**: New features, backward compatible (1.1.0)
- **PATCH**: Bug fixes (1.0.1)

---

## Common Workflows

### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd tvbox-player

# 2. Run setup script
./scripts/setup.sh

# 3. Verify setup
./scripts/version.sh get
```

### Development Workflow

```bash
# 1. Make code changes
# ... edit files ...

# 2. Run tests
./scripts/test.sh all

# 3. Build for testing
./scripts/build-android-tv.sh debug
./scripts/build-mobile-android.sh debug

# 4. Install on device
adb install -r android-tv-app/app/build/outputs/apk/debug/app-debug.apk
```

### Release Workflow

```bash
# 1. Clean builds
./scripts/clean.sh all

# 2. Update version
./scripts/version.sh set 1.1.0

# 3. Update CHANGELOG.md
# ... edit CHANGELOG.md ...

# 4. Run all tests
./scripts/test.sh all

# 5. Build release artifacts
./scripts/build-android-tv.sh release
./scripts/build-mobile-android.sh release aab
./scripts/build-mobile-ios.sh Release archive  # macOS only

# 6. Commit and tag
git add .
git commit -m "Release version 1.1.0"
git tag -a v1.1.0 -m "Version 1.1.0"
git push origin main --tags
```

### Troubleshooting Workflow

```bash
# 1. Clean everything
./scripts/clean.sh all --deep

# 2. Re-setup
./scripts/setup.sh

# 3. Try building
./scripts/build-android-tv.sh debug
```

## Environment Variables

### Required for Release Builds

#### Android TV Release
```bash
export KEYSTORE_PASSWORD="your_keystore_password"
export KEY_ALIAS="tvboxplayer"
export KEY_PASSWORD="your_key_password"
```

#### Mobile Android Release
```bash
export KEYSTORE_PASSWORD="your_keystore_password"
export KEY_ALIAS="mobileapp"
export KEY_PASSWORD="your_key_password"
```

### Optional Configuration

```bash
# Gradle optimization
export GRADLE_OPTS="-Xmx4g -XX:MaxMetaspaceSize=512m"

# Android SDK location (if not in standard location)
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"

# Node.js optimization
export NODE_OPTIONS="--max-old-space-size=4096"
```

## Script Conventions

### Exit Codes
- `0` - Success
- `1` - Error (build failed, tests failed, invalid arguments)

### Output Colors
- 🔵 **Blue**: Section headers, informational
- 🟡 **Yellow**: Warnings, progress updates
- 🟢 **Green**: Success messages
- 🔴 **Red**: Errors, failures

### Error Handling
All scripts use `set -e` to exit on errors. This ensures that failures are caught immediately.

## Prerequisites

### All Platforms
- **Git**: Version control
- **Bash**: Shell (Linux/macOS), WSL (Windows)

### Android Builds
- **Java**: JDK 17 or higher
- **Android SDK**: API 23+ (Marshmallow)
- **ANDROID_HOME**: Environment variable set

### Mobile App Builds
- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher

### iOS Builds (macOS only)
- **macOS**: Required for iOS builds
- **Xcode**: Version 14 or higher
- **CocoaPods**: Dependency manager

Check prerequisites:
```bash
# Java
java -version

# Node.js
node --version
npm --version

# Android SDK
echo $ANDROID_HOME

# Xcode (macOS)
xcodebuild -version

# CocoaPods (macOS)
pod --version
```

## Troubleshooting

### Permission Denied

```bash
# Make scripts executable
chmod +x scripts/*.sh
```

### Gradle Daemon Issues

```bash
# Stop all Gradle daemons
./scripts/clean.sh android-tv
cd android-tv-app && ./gradlew --stop
```

### Node Modules Issues

```bash
# Deep clean and reinstall
./scripts/clean.sh mobile --deep
cd mobile-app && npm install
```

### CocoaPods Issues (iOS)

```bash
cd mobile-app/ios
rm -rf Pods Podfile.lock
pod cache clean --all
pod install --repo-update
```

## CI/CD Integration

These scripts are used by GitHub Actions workflows:

- `.github/workflows/android-tv-build.yml` uses `build-android-tv.sh`
- `.github/workflows/mobile-android-build.yml` uses `build-mobile-android.sh`
- `.github/workflows/mobile-ios-build.yml` uses `build-mobile-ios.sh`
- `.github/workflows/release.yml` uses `version.sh` and build scripts

See [CI_CD.md](../CI_CD.md) for more information.

## Contributing

When adding new scripts:

1. Follow existing naming conventions
2. Add proper error handling (`set -e`)
3. Use color-coded output
4. Document in this README
5. Make executable: `chmod +x script-name.sh`
6. Test on clean environment

## Support

For issues or questions:
- Check [BUILD.md](../BUILD.md) for build instructions
- Check [DEPLOYMENT.md](../DEPLOYMENT.md) for deployment guide
- Check [CI_CD.md](../CI_CD.md) for CI/CD documentation
- Open an issue on GitHub

---

**Last Updated**: 2024-01-18
**Version**: 1.0.0
