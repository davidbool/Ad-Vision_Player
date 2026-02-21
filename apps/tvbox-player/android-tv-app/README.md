# TV Box Player - Android TV Application

## Overview
TV Box Player is a Kotlin-based Android TV application that enables users to pair mobile devices, synchronize content from Google Drive, and stream media playlists to HDMI-connected displays.

## Project Structure
```
android-tv-app/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/tvboxplayer/
│   │   │   │   ├── ui/              # UI components (Activities)
│   │   │   │   ├── service/         # Background services
│   │   │   │   ├── data/            # Database, models, repositories
│   │   │   │   ├── network/         # API clients
│   │   │   │   ├── player/          # ExoPlayer integration
│   │   │   │   ├── cache/           # Cache management
│   │   │   │   └── util/            # Utility classes
│   │   │   ├── res/                 # Resources (layouts, drawables, values)
│   │   │   └── AndroidManifest.xml
│   │   └── test/                    # Unit tests
│   └── build.gradle.kts             # App-level build configuration
├── build.gradle.kts                 # Project-level build configuration
├── settings.gradle.kts              # Project settings
└── gradle.properties                # Gradle properties
```

## Requirements
- **Minimum SDK**: Android 6.0 (API 23)
- **Target SDK**: Android 14 (API 34)
- **Language**: Kotlin 1.9.22
- **Build Tool**: Gradle 8.2
- **JDK**: Java 17

## Key Features (MVP Phase 1)
- [x] Project structure and build configuration
- [x] Room database with entities and DAOs
- [x] Basic UI activities (MainActivity, PairingActivity, etc.)
- [x] Service stubs (API Server, mDNS, Content Sync, Playback)
- [ ] Device pairing with 6-digit PIN
- [ ] Local API server (Ktor)
- [ ] mDNS service discovery
- [ ] Google Drive integration
- [ ] Content sync service
- [ ] ExoPlayer media playback
- [ ] Cache management with LRU eviction
- [ ] Security implementation (encryption, JWT)

## Dependencies
The project uses the following key libraries:
- **AndroidX**: Core, Lifecycle, Room, WorkManager
- **Leanback**: TV-optimized UI components
- **ExoPlayer (Media3)**: Media playback
- **Ktor**: HTTP server
- **Room**: SQLite database
- **JmDNS**: Service discovery
- **JWT**: Token-based authentication
- **Coil**: Image loading
- **Timber**: Logging

See `app/build.gradle.kts` for the complete list of dependencies.

## Build Instructions

### Prerequisites
1. Install Android Studio (latest version)
2. Install JDK 17 or higher
3. Install Android SDK with API 23+ and API 34

### Building the APK
```bash
# Debug build
./gradlew assembleDebug

# Release build (requires signing configuration)
./gradlew assembleRelease
```

### Running on Device/Emulator
```bash
# Install debug build
./gradlew installDebug

# Run app
adb shell am start -n com.tvboxplayer/.ui.MainActivity
```

## Testing
```bash
# Run unit tests
./gradlew test

# Run instrumented tests
./gradlew connectedAndroidTest
```

## Configuration

### API Server Port
Default port: 8080
To change, modify `TvBoxApplication.DEFAULT_API_PORT`

### Cache Size
Default: 10GB
Configurable in app settings

### Security
- TLS 1.3 for network communication
- AES-256-GCM for cached content
- Android Keystore for credentials
- JWT tokens for API authentication

## Development Status
This is the initial project structure for MVP Phase 1. Core features are stubbed and ready for implementation.

### Completed
✅ Project structure
✅ Build configuration with all dependencies
✅ Database schema with Room
✅ UI activities and layouts
✅ Service stubs
✅ AndroidManifest with permissions

### In Progress
🚧 Pairing manager implementation
🚧 Ktor API server setup
🚧 JmDNS service registration
🚧 ExoPlayer integration
🚧 Google Drive API integration

### TODO
⬜ Cache manager with LRU eviction
⬜ Security implementation (encryption, JWT)
⬜ UI implementation with Leanback components
⬜ Unit and integration tests
⬜ ProGuard/R8 configuration
⬜ Release signing configuration

## Architecture
This application follows Clean Architecture principles:
- **Presentation Layer**: Activities, ViewModels
- **Application Layer**: Use cases, managers
- **Business Logic Layer**: Services, repositories
- **Data Layer**: Database, network, cache

## API Endpoints
The embedded API server exposes the following endpoints:
- `POST /api/v1/pairing/request` - Request pairing PIN
- `POST /api/v1/pairing/submit` - Submit pairing PIN
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/devices` - List paired devices
- `POST /api/v1/sync/start` - Start content sync
- `GET /api/v1/media` - List media items
- `POST /api/v1/playback/control` - Control playback

See `setup/API_AND_DATA_STRUCTURES.md` for complete API documentation.

## License
[To be determined]

## Contributing
This project is part of the TV Box Player MVP development.

## Contact
For questions or issues, please refer to the main project documentation.
