# TV Box Player - Mobile Application

React Native mobile companion app for controlling and managing the TV Box Player.

## Features

- **Device Discovery & Pairing**: Discover TV Box devices on local network using mDNS and pair using PIN codes
- **Remote Control**: Control playback with play/pause, skip, seek, volume, and speed controls
- **Media Library**: Browse synced media from cloud storage with search and filtering
- **Playlist Management**: Create, edit, and manage playlists
- **Settings**: Configure playback, display, and cache settings

## Requirements

- **iOS**: iOS 12.0 or later
- **Android**: Android 5.0 (API 21) or later
- Node.js 18+
- React Native development environment

## Installation

1. Install dependencies:
```bash
npm install
```

2. iOS specific setup:
```bash
cd ios && pod install && cd ..
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## Project Structure

```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   │   ├── DevicesScreen.tsx
│   │   ├── PairingScreen.tsx
│   │   ├── RemoteControlScreen.tsx
│   │   ├── MediaLibraryScreen.tsx
│   │   ├── PlaylistsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/         # Navigation configuration
│   ├── redux/              # Redux store, actions, reducers
│   │   ├── actions/
│   │   ├── reducers/
│   │   └── store/
│   ├── sagas/              # Redux-Saga middleware
│   ├── services/           # API clients and services
│   │   ├── apiClient.ts    # REST API client
│   │   ├── mdnsService.ts  # mDNS device discovery
│   │   └── storageService.ts # Local storage
│   ├── utils/              # Helper functions and types
│   ├── constants/          # App constants
│   ├── theme/              # Styling and theme
│   └── App.tsx             # Main app component
├── ios/                    # iOS native project
├── android/                # Android native project
└── __tests__/              # Test files
```

## Technologies Used

- **React Native**: Cross-platform mobile framework
- **Redux + Redux-Saga**: State management
- **React Navigation**: Navigation library
- **React Native Paper**: Material Design UI components
- **Axios**: HTTP client
- **react-native-zeroconf**: mDNS device discovery
- **react-native-keychain**: Secure token storage
- **TypeScript**: Type safety

## API Integration

The app communicates with TV Box devices via REST API:

- **Base URL**: `https://<tv-box-ip>:8080/api/v1/`
- **Authentication**: JWT Bearer tokens
- **Discovery**: mDNS service type `_tvboxplayer._tcp.local`

See `/setup/API_AND_DATA_STRUCTURES.md` for complete API documentation.

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

### Format Code
```bash
npm run format
```

## Building for Production

### iOS
1. Open `ios/TVBoxPlayer.xcworkspace` in Xcode
2. Select your development team
3. Archive and upload to App Store

### Android
1. Generate release keystore
2. Configure `android/app/build.gradle`
3. Build release APK:
```bash
cd android && ./gradlew assembleRelease
```

## Troubleshooting

### iOS
- If pods fail to install, try: `cd ios && pod deintegrate && pod install`
- For M1 Macs, use: `arch -x86_64 pod install`

### Android
- Clear gradle cache: `cd android && ./gradlew clean`
- Check that Android SDK is properly configured

### mDNS Discovery
- Ensure both devices are on the same WiFi network
- Check firewall settings allow multicast traffic
- On Android 12+, ensure NEARBY_WIFI_DEVICES permission is granted

## Contributing

See main project README for contribution guidelines.

## License

See main project LICENSE file.
