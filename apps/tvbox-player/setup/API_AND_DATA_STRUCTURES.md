# API and Data Structures - TV Box Player Application

## 1. REST API Specification

### 1.1 API Overview

**Base URL**: `https://<tv-box-ip>:8080/api/v1/`  
**Authentication**: Bearer token (JWT)  
**Content-Type**: `application/json`  
**API Version**: v1

### 1.2 Authentication Endpoints

#### 1.2.1 Request Pairing PIN

**Endpoint**: `POST /pairing/request`

**Description**: Request a new pairing PIN to be displayed on the TV Box.

**Request:**
```json
{
  "device_name": "John's iPhone",
  "device_type": "mobile",
  "platform": "ios",
  "app_version": "1.0.0"
}
```

**Response (200 OK):**
```json
{
  "session_id": "abc123...",
  "expires_at": "2026-02-18T19:33:36.180Z",
  "pin_display_duration": 300
}
```

**Errors:**
- `400` - Invalid request
- `429` - Too many pairing requests
- `503` - TV Box not ready

#### 1.2.2 Submit Pairing PIN

**Endpoint**: `POST /pairing/submit`

**Description**: Submit the PIN code to complete pairing.

**Request:**
```json
{
  "session_id": "abc123...",
  "pin_code": "123456",
  "device_name": "John's iPhone",
  "device_id": "device-uuid-here"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "refresh_token_here",
  "expires_in": 86400,
  "device_id": "device-uuid-here",
  "permissions": ["read", "control", "sync"]
}
```

**Errors:**
- `400` - Invalid PIN or session
- `401` - PIN expired
- `403` - Maximum devices paired (5)
- `404` - Session not found

#### 1.2.3 Refresh Token

**Endpoint**: `POST /auth/refresh`

**Description**: Refresh an expired access token.

**Request:**
```json
{
  "refresh_token": "refresh_token_here",
  "device_id": "device-uuid-here"
}
```

**Response (200 OK):**
```json
{
  "access_token": "new_access_token",
  "expires_in": 86400
}
```

#### 1.2.4 Revoke Device

**Endpoint**: `DELETE /auth/devices/{device_id}`

**Description**: Unpair a device.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

### 1.3 Device Management Endpoints

#### 1.3.1 List Paired Devices

**Endpoint**: `GET /devices`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "devices": [
    {
      "device_id": "device-uuid-1",
      "device_name": "John's iPhone",
      "device_type": "mobile",
      "platform": "ios",
      "paired_at": "2026-02-18T10:00:00Z",
      "last_seen": "2026-02-18T18:30:00Z",
      "is_primary": true,
      "permissions": ["read", "control", "sync", "admin"]
    },
    {
      "device_id": "device-uuid-2",
      "device_name": "Jane's Android",
      "device_type": "mobile",
      "platform": "android",
      "paired_at": "2026-02-17T14:00:00Z",
      "last_seen": "2026-02-18T16:00:00Z",
      "is_primary": false,
      "permissions": ["read", "control"]
    }
  ],
  "max_devices": 5,
  "current_count": 2
}
```

#### 1.3.2 Get Device Info

**Endpoint**: `GET /devices/{device_id}`

**Response (200 OK):**
```json
{
  "device_id": "device-uuid-1",
  "device_name": "John's iPhone",
  "device_type": "mobile",
  "platform": "ios",
  "app_version": "1.0.0",
  "paired_at": "2026-02-18T10:00:00Z",
  "last_seen": "2026-02-18T18:30:00Z",
  "is_primary": true,
  "permissions": ["read", "control", "sync", "admin"]
}
```

#### 1.3.3 Update Device

**Endpoint**: `PATCH /devices/{device_id}`

**Request:**
```json
{
  "device_name": "John's New iPhone",
  "is_primary": true
}
```

**Response (200 OK):**
```json
{
  "device_id": "device-uuid-1",
  "device_name": "John's New iPhone",
  "is_primary": true,
  "updated_at": "2026-02-18T18:33:36Z"
}
```

### 1.4 Content Sync Endpoints

#### 1.4.1 Initiate Sync

**Endpoint**: `POST /sync/start`

**Description**: Start syncing content from cloud storage.

**Request:**
```json
{
  "provider": "google_drive",
  "auth_token": "cloud_provider_token",
  "folders": [
    {
      "folder_id": "folder123",
      "recursive": true,
      "media_types": ["video", "image", "audio"]
    }
  ],
  "sync_options": {
    "cache_priority": "high",
    "download_quality": "original",
    "generate_thumbnails": true
  }
}
```

**Response (202 Accepted):**
```json
{
  "sync_job_id": "sync-job-uuid",
  "status": "pending",
  "created_at": "2026-02-18T18:33:36Z",
  "estimated_files": 150,
  "estimated_size": 524288000
}
```

#### 1.4.2 Get Sync Status

**Endpoint**: `GET /sync/jobs/{job_id}`

**Response (200 OK):**
```json
{
  "sync_job_id": "sync-job-uuid",
  "status": "in_progress",
  "progress": {
    "total_files": 150,
    "downloaded_files": 75,
    "failed_files": 2,
    "total_bytes": 524288000,
    "downloaded_bytes": 262144000,
    "percent_complete": 50
  },
  "started_at": "2026-02-18T18:33:36Z",
  "estimated_completion": "2026-02-18T19:03:36Z",
  "current_file": {
    "name": "vacation_2026.mp4",
    "size": 104857600,
    "downloaded": 52428800
  }
}
```

**Status Values:**
- `pending` - Queued for processing
- `in_progress` - Currently downloading
- `completed` - Successfully completed
- `failed` - Failed with errors
- `cancelled` - Cancelled by user

#### 1.4.3 Cancel Sync

**Endpoint**: `POST /sync/jobs/{job_id}/cancel`

**Response (200 OK):**
```json
{
  "sync_job_id": "sync-job-uuid",
  "status": "cancelled",
  "cancelled_at": "2026-02-18T18:40:00Z"
}
```

#### 1.4.4 List Sync Jobs

**Endpoint**: `GET /sync/jobs`

**Query Parameters:**
- `status` - Filter by status (optional)
- `limit` - Number of results (default: 20, max: 100)
- `offset` - Pagination offset

**Response (200 OK):**
```json
{
  "jobs": [
    {
      "sync_job_id": "sync-job-uuid-1",
      "status": "completed",
      "created_at": "2026-02-18T10:00:00Z",
      "completed_at": "2026-02-18T10:15:00Z",
      "total_files": 50,
      "total_bytes": 104857600
    }
  ],
  "total_count": 5,
  "limit": 20,
  "offset": 0
}
```

### 1.5 Media Library Endpoints

#### 1.5.1 Get Media Items

**Endpoint**: `GET /media`

**Query Parameters:**
- `type` - Filter by media type (video, image, audio)
- `search` - Search query
- `sort` - Sort field (date, name, size, duration)
- `order` - Sort order (asc, desc)
- `limit` - Results per page (default: 50, max: 200)
- `offset` - Pagination offset

**Response (200 OK):**
```json
{
  "items": [
    {
      "media_id": "media-uuid-1",
      "filename": "vacation_2026.mp4",
      "media_type": "video",
      "mime_type": "video/mp4",
      "size": 104857600,
      "duration": 300,
      "resolution": "1920x1080",
      "codec": "h264",
      "thumbnail_url": "/api/v1/media/media-uuid-1/thumbnail",
      "cloud_provider": "google_drive",
      "cloud_id": "file123",
      "created_at": "2026-02-15T10:00:00Z",
      "synced_at": "2026-02-18T10:05:00Z",
      "cached": true,
      "cache_path": "/cache/media/videos/vacation_2026.mp4"
    }
  ],
  "total_count": 150,
  "limit": 50,
  "offset": 0
}
```

#### 1.5.2 Get Media Item Details

**Endpoint**: `GET /media/{media_id}`

**Response (200 OK):**
```json
{
  "media_id": "media-uuid-1",
  "filename": "vacation_2026.mp4",
  "media_type": "video",
  "mime_type": "video/mp4",
  "size": 104857600,
  "duration": 300,
  "resolution": "1920x1080",
  "codec": "h264",
  "bitrate": 2800000,
  "framerate": 30,
  "audio_codec": "aac",
  "audio_channels": 2,
  "thumbnail_url": "/api/v1/media/media-uuid-1/thumbnail",
  "cloud_provider": "google_drive",
  "cloud_id": "file123",
  "created_at": "2026-02-15T10:00:00Z",
  "modified_at": "2026-02-15T10:00:00Z",
  "synced_at": "2026-02-18T10:05:00Z",
  "cached": true,
  "cache_path": "/cache/media/videos/vacation_2026.mp4",
  "metadata": {
    "title": "Family Vacation 2026",
    "description": "Summer vacation memories",
    "tags": ["vacation", "family", "2026"]
  }
}
```

#### 1.5.3 Delete Media Item

**Endpoint**: `DELETE /media/{media_id}`

**Query Parameters:**
- `delete_from_cloud` - Also delete from cloud storage (default: false)

**Response (204 No Content)**

#### 1.5.4 Get Thumbnail

**Endpoint**: `GET /media/{media_id}/thumbnail`

**Response (200 OK):**
- Content-Type: image/jpeg
- Binary image data

### 1.6 Playlist Endpoints

#### 1.6.1 List Playlists

**Endpoint**: `GET /playlists`

**Response (200 OK):**
```json
{
  "playlists": [
    {
      "playlist_id": "playlist-uuid-1",
      "name": "Family Videos",
      "description": "All family videos collection",
      "item_count": 25,
      "total_duration": 7500,
      "thumbnail_url": "/api/v1/playlists/playlist-uuid-1/thumbnail",
      "created_at": "2026-02-10T10:00:00Z",
      "updated_at": "2026-02-18T15:00:00Z",
      "is_smart": false,
      "shuffle": false,
      "repeat": false
    }
  ],
  "total_count": 5
}
```

#### 1.6.2 Create Playlist

**Endpoint**: `POST /playlists`

**Request:**
```json
{
  "name": "Summer 2026",
  "description": "Summer vacation videos",
  "media_ids": ["media-uuid-1", "media-uuid-2"],
  "shuffle": false,
  "repeat": false
}
```

**Response (201 Created):**
```json
{
  "playlist_id": "playlist-uuid-new",
  "name": "Summer 2026",
  "description": "Summer vacation videos",
  "item_count": 2,
  "created_at": "2026-02-18T18:33:36Z"
}
```

#### 1.6.3 Get Playlist Details

**Endpoint**: `GET /playlists/{playlist_id}`

**Response (200 OK):**
```json
{
  "playlist_id": "playlist-uuid-1",
  "name": "Family Videos",
  "description": "All family videos collection",
  "items": [
    {
      "position": 0,
      "media_id": "media-uuid-1",
      "filename": "vacation_2026.mp4",
      "media_type": "video",
      "duration": 300,
      "thumbnail_url": "/api/v1/media/media-uuid-1/thumbnail"
    }
  ],
  "item_count": 25,
  "total_duration": 7500,
  "created_at": "2026-02-10T10:00:00Z",
  "updated_at": "2026-02-18T15:00:00Z",
  "shuffle": false,
  "repeat": false
}
```

#### 1.6.4 Update Playlist

**Endpoint**: `PATCH /playlists/{playlist_id}`

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "shuffle": true,
  "repeat": true
}
```

**Response (200 OK):**
```json
{
  "playlist_id": "playlist-uuid-1",
  "name": "Updated Name",
  "updated_at": "2026-02-18T18:33:36Z"
}
```

#### 1.6.5 Add Items to Playlist

**Endpoint**: `POST /playlists/{playlist_id}/items`

**Request:**
```json
{
  "media_ids": ["media-uuid-3", "media-uuid-4"],
  "position": 5
}
```

**Response (200 OK):**
```json
{
  "playlist_id": "playlist-uuid-1",
  "items_added": 2,
  "new_item_count": 27
}
```

#### 1.6.6 Reorder Playlist Items

**Endpoint**: `PUT /playlists/{playlist_id}/items/reorder`

**Request:**
```json
{
  "media_ids": ["media-uuid-2", "media-uuid-1", "media-uuid-3"]
}
```

**Response (200 OK):**
```json
{
  "playlist_id": "playlist-uuid-1",
  "reordered": true
}
```

#### 1.6.7 Remove Items from Playlist

**Endpoint**: `DELETE /playlists/{playlist_id}/items`

**Request:**
```json
{
  "media_ids": ["media-uuid-1", "media-uuid-2"]
}
```

**Response (200 OK):**
```json
{
  "playlist_id": "playlist-uuid-1",
  "items_removed": 2,
  "new_item_count": 23
}
```

#### 1.6.8 Delete Playlist

**Endpoint**: `DELETE /playlists/{playlist_id}`

**Response (204 No Content)**

### 1.7 Playback Control Endpoints

#### 1.7.1 Start Playback

**Endpoint**: `POST /playback/start`

**Request:**
```json
{
  "playlist_id": "playlist-uuid-1",
  "start_position": 0,
  "autoplay": true
}
```

**Response (200 OK):**
```json
{
  "playback_session_id": "session-uuid",
  "status": "playing",
  "current_item": {
    "media_id": "media-uuid-1",
    "filename": "vacation_2026.mp4",
    "position": 0
  },
  "started_at": "2026-02-18T18:33:36Z"
}
```

#### 1.7.2 Get Playback Status

**Endpoint**: `GET /playback/status`

**Response (200 OK):**
```json
{
  "playback_session_id": "session-uuid",
  "status": "playing",
  "playlist_id": "playlist-uuid-1",
  "current_item": {
    "media_id": "media-uuid-1",
    "filename": "vacation_2026.mp4",
    "position": 0,
    "duration": 300
  },
  "playback_position": 45.5,
  "volume": 75,
  "playback_speed": 1.0,
  "shuffle": false,
  "repeat": false,
  "buffering": false,
  "buffer_percent": 100
}
```

**Status Values:**
- `idle` - No playback
- `loading` - Loading media
- `playing` - Currently playing
- `paused` - Paused
- `buffering` - Buffering content
- `ended` - Playback ended

#### 1.7.3 Control Playback

**Endpoint**: `POST /playback/control`

**Request:**
```json
{
  "action": "pause"
}
```

**Actions:**
- `play` - Resume playback
- `pause` - Pause playback
- `stop` - Stop playback
- `next` - Skip to next item
- `previous` - Go to previous item
- `seek` - Seek to position (requires `position` field)
- `set_volume` - Set volume (requires `volume` field 0-100)
- `set_speed` - Set playback speed (requires `speed` field 0.5-2.0)

**Request with Parameters:**
```json
{
  "action": "seek",
  "position": 120.5
}
```

**Response (200 OK):**
```json
{
  "status": "paused",
  "playback_position": 120.5,
  "executed_at": "2026-02-18T18:35:00Z"
}
```

#### 1.7.4 Stop Playback

**Endpoint**: `POST /playback/stop`

**Response (200 OK):**
```json
{
  "status": "idle",
  "stopped_at": "2026-02-18T18:36:00Z"
}
```

### 1.8 Settings Endpoints

#### 1.8.1 Get Settings

**Endpoint**: `GET /settings`

**Response (200 OK):**
```json
{
  "cache": {
    "max_size": 2147483648,
    "current_size": 1073741824,
    "auto_cleanup": true,
    "cleanup_threshold": 90
  },
  "playback": {
    "default_quality": "1080p",
    "hardware_acceleration": true,
    "subtitle_enabled": false,
    "auto_play_next": true
  },
  "display": {
    "resolution": "1080p",
    "aspect_ratio": "16:9",
    "screen_saver_enabled": true,
    "screen_saver_timeout": 300
  },
  "network": {
    "mdns_enabled": true,
    "api_port": 8080,
    "max_download_speed": 0
  }
}
```

#### 1.8.2 Update Settings

**Endpoint**: `PATCH /settings`

**Request:**
```json
{
  "cache": {
    "max_size": 3221225472
  },
  "playback": {
    "default_quality": "720p"
  }
}
```

**Response (200 OK):**
```json
{
  "updated": true,
  "updated_at": "2026-02-18T18:33:36Z"
}
```

### 1.9 System Information Endpoints

#### 1.9.1 Get System Info

**Endpoint**: `GET /system/info`

**Response (200 OK):**
```json
{
  "app_version": "1.0.0",
  "api_version": "v1",
  "device_info": {
    "model": "X98 Android TV Box",
    "android_version": "9.0",
    "api_level": 28,
    "manufacturer": "Generic"
  },
  "storage": {
    "total": 8589934592,
    "available": 4294967296,
    "used": 4294967296,
    "cache_size": 1073741824
  },
  "network": {
    "ip_address": "192.168.1.100",
    "mac_address": "00:11:22:33:44:55",
    "connection_type": "wifi"
  },
  "capabilities": {
    "max_resolution": "4K",
    "hardware_decoding": ["h264", "h265", "vp9"],
    "hdmi_version": "2.0"
  }
}
```

#### 1.9.2 Get Cache Statistics

**Endpoint**: `GET /system/cache/stats`

**Response (200 OK):**
```json
{
  "total_size": 1073741824,
  "media_count": 150,
  "media_types": {
    "video": {
      "count": 50,
      "size": 858993459
    },
    "image": {
      "count": 80,
      "size": 107374182
    },
    "audio": {
      "count": 20,
      "size": 107374182
    }
  },
  "oldest_item": "2026-02-10T10:00:00Z",
  "newest_item": "2026-02-18T10:05:00Z",
  "last_cleanup": "2026-02-17T00:00:00Z"
}
```

#### 1.9.3 Clear Cache

**Endpoint**: `POST /system/cache/clear`

**Request:**
```json
{
  "media_types": ["video", "image"],
  "older_than_days": 30
}
```

**Response (200 OK):**
```json
{
  "cleared": true,
  "items_removed": 25,
  "space_freed": 268435456,
  "cleared_at": "2026-02-18T18:33:36Z"
}
```

## 2. mDNS/Bonjour Service Discovery

### 2.1 Service Announcement

**Service Type**: `_tvboxplayer._tcp.local`  
**Port**: 8080 (configurable)  
**Protocol**: TCP

**TXT Records:**
```
version=1.0.0
api_version=v1
device_name=Living Room TV Box
device_id=tvbox-uuid-123
model=X98
capabilities=video,audio,image,4k
max_devices=5
paired_count=2
```

### 2.2 Discovery Process

1. Mobile app broadcasts mDNS query for `_tvboxplayer._tcp.local`
2. TV Box responds with service announcement
3. Mobile app parses TXT records to get device info
4. Mobile app connects to `https://<ip>:<port>/api/v1/`

## 3. Data Structures

### 3.1 Database Schema (SQLite)

#### Table: devices

```sql
CREATE TABLE devices (
    device_id TEXT PRIMARY KEY,
    device_name TEXT NOT NULL,
    device_type TEXT NOT NULL,
    platform TEXT NOT NULL,
    app_version TEXT,
    paired_at DATETIME NOT NULL,
    last_seen DATETIME NOT NULL,
    is_primary BOOLEAN DEFAULT 0,
    permissions TEXT NOT NULL,
    refresh_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_devices_last_seen ON devices(last_seen);
CREATE INDEX idx_devices_is_primary ON devices(is_primary);
```

#### Table: media_items

```sql
CREATE TABLE media_items (
    media_id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    media_type TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    duration REAL,
    resolution TEXT,
    codec TEXT,
    bitrate INTEGER,
    framerate REAL,
    audio_codec TEXT,
    audio_channels INTEGER,
    thumbnail_path TEXT,
    cloud_provider TEXT NOT NULL,
    cloud_id TEXT NOT NULL,
    cloud_path TEXT,
    created_at DATETIME,
    modified_at DATETIME,
    synced_at DATETIME NOT NULL,
    cached BOOLEAN DEFAULT 0,
    cache_path TEXT,
    metadata_json TEXT,
    last_accessed DATETIME,
    access_count INTEGER DEFAULT 0,
    created_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_type ON media_items(media_type);
CREATE INDEX idx_media_cached ON media_items(cached);
CREATE INDEX idx_media_last_accessed ON media_items(last_accessed);
CREATE INDEX idx_media_cloud ON media_items(cloud_provider, cloud_id);
CREATE UNIQUE INDEX idx_media_cloud_unique ON media_items(cloud_provider, cloud_id);
```

#### Table: playlists

```sql
CREATE TABLE playlists (
    playlist_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    shuffle BOOLEAN DEFAULT 0,
    repeat BOOLEAN DEFAULT 0,
    is_smart BOOLEAN DEFAULT 0,
    smart_filter_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playlists_updated ON playlists(updated_at DESC);
```

#### Table: playlist_items

```sql
CREATE TABLE playlist_items (
    playlist_item_id TEXT PRIMARY KEY,
    playlist_id TEXT NOT NULL,
    media_id TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media_items(media_id) ON DELETE CASCADE
);

CREATE INDEX idx_playlist_items_playlist ON playlist_items(playlist_id, position);
CREATE UNIQUE INDEX idx_playlist_items_unique ON playlist_items(playlist_id, media_id);
```

#### Table: sync_jobs

```sql
CREATE TABLE sync_jobs (
    sync_job_id TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    status TEXT NOT NULL,
    folder_ids TEXT NOT NULL,
    total_files INTEGER,
    downloaded_files INTEGER DEFAULT 0,
    failed_files INTEGER DEFAULT 0,
    total_bytes INTEGER,
    downloaded_bytes INTEGER DEFAULT 0,
    started_at DATETIME,
    completed_at DATETIME,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sync_jobs_status ON sync_jobs(status);
CREATE INDEX idx_sync_jobs_created ON sync_jobs(created_at DESC);
```

#### Table: playback_history

```sql
CREATE TABLE playback_history (
    history_id TEXT PRIMARY KEY,
    media_id TEXT NOT NULL,
    playlist_id TEXT,
    device_id TEXT NOT NULL,
    started_at DATETIME NOT NULL,
    ended_at DATETIME,
    duration_watched REAL,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (media_id) REFERENCES media_items(media_id) ON DELETE CASCADE,
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE SET NULL,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

CREATE INDEX idx_history_media ON playback_history(media_id);
CREATE INDEX idx_history_device ON playback_history(device_id);
CREATE INDEX idx_history_started ON playback_history(started_at DESC);
```

### 3.2 Application Data Models

#### Device Model

```kotlin
data class Device(
    val deviceId: String,
    val deviceName: String,
    val deviceType: DeviceType,
    val platform: Platform,
    val appVersion: String?,
    val pairedAt: Instant,
    val lastSeen: Instant,
    val isPrimary: Boolean,
    val permissions: Set<Permission>,
    val refreshToken: String?
)

enum class DeviceType {
    MOBILE, TABLET, DESKTOP
}

enum class Platform {
    IOS, ANDROID, WEB
}

enum class Permission {
    READ, CONTROL, SYNC, ADMIN
}
```

#### Media Item Model

```kotlin
data class MediaItem(
    val mediaId: String,
    val filename: String,
    val mediaType: MediaType,
    val mimeType: String,
    val size: Long,
    val duration: Double?,
    val resolution: String?,
    val codec: String?,
    val bitrate: Int?,
    val framerate: Double?,
    val audioCodec: String?,
    val audioChannels: Int?,
    val thumbnailPath: String?,
    val cloudProvider: CloudProvider,
    val cloudId: String,
    val cloudPath: String?,
    val createdAt: Instant?,
    val modifiedAt: Instant?,
    val syncedAt: Instant,
    val cached: Boolean,
    val cachePath: String?,
    val metadata: MediaMetadata?,
    val lastAccessed: Instant?,
    val accessCount: Int
)

enum class MediaType {
    VIDEO, IMAGE, AUDIO
}

enum class CloudProvider {
    GOOGLE_DRIVE, DROPBOX, ONEDRIVE, S3, WEBDAV
}

data class MediaMetadata(
    val title: String?,
    val description: String?,
    val tags: List<String>,
    val customFields: Map<String, String>
)
```

#### Playlist Model

```kotlin
data class Playlist(
    val playlistId: String,
    val name: String,
    val description: String?,
    val items: List<PlaylistItem>,
    val shuffle: Boolean,
    val repeat: Boolean,
    val isSmart: Boolean,
    val smartFilter: SmartFilter?,
    val createdAt: Instant,
    val updatedAt: Instant
)

data class PlaylistItem(
    val playlistItemId: String,
    val mediaId: String,
    val position: Int
)

data class SmartFilter(
    val mediaType: MediaType?,
    val dateRange: DateRange?,
    val tags: List<String>,
    val minDuration: Double?,
    val maxDuration: Double?
)
```

#### Sync Job Model

```kotlin
data class SyncJob(
    val syncJobId: String,
    val provider: CloudProvider,
    val status: SyncStatus,
    val folderIds: List<String>,
    val progress: SyncProgress,
    val startedAt: Instant?,
    val completedAt: Instant?,
    val errorMessage: String?,
    val createdAt: Instant
)

enum class SyncStatus {
    PENDING, IN_PROGRESS, COMPLETED, FAILED, CANCELLED
}

data class SyncProgress(
    val totalFiles: Int,
    val downloadedFiles: Int,
    val failedFiles: Int,
    val totalBytes: Long,
    val downloadedBytes: Long,
    val currentFile: CurrentFileInfo?
) {
    val percentComplete: Int
        get() = if (totalFiles > 0) (downloadedFiles * 100 / totalFiles) else 0
}

data class CurrentFileInfo(
    val name: String,
    val size: Long,
    val downloaded: Long
)
```

#### Playback Session Model

```kotlin
data class PlaybackSession(
    val sessionId: String,
    val playlistId: String,
    val status: PlaybackStatus,
    val currentItem: PlaylistItem?,
    val playbackPosition: Double,
    val volume: Int,
    val playbackSpeed: Double,
    val shuffle: Boolean,
    val repeat: Boolean,
    val buffering: Boolean,
    val bufferPercent: Int,
    val startedAt: Instant
)

enum class PlaybackStatus {
    IDLE, LOADING, PLAYING, PAUSED, BUFFERING, ENDED
}
```

### 3.3 Cloud Provider API Integration

#### Google Drive API

**Authentication:**
```kotlin
interface GoogleDriveAuth {
    suspend fun authenticate(): AuthResult
    suspend fun refreshToken(refreshToken: String): AuthResult
    suspend fun revokeToken(token: String)
}

data class AuthResult(
    val accessToken: String,
    val refreshToken: String,
    val expiresIn: Int
)
```

**File Operations:**
```kotlin
interface GoogleDriveClient {
    suspend fun listFiles(
        folderId: String,
        pageToken: String? = null
    ): FileList
    
    suspend fun downloadFile(
        fileId: String,
        destination: File,
        progressCallback: (Long, Long) -> Unit
    ): Result<File>
    
    suspend fun getFileMetadata(fileId: String): FileMetadata
    
    suspend fun getDelta(
        startPageToken: String
    ): DeltaResponse
}

data class FileList(
    val files: List<FileMetadata>,
    val nextPageToken: String?
)

data class FileMetadata(
    val id: String,
    val name: String,
    val mimeType: String,
    val size: Long,
    val createdTime: Instant,
    val modifiedTime: Instant,
    val parents: List<String>
)

data class DeltaResponse(
    val changes: List<Change>,
    val newStartPageToken: String
)

data class Change(
    val fileId: String,
    val changeType: ChangeType,
    val file: FileMetadata?
)

enum class ChangeType {
    ADDED, MODIFIED, REMOVED
}
```

### 3.4 JWT Token Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "key-id-123"
  },
  "payload": {
    "iss": "tvboxplayer",
    "sub": "device-uuid-123",
    "aud": "tvboxplayer-api",
    "exp": 1708282416,
    "iat": 1708196016,
    "nbf": 1708196016,
    "jti": "token-uuid-456",
    "device_id": "device-uuid-123",
    "device_name": "John's iPhone",
    "permissions": ["read", "control", "sync"],
    "is_primary": true
  },
  "signature": "..."
}
```

### 3.5 WebSocket Events (Phase 2)

**Connection URL**: `wss://<tv-box-ip>:8080/api/v1/ws`

**Client -> Server Events:**

```json
{
  "type": "ping",
  "timestamp": "2026-02-18T18:33:36Z"
}
```

```json
{
  "type": "playback_control",
  "action": "pause",
  "timestamp": "2026-02-18T18:33:36Z"
}
```

**Server -> Client Events:**

```json
{
  "type": "pong",
  "timestamp": "2026-02-18T18:33:36Z"
}
```

```json
{
  "type": "playback_status_update",
  "data": {
    "status": "playing",
    "position": 45.5,
    "buffering": false
  },
  "timestamp": "2026-02-18T18:33:36Z"
}
```

```json
{
  "type": "sync_progress_update",
  "data": {
    "sync_job_id": "sync-job-uuid",
    "progress": {
      "downloaded_files": 75,
      "percent_complete": 50
    }
  },
  "timestamp": "2026-02-18T18:33:36Z"
}
```

## 4. Error Handling

### 4.1 Error Response Format

```json
{
  "error": {
    "code": "INVALID_PIN",
    "message": "The provided PIN code is invalid or has expired",
    "details": {
      "field": "pin_code",
      "reason": "expired"
    },
    "timestamp": "2026-02-18T18:33:36Z",
    "request_id": "req-uuid-123"
  }
}
```

### 4.2 Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Malformed request body |
| `INVALID_PIN` | 401 | Invalid or expired PIN |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `MAX_DEVICES_REACHED` | 403 | Maximum paired devices limit |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
| `STORAGE_FULL` | 507 | Insufficient storage space |

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-18  
**Status**: Technical Specification  
**Relates To**: PRODUCT_SPECIFICATION.md, ARCHITECTURE.md
