# System Architecture - TV Box Player Application

## 1. Architecture Overview

The TV Box Player is a distributed system consisting of three main components:
1. **TV Box Application** (Android Native - Kotlin)
2. **Mobile Application** (React Native - iOS & Android)
3. **Backend Services** (Optional - Cloud-based)

### 1.1 High-Level Architecture Diagram

```
┌─────────────────┐         ┌──────────────────┐
│  Mobile App     │◄───────►│   TV Box App     │
│ (React Native)  │  Local  │   (Kotlin)       │
│                 │  Network│                  │
│ - Remote Control│         │ - Media Player   │
│ - Cloud Auth    │         │ - Content Cache  │
│ - Playlist Mgmt │         │ - Local API      │
└────────┬────────┘         └────────┬─────────┘
         │                           │
         │                           │
    ┌────▼──────────────────────────▼────┐
    │     Backend Services (Optional)    │
    │  - User Auth                       │
    │  - Device Management               │
    │  - Analytics                       │
    │  - Push Notifications              │
    └────────────────┬───────────────────┘
                     │
            ┌────────▼────────┐
            │  Cloud Storage  │
            │  - Google Drive │
            └─────────────────┘
```

## 2. Component Architecture

### 2.1 TV Box Application (Android/Kotlin)

#### 2.1.1 Layer Architecture
```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  - TV UI (10-foot interface)           │
│  - Pairing Screen                       │
│  - Media Browser                        │
│  - Playback Controls                    │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Application Layer               │
│  - Pairing Manager                      │
│  - Playlist Manager                     │
│  - Remote Control Handler               │
│  - Settings Manager                     │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Business Logic Layer            │
│  - Content Sync Service                 │
│  - Media Player Service                 │
│  - Cache Manager                        │
│  - Device Manager                       │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Data Layer                      │
│  - SQLite Database                      │
│  - File System Cache                    │
│  - Shared Preferences                   │
│  - Local API Server                     │
└─────────────────────────────────────────┘
```

#### 2.1.2 Key Components

**Pairing Manager**
- Generates 6-digit PIN codes
- Manages secure pairing process
- Maintains device registry (up to 5 devices)
- Handles session management and token refresh

**Content Sync Service**
- Background service for downloading content
- Implements intelligent pre-caching
- Manages LRU cache eviction
- Handles resume of interrupted downloads
- Monitors storage space

**Media Player Service**
- Uses ExoPlayer for media playback
- Handles video/audio/image rendering
- Manages playback queue
- Provides HDMI output control
- Implements hardware-accelerated decoding

**Local API Server**
- Embedded HTTP server (NanoHTTPD or Ktor)
- Exposes REST endpoints for mobile app
- Handles authentication via JWT tokens
- Implements mDNS/Bonjour for discovery

**Cache Manager**
- Manages configurable cache (2GB - available storage)
- Implements LRU eviction policy
- Generates thumbnails for videos
- Extracts and stores metadata
- Performs background cleanup

### 2.2 Mobile Application (React Native)

#### 2.2.1 Architecture Pattern: Redux + Redux-Saga

```
┌─────────────────────────────────────────┐
│         UI Components                   │
│  - Device Pairing Screen               │
│  - Remote Control Interface            │
│  - Playlist Management                 │
│  - Content Browser                     │
│  - Settings                            │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Redux Store                     │
│  - Device State                        │
│  - Playlist State                      │
│  - Content State                       │
│  - Settings State                      │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Redux-Saga Middleware           │
│  - Device Discovery                     │
│  - API Communication                    │
│  - Cloud Auth Flow                     │
│  - Real-time Updates                   │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Services Layer                  │
│  - TV Box API Client                   │
│  - Google Drive SDK                    │
│  - mDNS Discovery Service              │
│  - Authentication Service              │
└─────────────────────────────────────────┘
```

#### 2.2.2 Key Modules

**Device Discovery Service**
- Scans local network using mDNS
- Discovers available TV Box devices
- Maintains list of paired devices
- Handles device connectivity status

**TV Box API Client**
- REST API client for TV Box communication
- WebSocket support (Phase 2)
- Request/response handling
- Error handling and retry logic

**Google Drive Integration**
- OAuth 2.0 authentication flow
- File/folder browsing
- Incremental sync using delta APIs
- Download progress tracking

**Remote Control Module**
- Sends playback commands to TV Box
- Handles gesture-based controls
- Volume and seek operations
- Playlist navigation

### 2.3 Backend Services (Optional)

#### 2.3.1 Microservices Architecture

```
┌─────────────────────────────────────────┐
│         API Gateway / Load Balancer     │
│         (NGINX or AWS API Gateway)      │
└───────────────┬─────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
┌───────▼──────┐   ┌────▼────────┐
│ Auth Service │   │   Device    │
│              │   │  Management │
│ - OAuth 2.0  │   │   Service   │
│ - JWT Tokens │   │             │
└──────────────┘   └─────────────┘
                          │
        ┌─────────────────┴─────────────┐
        │                               │
┌───────▼──────┐              ┌────────▼─────┐
│  Analytics   │              │    Push      │
│   Service    │              │ Notification │
│              │              │   Service    │
└──────────────┘              └──────────────┘
```

**Authentication Service**
- User registration and login
- OAuth 2.0 provider integration
- JWT token generation and validation
- Session management
- Multi-factor authentication (future)

**Device Management Service**
- Device registration
- Device pairing history
- Multi-device synchronization
- Remote device management

**Analytics Service**
- Usage tracking
- Performance metrics
- Crash reporting
- User behavior analytics

**Push Notification Service**
- Content sync completion notifications
- Device pairing notifications
- System alerts

## 3. Communication Architecture

### 3.1 Local Network Communication

**Protocol Stack:**
```
┌─────────────────────────────────────┐
│     Application Layer               │
│  - REST API (JSON)                 │
│  - WebSocket (Phase 2)             │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│     Transport Layer                 │
│  - HTTPS (TLS 1.3)                 │
│  - TCP                             │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│     Network Layer                   │
│  - IPv4 / IPv6                     │
│  - mDNS for discovery              │
└─────────────────────────────────────┘
```

**Device Discovery (mDNS/Bonjour):**
- Service Type: `_tvboxplayer._tcp.local`
- Port: 8080 (configurable)
- TXT Records: device name, version, capabilities

**REST API Communication:**
- Base URL: `https://<tv-box-ip>:8080/api/v1/`
- Authentication: Bearer token (JWT)
- Content-Type: application/json
- Request timeout: 30 seconds

### 3.2 Internet Communication

**Cloud Provider APIs:**
- Google Drive API v3
- OAuth 2.0 authentication
- Rate limiting compliance (100 requests/100 seconds per user)
- Exponential backoff for retries

**Backend Services (if deployed):**
- RESTful API over HTTPS
- JWT-based authentication
- API versioning in URL path
- Rate limiting per API key

## 4. Data Flow Architecture

### 4.1 Device Pairing Flow

```
Mobile App                TV Box                 Backend (Optional)
    │                        │                          │
    │──1. Discover (mDNS)──►│                          │
    │◄──2. Announce─────────│                          │
    │                        │                          │
    │──3. Request PIN───────►│                          │
    │◄──4. Display PIN──────│                          │
    │                        │                          │
    │──5. Submit PIN────────►│                          │
    │                        │──6. Register Device─────►│
    │                        │◄─7. JWT Token───────────│
    │◄──8. Paired (Token)───│                          │
    │                        │                          │
```

### 4.2 Content Sync Flow

```
Mobile App          TV Box           Google Drive       Backend
    │                  │                    │              │
    │─1. Select Sync──►│                    │              │
    │                  │─2. Auth Token─────►│              │
    │                  │◄─3. File List──────│              │
    │                  │                    │              │
    │                  │─4. Download Files─►│              │
    │                  │◄─5. File Data──────│              │
    │                  │                    │              │
    │◄─6. Progress─────│                    │              │
    │                  │                    │              │
    │                  │─7. Extract Meta────┤              │
    │                  │─8. Generate Thumb──┤              │
    │                  │─9. Store Cache─────┤              │
    │                  │                    │              │
    │◄─10. Complete────│──11. Log Analytics────────────►│
```

### 4.3 Media Playback Flow

```
Mobile App               TV Box                 ExoPlayer
    │                       │                        │
    │──1. Play Playlist────►│                        │
    │                       │──2. Load Media────────►│
    │                       │◄──3. Ready─────────────│
    │                       │──4. Start Playback────►│
    │                       │                        │
    │──5. Control Command──►│──6. Execute Command───►│
    │◄──6. Status Update────│                        │
    │                       │◄──7. Playback Events───│
    │◄──7. Sync State───────│                        │
```

## 5. Storage Architecture

### 5.1 TV Box Storage Layout

```
/data/data/com.tvboxplayer.app/
├── databases/
│   └── tvbox.db               # SQLite database
├── cache/
│   ├── media/                 # Cached media files
│   │   ├── videos/
│   │   ├── images/
│   │   └── audio/
│   ├── thumbnails/            # Generated thumbnails
│   └── temp/                  # Temporary downloads
├── files/
│   ├── playlists/             # Saved playlists
│   └── metadata/              # Media metadata
└── shared_prefs/
    └── settings.xml           # App settings
```

### 5.2 Database Schema (SQLite)

**Tables:**
- `devices` - Paired mobile devices
- `media_items` - Cached media metadata
- `playlists` - User playlists
- `playlist_items` - Playlist contents
- `sync_jobs` - Content sync status
- `playback_history` - Playback tracking

### 5.3 Cache Management

**Cache Strategy:**
- LRU (Least Recently Used) eviction
- Reserved space: 2GB for system
- Configurable cache size: 2GB - (available - 2GB)
- Auto-cleanup of temp files after 7 days
- Priority caching for upcoming playlist items

## 6. Security Architecture

### 6.1 Security Layers

```
┌─────────────────────────────────────────┐
│    Application Security                 │
│  - Input validation                     │
│  - SQL injection prevention             │
│  - XSS protection                       │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│    Authentication & Authorization       │
│  - OAuth 2.0 for cloud providers       │
│  - JWT tokens for API access           │
│  - Token refresh mechanism             │
│  - Session timeout (24 hours)          │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│    Data Security                        │
│  - AES-256 for stored content          │
│  - Secure key storage (Android Keystore)│
│  - Encrypted database                   │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│    Transport Security                   │
│  - TLS 1.3 for all communications      │
│  - Certificate pinning                 │
│  - Perfect forward secrecy             │
└─────────────────────────────────────────┘
```

### 6.2 Authentication Flow

**OAuth 2.0 (Google Drive):**
1. Authorization Code Grant flow
2. PKCE (Proof Key for Code Exchange)
3. Refresh token storage in encrypted preferences
4. Automatic token refresh

**JWT Token Structure:**
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "device_id",
    "iat": 1234567890,
    "exp": 1234654290,
    "permissions": ["read", "control"]
  }
}
```

### 6.3 Encryption Implementation

**At Rest:**
- Media files: AES-256-GCM
- Database: SQLCipher
- Credentials: Android Keystore

**In Transit:**
- TLS 1.3 with modern cipher suites
- Certificate pinning for backend APIs
- mDNS announcements over encrypted channel

## 7. Deployment Architecture

### 7.1 TV Box Application Deployment

**Distribution:**
- APK sideloading for generic Android boxes
- Google Play Store (if requirements met)
- Direct download from website

**Installation:**
- Minimum Android 6.0 (API 23)
- Required permissions: Storage, Network, Wake Lock
- Installation size: ~50MB

**Updates:**
- In-app update mechanism
- Background download of updates
- Notification for update availability

### 7.2 Mobile Application Deployment

**iOS:**
- Apple App Store
- Minimum iOS 12.0
- React Native bundled app

**Android:**
- Google Play Store
- Minimum Android 5.0 (API 21)
- React Native bundled app

### 7.3 Backend Services Deployment (Optional)

**Cloud Infrastructure:**
- AWS / Google Cloud / Azure
- Containerized microservices (Docker/Kubernetes)
- Auto-scaling based on load
- Multi-region deployment

**Database:**
- PostgreSQL for relational data
- Redis for session management
- S3-compatible storage for logs

## 8. Scalability Considerations

### 8.1 TV Box Application
- Efficient memory management for large media libraries
- Background processing for non-critical tasks
- Optimized database queries with indexing
- Progressive loading for UI

### 8.2 Backend Services
- Horizontal scaling of microservices
- Database read replicas
- CDN for static content
- Message queue for async processing (RabbitMQ/AWS SQS)

### 8.3 Content Delivery
- Chunked downloads for large files
- Resume capability for interrupted transfers
- Parallel downloads (up to 3 concurrent)
- Adaptive bitrate streaming preparation (Phase 2)

## 9. Monitoring and Observability

### 9.1 Application Monitoring
- Crash reporting (Firebase Crashlytics)
- Performance monitoring (Firebase Performance)
- ANR (Application Not Responding) detection
- Memory leak detection

### 9.2 Backend Monitoring (if deployed)
- Service health checks
- API response time tracking
- Error rate monitoring
- Database performance metrics

### 9.3 User Analytics
- Feature usage tracking
- User engagement metrics
- Playback statistics
- Error tracking

## 10. Technology Stack Summary

### TV Box Application
- **Language**: Kotlin
- **Media Player**: ExoPlayer
- **HTTP Server**: Ktor or NanoHTTPD
- **Database**: SQLite / Room
- **Network**: OkHttp, Retrofit
- **mDNS**: JmDNS library
- **Image Loading**: Glide or Coil

### Mobile Application
- **Framework**: React Native
- **State Management**: Redux + Redux-Saga
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **Cloud SDK**: react-native-google-drive-api-wrapper
- **mDNS**: react-native-zeroconf
- **Storage**: AsyncStorage

### Backend Services (Optional)
- **Framework**: Node.js (Express) or Python (FastAPI)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-18  
**Status**: Technical Specification  
**Relates To**: PRODUCT_SPECIFICATION.md
