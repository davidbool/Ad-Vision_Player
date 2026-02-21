# TV Box Player

[![Build Status](https://github.com/alexbol99/tvbox-player/workflows/Android%20TV%20Build/badge.svg)](https://github.com/alexbol99/tvbox-player/actions)
[![Code Quality](https://github.com/alexbol99/tvbox-player/workflows/Code%20Quality/badge.svg)](https://github.com/alexbol99/tvbox-player/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> ⚠️ **IMPORTANT: CURRENT STATUS** ⚠️
> 
> This project is currently in **SKELETON/PROOF-OF-CONCEPT** state:
> - ✅ **Architecture & Structure**: Complete and production-ready
> - ✅ **Mobile App (80%)**: UI, API client, mDNS discovery fully functional
> - ⚠️ **Android TV App (20%)**: UI exists but **backend services are stubs**
> - ❌ **Device Pairing**: Will NOT work - HTTP server and mDNS not implemented
> - ❌ **Media Playback**: Not implemented (ExoPlayer integration needed)
> - ❌ **Cloud Sync**: Not implemented (Google Drive integration needed)
> 
> **See [IMPLEMENTATION_STATUS_HONEST.md](./IMPLEMENTATION_STATUS_HONEST.md) for detailed analysis.**
>
> **What Works:** Mobile app UI, type checking, builds, CI/CD, documentation  
> **What Doesn't:** Network communication, pairing, playback, sync (all TODO stubs)

A comprehensive, open-source media player solution for Android TV boxes with mobile companion apps for iOS and Android. Stream your cloud content, manage playlists, and control playback remotely with an intuitive interface.

**Current Phase:** Architecture Complete, Feature Implementation Needed

## ✨ Features (Architecture Defined, Implementation Needed)

> 📝 **Note:** The features listed below describe the **planned architecture**. 
> Current implementation status is documented in [IMPLEMENTATION_STATUS_HONEST.md](./IMPLEMENTATION_STATUS_HONEST.md).

### 📺 Android TV Box App (Architecture Complete)
- **Kotlin-native** application optimized for TV interfaces
- **ExoPlayer** integration for smooth 4K@30fps playback ⚠️ (not implemented)
- **Intelligent caching** with LRU eviction ⚠️ (not implemented)
- **Local API server** (Ktor) for mobile communication ⚠️ (not implemented)
- **mDNS discovery** for automatic device detection ⚠️ (not implemented)
- **Room database** for efficient data management ✅ (schema defined)

### 📱 Mobile Companion App (80% Complete)
- **React Native** cross-platform application ✅ (fully functional)
- **Device pairing** via 6-digit PIN codes ⚠️ (UI ready, backend needed)
- **Remote control** interface with real-time feedback ✅ (UI complete)
- **Cloud integration** (Google Drive in MVP) ⚠️ (not implemented)
- **Playlist management** - create, edit, reorder ✅ (UI complete)
- **Material Design** UI with dark mode support ✅ (fully functional)

### 🔐 Security & Privacy (Designed, Partially Implemented)
- **AES-256-GCM** encryption for cached media ⚠️ (not implemented)
- **TLS 1.3** for all network communication ⚠️ (not configured)
- **JWT tokens** (RS256) for authentication ⚠️ (not implemented)
- **OAuth 2.0** for cloud provider access ⚠️ (not implemented)
- **GDPR & CCPA** compliant ✅ (documentation complete)
- See [SECURITY.md](./SECURITY.md) for details

### 🎯 Planned Core Capabilities
- 🔗 **Device Pairing** - Secure PIN-based pairing (< 10 seconds) ⚠️ TODO
- ☁️ **Cloud Sync** - Google Drive integration with progress tracking ⚠️ TODO
- 🎬 **Media Playback** - Video, audio, image slideshow support ⚠️ TODO
- 💾 **Smart Caching** - Automatic pre-caching and storage management ⚠️ TODO
- 🎮 **Remote Control** - Full playback control from mobile device ⚠️ TODO
- 📋 **Playlists** - Create and manage custom playlists ⚠️ TODO
- 🔄 **Auto-sync** - Background content synchronization ⚠️ TODO

**Legend:** ✅ Implemented | ⚠️ TODO/Stub | ❌ Blocked

## Project Structure

```
tvbox-player/
├── android-tv-app/          # Android TV Box application
│   └── app/src/
│       ├── main/            # Production code
│       └── test/            # Unit & integration tests
├── mobile-app/              # React Native mobile app
│   ├── src/                 # Production code
│   └── __tests__/           # Test suites
├── TESTING.md               # Comprehensive testing guide
├── TEST_PLAN.md             # Detailed test plan with scenarios
└── TESTING_QUICK_START.md   # Quick start guide for testing
```

## 🚀 Quick Start

### Prerequisites

**Required:**
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **JDK** 17 or higher
- **Android SDK** (for Android builds)

**Optional:**
- **Android Studio** (recommended for Android TV development)
- **Xcode** (required for iOS builds, macOS only)

### One-Command Setup

We provide an automated setup script:

```bash
# Clone repository
git clone https://github.com/alexbol99/tvbox-player.git
cd tvbox-player

# Run automated setup
./scripts/setup.sh
```

This script will:
- ✅ Check all prerequisites
- ✅ Install dependencies for both apps
- ✅ Configure development environment
- ✅ Set up build tools

### Manual Setup

If you prefer manual setup:

**Mobile App:**
```bash
cd mobile-app
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..
```

**Android TV App:**
```bash
cd android-tv-app
./gradlew build
```

## Testing

This project maintains **>80% code coverage** with comprehensive test suites.

### Run Tests

**Mobile App:**
```bash
cd mobile-app
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage report
```

**Android TV App:**
```bash
cd android-tv-app
./gradlew test              # Run unit tests
./gradlew testDebugUnitTest jacocoTestReport  # With coverage
```

### Documentation

**Testing:**
- 📖 **[TESTING.md](./TESTING.md)** - Complete testing guide
- 📋 **[TEST_PLAN.md](./TEST_PLAN.md)** - Detailed test scenarios
- 🚀 **[TESTING_QUICK_START.md](./TESTING_QUICK_START.md)** - Quick start guide

**Security & Compliance:**
- 🔒 **[SECURITY.md](./SECURITY.md)** - Security policy and architecture
- 🔐 **[SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md)** - Implementation checklist
- 🔏 **[PRIVACY_POLICY.md](./PRIVACY_POLICY.md)** - Privacy policy (GDPR/CCPA compliant)
- 📜 **[TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md)** - Terms of service

### Test Coverage

| Component | Coverage Target |
|-----------|----------------|
| Overall | >80% |
| Critical Paths | >95% |
| Business Logic | >90% |
| UI Components | >70% |

## Development

### Mobile App

```bash
cd mobile-app
npm run android             # Run on Android
npm run ios                 # Run on iOS
npm run lint                # Lint code
npm run format              # Format code
```

### Android TV App

```bash
cd android-tv-app
./gradlew assembleDebug     # Build debug APK
./gradlew installDebug      # Install on device
./gradlew lint              # Lint code
```

## Architecture

- **Mobile App**: React Native + Redux + Redux Saga
- **Android TV**: Kotlin + Coroutines + Room + Ktor
- **Communication**: REST API + JWT authentication
- **Discovery**: mDNS service discovery
- **Storage**: SQLite (Android), AsyncStorage (Mobile)

## Security

TV Box Player implements comprehensive security measures:

- 🔐 **Authentication**: PIN-based pairing + JWT tokens
- 🔒 **Encryption**: AES-256-GCM for media, SQLCipher for database
- 🌐 **Network**: TLS 1.3, certificate pinning
- 🔑 **Credential Storage**: Android Keystore / iOS Keychain
- 🛡️ **Privacy**: GDPR and CCPA compliant

**Report Security Issues**: security@tvboxplayer.com

See [SECURITY.md](./SECURITY.md) for details.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

**Quick steps:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`./scripts/test.sh`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

### Documentation
- 📖 [BUILD.md](./BUILD.md) - Build instructions
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- 🔧 [CI_CD.md](./CI_CD.md) - CI/CD documentation
- 🧪 [TESTING.md](./TESTING.md) - Testing guide
- 🔒 [SECURITY.md](./SECURITY.md) - Security policy

### Getting Help
- **Issues**: Search [existing issues](https://github.com/alexbol99/tvbox-player/issues) or create a new one
- **Discussions**: Join [GitHub Discussions](https://github.com/alexbol99/tvbox-player/discussions)
- **Email**: support@tvboxplayer.com

### Reporting Security Issues
**DO NOT** create public issues for security vulnerabilities.
Email: security@tvboxplayer.com

See [SECURITY.md](./SECURITY.md) for details.

## 🙏 Acknowledgments

- Built with [React Native](https://reactnative.dev/)
- Powered by [ExoPlayer](https://exoplayer.dev/)
- Architecture inspired by clean architecture principles
- Testing framework from [Jest](https://jestjs.io/) and [JUnit](https://junit.org/)

## 📊 Project Status

**Current Phase**: MVP (Phase 1) - Foundation Complete ✅

- ✅ Android TV app structure
- ✅ Mobile app structure (iOS/Android)
- ✅ CI/CD pipeline
- ✅ Testing infrastructure
- ✅ Security & compliance documentation
- 🚧 Feature implementation (in progress)

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

**Made with ❤️ by the TV Box Player community**
