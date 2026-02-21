# iOS Placeholder

This directory will contain the iOS native project files.

To initialize the iOS project, run:
```bash
npx react-native init TVBoxPlayer --template react-native-template-typescript
```

Then copy the generated `ios/` folder here.

## Required Permissions

Add the following to `Info.plist`:

```xml
<key>NSBonjourServices</key>
<array>
    <string>_tvboxplayer._tcp</string>
    <string>_tvboxplayer._tcp.local</string>
</array>
<key>NSLocalNetworkUsageDescription</key>
<string>This app needs to discover TV Box devices on your local network</string>
```

## Minimum iOS Version

Set deployment target to iOS 12.0 in Xcode project settings.
