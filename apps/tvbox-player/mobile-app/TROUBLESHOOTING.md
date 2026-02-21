# Mobile App Troubleshooting Guide

## Quick Start (Fixed Issues)

### Issue: npm start fails with "ERR_INVALID_ARG_TYPE"

**Status**: ✅ FIXED

**Problem**: The error occurred due to:
1. Invalid package version `react-native-zeroconf@^1.1.0` (doesn't exist)
2. Missing Babel plugin configuration
3. TypeScript configuration conflicts

**Solution**: All fixed in the latest commit. Simply run:

```bash
cd mobile-app
rm -rf node_modules package-lock.json
npm install
npm start
```

## Common Issues and Solutions

### 1. Metro Bundler Won't Start

**Symptoms**: 
- Error messages about missing modules
- Port 8081 already in use

**Solutions**:
```bash
# Clean and restart
npm start -- --reset-cache

# Or if port 8081 is in use
lsof -ti:8081 | xargs kill -9  # macOS/Linux
npm start
```

### 2. iOS Build Issues

**Prerequisites**:
- macOS only
- Xcode 14+ installed
- CocoaPods installed (`sudo gem install cocoapods`)

**Setup**:
```bash
cd ios
pod install
cd ..
npm run ios
```

### 3. Android Build Issues

**Prerequisites**:
- Android Studio installed
- Android SDK (API 21+)
- ANDROID_HOME environment variable set

**Common Fixes**:
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
npm run android
```

### 4. TypeScript Errors

**Note**: The skeleton code has some TypeScript errors that are expected:
- Missing action creators (will be implemented)
- Missing type definitions for some modules
- These don't prevent the Metro bundler from running

**To check**:
```bash
npm run type-check
```

### 5. ESLint Warnings

**Note**: Some ESLint warnings are expected in skeleton code:
- Use of `any` types
- Unused variables in test files
- These are code quality improvements for future implementation

**To check**:
```bash
npm run lint
```

## Development Workflow

### Starting Development

1. **Start Metro bundler** (in one terminal):
   ```bash
   npm start
   ```

2. **Run on iOS** (in another terminal):
   ```bash
   npm run ios
   ```

3. **Run on Android** (in another terminal):
   ```bash
   npm run android
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## Environment Setup

### Required Versions
- Node.js: 18.x or higher
- npm: 9.x or higher
- React Native: 0.73.2

### Check Your Versions
```bash
node --version    # Should be v18.x or higher
npm --version     # Should be 9.x or higher
```

## Dependencies

### Key Dependencies Fixed
- ✅ `react-native-zeroconf`: Updated to `^0.14.0` (was incorrectly `^1.1.0`)
- ✅ Babel config: Removed unused `react-native-reanimated/plugin`
- ✅ TypeScript config: Fixed moduleResolution conflicts
- ✅ ESLint config: Fixed jest environment issues

### If Dependencies Fail to Install

```bash
# Clear npm cache
npm cache clean --force

# Remove and reinstall
rm -rf node_modules package-lock.json
npm install

# Use legacy peer deps if needed
npm install --legacy-peer-deps
```

## Platform-Specific Notes

### iOS (macOS only)

**First time setup**:
```bash
cd ios
pod install
cd ..
```

**If pods fail**:
```bash
cd ios
pod deintegrate
pod cache clean --all
pod install
cd ..
```

### Android

**Environment Variables** (add to ~/.bashrc or ~/.zshrc):
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=$HOME/Android/Sdk          # Linux
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Getting Help

1. Check this troubleshooting guide
2. Review [SETUP.md](./SETUP.md) for detailed setup instructions
3. Check [React Native documentation](https://reactnative.dev/docs/environment-setup)
4. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)

## Verified Working Setup

✅ **Last verified**: 2026-02-20

**Working configuration**:
- Node.js: v24.13.0 (minimum v18.x required)
- npm: 11.6.2 (minimum v9.x required)
- React Native: 0.73.2
- Metro: 0.80.12

**Status**: All build commands working correctly after fixes applied.
