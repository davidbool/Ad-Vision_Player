export interface Device {
  deviceId: string;
  deviceName: string;
  deviceType: 'mobile' | 'tablet';
  platform: 'ios' | 'android';
  appVersion?: string;
  pairedAt: string;
  lastSeen: string;
  isPrimary: boolean;
  permissions: string[];
  ipAddress?: string;
  port?: number;
}

export interface MediaItem {
  mediaId: string;
  filename: string;
  mediaType: 'video' | 'image' | 'audio';
  mimeType: string;
  size: number;
  duration?: number;
  resolution?: string;
  codec?: string;
  thumbnailUrl?: string;
  cloudProvider: string;
  cloudId: string;
  createdAt?: string;
  syncedAt: string;
  cached: boolean;
  metadata?: {
    title?: string;
    description?: string;
    tags?: string[];
  };
}

export interface Playlist {
  playlistId: string;
  name: string;
  description?: string;
  itemCount: number;
  totalDuration?: number;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  shuffle: boolean;
  repeat: boolean;
  items?: PlaylistItem[];
}

export interface PlaylistItem {
  position: number;
  mediaId: string;
  filename: string;
  mediaType: string;
  duration?: number;
  thumbnailUrl?: string;
}

export interface SyncJob {
  syncJobId: string;
  provider: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  progress: {
    totalFiles: number;
    downloadedFiles: number;
    failedFiles: number;
    totalBytes: number;
    downloadedBytes: number;
    percentComplete: number;
  };
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  currentFile?: {
    name: string;
    size: number;
    downloaded: number;
  };
}

export interface PlaybackStatus {
  playbackSessionId?: string;
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'ended';
  playlistId?: string;
  currentItem?: {
    mediaId: string;
    filename: string;
    position: number;
    duration?: number;
  };
  playbackPosition: number;
  volume: number;
  playbackSpeed: number;
  shuffle: boolean;
  repeat: boolean;
  buffering: boolean;
  bufferPercent: number;
}

export interface Settings {
  cache: {
    maxSize: number;
    currentSize: number;
    autoCleanup: boolean;
    cleanupThreshold: number;
  };
  playback: {
    defaultQuality: string;
    hardwareAcceleration: boolean;
    autoPlayNext: boolean;
  };
  display: {
    resolution: string;
    aspectRatio: string;
    screenSaverEnabled: boolean;
    screenSaverTimeout: number;
  };
  network: {
    mdnsEnabled: boolean;
    apiPort: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  requestId?: string;
}

export interface PairingRequest {
  deviceName: string;
  deviceType: string;
  platform: string;
  appVersion: string;
}

export interface PairingResponse {
  sessionId: string;
  expiresAt: string;
  pinDisplayDuration: number;
}

export interface PairingSubmit {
  sessionId: string;
  pinCode: string;
  deviceName: string;
  deviceId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  deviceId: string;
  permissions: string[];
}

export interface SystemInfo {
  appVersion: string;
  apiVersion: string;
  deviceInfo: {
    model: string;
    androidVersion: string;
    manufacturer: string;
  };
  storage: {
    total: number;
    available: number;
    used: number;
    cacheSize: number;
  };
  network: {
    ipAddress: string;
    connectionType: string;
  };
}
