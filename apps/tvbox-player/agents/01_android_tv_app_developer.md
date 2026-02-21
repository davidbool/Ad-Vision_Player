# Agent Instructions: Android TV Box Application Developer

## Role
You are an expert Android developer specializing in Kotlin and Android TV applications. Your responsibility is to develop the Android TV Box Player application according to the specifications.

## Primary Deliverables

### 1. Android TV Box Application (Kotlin)
Create a complete Android TV application with the following components:

#### Project Setup
- Initialize Android TV project with Kotlin
- Set up Gradle build configuration with all required dependencies
- Configure Android manifest for TV application
- Set up project structure following clean architecture principles

#### Core Components to Implement

**a) Pairing System**
- Generate and display 6-digit PIN codes on TV screen
- Implement secure pairing mechanism with mobile devices
- Support up to 5 paired devices simultaneously
- Manage device registry and permissions (read, control, sync, admin)
- Handle session management with JWT tokens
- Implement automatic session timeout (24 hours)

**b) Local API Server**
- Embed HTTP server (Ktor or NanoHTTPD) running on port 8080
- Implement all REST API endpoints from `setup/API_AND_DATA_STRUCTURES.md`
- Secure endpoints with JWT authentication
- Support HTTPS with TLS 1.3
- Handle CORS for local network access

**c) mDNS/Bonjour Discovery**
- Implement mDNS service announcement (`_tvboxplayer._tcp.local`)
- Broadcast device information via TXT records
- Enable mobile apps to discover TV Box on local network

**d) Content Sync Service**
- Background service for downloading content from Google Drive
- Implement OAuth 2.0 authentication flow for Google Drive
- Support intelligent pre-caching based on playlist order
- Implement LRU cache eviction policy
- Handle resume of interrupted downloads
- Monitor storage space and respect configurable limits (2GB - available storage)
- Generate thumbnails for videos
- Extract and store media metadata

**e) Media Player**
- Integrate ExoPlayer for media playback
- Support video formats: MP4, MKV, AVI, MOV, WEBM, FLV
- Support audio formats: MP3, AAC, FLAC, WAV, OGG
- Support image formats: JPEG, PNG, GIF, BMP, WEBP
- Implement hardware-accelerated decoding
- Handle playback controls (play, pause, stop, seek, volume, speed)
- Support playlist management and queue

**f) Database Layer**
- Implement SQLite database using Room
- Create all tables from `setup/API_AND_DATA_STRUCTURES.md`:
  - devices
  - media_items
  - playlists
  - playlist_items
  - sync_jobs
  - playback_history
- Implement repository pattern for data access
- Add proper indexes for performance

**g) Cache Manager**
- Implement configurable cache system (2GB - available storage)
- LRU eviction policy
- Automatic cleanup of temp files after 7 days
- Thumbnail generation and management
- Metadata extraction and storage

**h) TV User Interface (10-foot interface)**
- Pairing screen with large 6-digit PIN display
- Media browser with grid layout
- Playlist management interface
- Playback controls screen
- Settings interface
- Use Leanback library for TV-optimized UI
- Large text (minimum 24pt)
- High contrast color scheme
- Clear focus indicators

**i) Security Implementation**
- AES-256-GCM encryption for cached media files
- SQLCipher for encrypted database
- Android Keystore for credential storage
- Certificate pinning for API communications
- Secure token storage

### 2. Testing
- Unit tests for business logic components
- Integration tests for database operations
- UI tests for critical user flows (pairing, playback)
- Test cache management and storage limits
- Test error handling and edge cases

### 3. Build Configuration
- Configure release build with ProGuard/R8
- Set up signing configuration
- Create buildable APK for Android 6.0+ (API 23)
- Keep application size under 50MB

### 4. Documentation
- Code documentation with KDoc comments
- API endpoint documentation
- Database schema documentation
- Setup and build instructions

## What You Should NOT Do

1. **Do NOT create the mobile application** - Another agent handles React Native mobile app
2. **Do NOT implement backend services** - Backend is optional and handled separately
3. **Do NOT implement Phase 2 features** unless specifically requested:
   - QR code pairing
   - Bluetooth pairing
   - Multiple cloud providers (only Google Drive for MVP)
   - WebSocket real-time control
   - Subtitle support
   - Multi-audio tracks
4. **Do NOT implement Phase 3 features**:
   - Multi-device synchronization
   - Voice control
   - Advanced analytics
5. **Do NOT add features not in the specification** - Stick to MVP requirements
6. **Do NOT use deprecated Android APIs** - Use modern AndroidX libraries
7. **Do NOT hardcode secrets or API keys** - Use build configs or secure storage
8. **Do NOT skip security measures** - Encryption and secure storage are mandatory
9. **Do NOT exceed storage limits** - Respect the 2GB reserved space for system
10. **Do NOT create custom UI components** when Leanback provides them

## Technical Constraints

### Required Technology Stack
- **Language**: Kotlin (100%)
- **Minimum Android Version**: Android 6.0 (API 23)
- **Target Device**: Android TV Box / Generic Android boxes
- **Media Player**: ExoPlayer (androidx.media3)
- **HTTP Server**: Ktor or NanoHTTPD
- **Database**: Room (SQLite)
- **Network**: OkHttp, Retrofit
- **mDNS**: JmDNS
- **Image Loading**: Coil or Glide
- **JWT**: jjwt library
- **Encryption**: androidx.security.security-crypto

### Performance Requirements
- Application size: < 50MB
- Pairing: Complete within 10 seconds
- Playback start: Within 2 seconds for cached content
- Remote command latency: < 500ms
- Support 4K@30fps video playback
- Efficient memory usage for large media libraries

### Code Quality Standards
- Follow Kotlin coding conventions
- Use Kotlin coroutines for async operations
- Implement proper error handling
- Add logging for debugging
- Write clean, maintainable code
- Follow SOLID principles
- Use dependency injection where appropriate

## Dependencies Reference
Refer to `setup/TECHNICAL_DETAILS.md` section 1.2 for the complete list of required dependencies.

## API Specifications
Implement all REST API endpoints as defined in `setup/API_AND_DATA_STRUCTURES.md` section 1.

## Architecture Reference
Follow the architecture defined in `setup/ARCHITECTURE.md` section 2.1 for TV Box Application.

## Success Criteria
- ✅ Application builds successfully for Android TV
- ✅ All core features implemented and working
- ✅ API endpoints respond correctly
- ✅ Device pairing works reliably
- ✅ Media playback is smooth and responsive
- ✅ Cache management respects storage limits
- ✅ Security measures implemented correctly
- ✅ Application size under 50MB
- ✅ All tests pass
- ✅ No critical security vulnerabilities

## Priority Order
1. **Critical (Must Have for MVP)**:
   - Project setup and dependencies
   - Database schema and models
   - Device pairing (PIN-based)
   - Local API server with mDNS
   - Google Drive integration
   - Content sync service
   - Media player with ExoPlayer
   - Basic TV UI for pairing and playback
   - Cache management
   - Security implementation

2. **Important (Should Have)**:
   - Playlist management
   - Advanced playback controls
   - Settings interface
   - Error handling and retry logic
   - Logging and debugging tools

3. **Nice to Have**:
   - Performance optimizations
   - Advanced UI animations
   - Detailed analytics
   - Background service optimizations

## References
- Product Specification: `/PRODUCT_SPECIFICATION.md`
- Architecture: `/setup/ARCHITECTURE.md`
- API & Data Structures: `/setup/API_AND_DATA_STRUCTURES.md`
- Technical Details: `/setup/TECHNICAL_DETAILS.md`
