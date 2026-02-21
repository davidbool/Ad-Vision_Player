# Mobile App Setup Guide

> **✅ FIXED (2026-02-20)**: Previous build issues have been resolved. The app now builds successfully with `npm install` and `npm start`. See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for details.

## Prerequisites

1. **Node.js and npm**
   - Node.js 18 or later
   - npm 9 or later

2. **React Native Development Environment**
   
   **For iOS:**
   - macOS computer
   - Xcode 14 or later
   - CocoaPods (`sudo gem install cocoapods`)
   
   **For Android:**
   - Android Studio
   - Android SDK (API 21+)
   - Java Development Kit (JDK 11 or later)

## Installation Steps

### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

### 2. Initialize Native Projects

Since this is a new React Native project, you'll need to initialize the native projects:

```bash
# This will create ios/ and android/ directories with proper native code
npx react-native init TVBoxPlayerTemp --template react-native-template-typescript

# Copy the generated native folders
cp -r TVBoxPlayerTemp/ios ./
cp -r TVBoxPlayerTemp/android ./

# Clean up temporary project
rm -rf TVBoxPlayerTemp
```

### 3. Update Native Project Configurations

#### iOS (Info.plist)

Add the following permissions to `ios/TVBoxPlayer/Info.plist`:

```xml
<key>NSBonjourServices</key>
<array>
    <string>_tvboxplayer._tcp</string>
    <string>_tvboxplayer._tcp.local</string>
</array>
<key>NSLocalNetworkUsageDescription</key>
<string>This app needs to discover TV Box devices on your local network</string>
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

#### Android (AndroidManifest.xml)

Add permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
<uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES" 
                 android:maxSdkVersion="32" />
```

Update `android/app/build.gradle`:

```gradle
android {
    compileSdkVersion 33
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 33
    }
}
```

### 4. Install Native Dependencies

#### iOS

```bash
cd ios
pod install
cd ..
```

#### Android

The dependencies will be installed automatically when you build the app.

### 5. Run the App

#### iOS Simulator

```bash
npm run ios
```

Or specify a device:
```bash
npm run ios -- --simulator="iPhone 14"
```

#### Android Emulator

Make sure you have an Android emulator running, then:

```bash
npm run android
```

Or on a physical device:
```bash
npm run android -- --deviceId=<device-id>
```

## Development

### Start Metro Bundler

```bash
npm start
```

### Clear Cache

If you encounter issues:

```bash
# Clear Metro cache
npm start -- --reset-cache

# Clear watchman
watchman watch-del-all

# Clear iOS build
cd ios && xcodebuild clean && cd ..

# Clear Android build
cd android && ./gradlew clean && cd ..
```

## Troubleshooting

### Common Issues

1. **Metro Bundler Port Already in Use**
   ```bash
   lsof -ti:8081 | xargs kill
   ```

2. **CocoaPods Issues (iOS)**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   ```

3. **Android Build Failures**
   - Check that ANDROID_HOME environment variable is set
   - Verify Java version with `java -version`
   - Clear gradle cache: `cd android && ./gradlew clean`

4. **mDNS Discovery Not Working**
   - Ensure both devices are on same WiFi network
   - Check firewall settings
   - On Android 12+, grant NEARBY_WIFI_DEVICES permission

### Getting Help

- Check React Native documentation: https://reactnative.dev
- Review troubleshooting guide in README.md
- Check GitHub issues for similar problems

## Next Steps

1. Test device discovery by running the TV Box app
2. Test pairing flow with PIN code
3. Implement Google Drive integration
4. Add more features as specified in the product requirements

## Production Build

See README.md for instructions on building production versions for App Store and Google Play.
