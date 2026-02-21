# Agent Instructions: Mobile Application Developer (React Native)

## Role
You are an expert React Native developer specializing in cross-platform mobile applications. Your responsibility is to develop the mobile companion app for the TV Box Player that works on both iOS and Android.

## Primary Deliverables

### 1. React Native Mobile Application
Create a cross-platform mobile application with the following components:

#### Project Setup
- Initialize React Native project (latest stable version)
- Configure for both iOS (minimum iOS 12.0) and Android (minimum API 21)
- Set up Redux + Redux-Saga for state management
- Configure React Navigation for app navigation
- Set up build configurations for development and release

#### Core Components to Implement

**a) Device Discovery and Pairing**
- Implement mDNS/Bonjour service discovery for TV Box devices
- Scan local network for `_tvboxplayer._tcp.local` services
- Display discovered TV Box devices with device info
- Implement PIN code entry screen with clear, large input
- Handle pairing flow and store authentication tokens
- Manage multiple paired devices (up to 5)
- Display paired devices list with ability to rename/unpair

**b) Google Drive Integration**
- Implement OAuth 2.0 authentication flow for Google Drive
- Use Google Drive SDK for file/folder browsing
- Display cloud content with thumbnails
- Allow user to select folders/files for sync
- Show sync progress with real-time updates
- Handle token refresh automatically
- Support incremental sync using delta APIs

**c) Remote Control Interface**
- Design intuitive remote control UI with gesture support
- Implement playback controls:
  - Play/Pause button
  - Skip forward/backward
  - Seek bar for scrubbing
  - Volume control
  - Playback speed adjustment (0.5x - 2x)
- Display current playback status
- Show media information (title, duration, progress)
- Support swipe gestures for quick controls

**d) Playlist Management**
- Create/edit/delete playlists interface
- Drag-and-drop reordering of playlist items
- Add/remove media items from playlists
- Display playlist with thumbnails
- Configure shuffle and repeat modes
- Save and share playlist configurations

**e) Content Browser**
- Grid/list view for media items
- Filter by media type (video, image, audio)
- Search functionality
- Sort options (date, name, size, duration)
- Thumbnail display with loading states
- Pull-to-refresh for content updates

**f) Settings Screen**
- Cache size configuration
- Playback quality settings
- Display settings (resolution, aspect ratio)
- Network settings
- About section with app version
- Device management (paired devices)
- Account settings (Google Drive)

**g) API Client**
- Implement REST API client for TV Box communication
- Base URL: `https://<tv-box-ip>:8080/api/v1/`
- JWT token-based authentication
- Automatic token refresh
- Request/response interceptors
- Error handling and retry logic
- Timeout configuration (30 seconds)

**h) State Management (Redux)**
- Device state (discovered, paired devices)
- Playlist state (playlists, current playlist)
- Content state (media items, sync jobs)
- Playback state (status, position, controls)
- Settings state (user preferences)
- Authentication state (tokens, user info)

**i) Redux-Saga Middleware**
- Device discovery saga
- API communication saga
- Cloud auth flow saga
- Real-time status updates saga
- Background sync saga
- Error handling saga

**j) User Interface**
- Material Design for Android
- Human Interface Guidelines for iOS
- Bottom navigation for main sections:
  - Devices
  - Remote Control
  - Media Library
  - Playlists
  - Settings
- Dark mode support
- Responsive design for tablets
- Loading states and error messages
- Empty states with helpful messages

**k) Offline Support**
- Store paired device information locally
- Cache API responses when appropriate
- Queue actions when offline
- Sync when connection restored
- Show offline indicators

### 2. Testing
- Unit tests for Redux reducers and actions
- Integration tests for API client
- Component tests with React Testing Library
- E2E tests for critical flows (pairing, remote control)
- Test on both iOS and Android devices
- Test various network conditions

### 3. Build Configuration
- Configure iOS build with proper provisioning
- Configure Android build with signing
- Set up app icons and splash screens
- Configure app permissions properly
- Prepare for App Store and Play Store submission

### 4. Documentation
- Component documentation with JSDoc
- API integration guide
- User guide for main features
- Setup and build instructions
- Troubleshooting guide

## What You Should NOT Do

1. **Do NOT create the Android TV Box application** - Another agent handles Kotlin TV app
2. **Do NOT implement backend services** - Backend is optional and handled separately
3. **Do NOT implement Phase 2 features** unless specifically requested:
   - QR code pairing
   - Bluetooth pairing
   - Multiple cloud providers (only Google Drive for MVP)
   - WebSocket real-time control (use REST API polling)
   - Advanced media editing features
4. **Do NOT implement Phase 3 features**:
   - Voice control
   - Multi-device synchronization
   - Advanced analytics
5. **Do NOT add features not in the specification** - Stick to MVP requirements
6. **Do NOT use native modules** unless absolutely necessary - Prefer pure JavaScript solutions
7. **Do NOT hardcode API endpoints or credentials** - Use environment configurations
8. **Do NOT skip accessibility features** - Follow WCAG guidelines
9. **Do NOT ignore platform-specific UI patterns** - Respect iOS and Android design guidelines
10. **Do NOT create custom navigation patterns** - Use React Navigation

## Technical Constraints

### Required Technology Stack
- **Framework**: React Native (latest stable)
- **State Management**: Redux + Redux-Saga
- **Navigation**: React Navigation v6+
- **HTTP Client**: Axios
- **Cloud SDK**: react-native-google-drive-api-wrapper or similar
- **mDNS**: react-native-zeroconf
- **Storage**: AsyncStorage or react-native-mmkv
- **UI Components**: React Native Paper (Material Design) or React Native Elements

### Platform Requirements
- **iOS**: Minimum iOS 12.0, Swift 5+
- **Android**: Minimum Android 5.0 (API 21), Kotlin support
- **Target**: Latest iOS and Android versions

### Performance Requirements
- App launch time: < 3 seconds
- Smooth 60fps UI animations
- API response handling within 500ms
- Efficient memory usage
- Small app bundle size
- Fast app switching and resume

### Code Quality Standards
- Follow Airbnb JavaScript Style Guide
- Use TypeScript for type safety (preferred)
- Use functional components with hooks
- Implement proper error boundaries
- Add comprehensive error handling
- Write clean, maintainable code
- Follow React best practices
- Use meaningful variable and function names

### Security Requirements
- Secure token storage (iOS Keychain, Android Keystore)
- HTTPS for all API communications
- Certificate pinning for sensitive endpoints
- No sensitive data in logs
- Proper input validation
- Handle user data with privacy in mind

## Mobile App Architecture

### Folder Structure
```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   ├── navigation/         # Navigation configuration
│   ├── redux/              # Redux store, actions, reducers
│   ├── sagas/              # Redux-Saga middleware
│   ├── services/           # API clients and services
│   ├── utils/              # Helper functions
│   ├── constants/          # App constants
│   ├── theme/              # Styling and theme
│   └── assets/             # Images, fonts, etc.
├── ios/                    # iOS native project
├── android/                # Android native project
└── __tests__/              # Test files
```

### Key Screens
1. **Device Discovery** - Scan and pair with TV Box
2. **Remote Control** - Main playback control interface
3. **Media Library** - Browse synced content
4. **Playlist Management** - Create and manage playlists
5. **Settings** - App configuration
6. **Cloud Browser** - Select content from Google Drive

## API Integration
Implement all client-side API calls as defined in `setup/API_AND_DATA_STRUCTURES.md` section 1:
- Authentication endpoints (pairing, token refresh)
- Device management endpoints
- Content sync endpoints
- Media library endpoints
- Playlist endpoints
- Playback control endpoints
- Settings endpoints
- System information endpoints

## Success Criteria
- ✅ App builds successfully for both iOS and Android
- ✅ All core features implemented and working
- ✅ Device discovery and pairing work reliably
- ✅ Remote control responds within 500ms
- ✅ Google Drive integration works smoothly
- ✅ UI is responsive and follows platform guidelines
- ✅ No memory leaks or performance issues
- ✅ All tests pass
- ✅ App ready for store submission
- ✅ No critical security vulnerabilities

## Priority Order
1. **Critical (Must Have for MVP)**:
   - Project setup and dependencies
   - mDNS device discovery
   - PIN-based pairing flow
   - API client implementation
   - Basic remote control interface
   - Playback status display
   - Google Drive OAuth integration
   - Content selection for sync

2. **Important (Should Have)**:
   - Playlist management
   - Media library browser
   - Advanced remote controls
   - Settings screen
   - Device management
   - Error handling and user feedback

3. **Nice to Have**:
   - Dark mode
   - Tablet optimization
   - Advanced animations
   - Offline mode enhancements
   - Performance optimizations

## References
- Product Specification: `/PRODUCT_SPECIFICATION.md`
- Architecture: `/setup/ARCHITECTURE.md` (Section 2.2)
- API & Data Structures: `/setup/API_AND_DATA_STRUCTURES.md`
- Technical Details: `/setup/TECHNICAL_DETAILS.md`

## Additional Guidelines

### User Experience
- Provide clear feedback for all actions
- Show loading states during operations
- Display helpful error messages
- Implement smooth transitions
- Support both orientations (portrait/landscape)
- Test with various screen sizes

### Accessibility
- Support screen readers
- Provide sufficient color contrast
- Make touch targets at least 44x44 points
- Support dynamic text sizing
- Test with accessibility features enabled

### Platform-Specific Considerations
- **iOS**: Use native navigation patterns, respect safe areas, implement swipe back
- **Android**: Use Material Design, support back button, implement proper activity lifecycle
