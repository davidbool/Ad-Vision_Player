# Android Placeholder

This directory will contain the Android native project files.

To initialize the Android project, run:
```bash
npx react-native init TVBoxPlayer --template react-native-template-typescript
```

Then copy the generated `android/` folder here.

## Required Permissions

Add to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
```

For Android 12+ (API 31+):
```xml
<uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES" />
```

## Minimum SDK Version

Set `minSdkVersion` to 21 (Android 5.0) in `build.gradle`.
