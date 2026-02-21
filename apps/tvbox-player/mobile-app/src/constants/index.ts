export const API_VERSION = 'v1';
export const API_TIMEOUT = 30000;
export const MDNS_SERVICE_TYPE = '_tvboxplayer._tcp.local';
export const DEFAULT_API_PORT = 8080;

export const TOKEN_EXPIRY_BUFFER = 300; // 5 minutes before actual expiry

export const MAX_PAIRED_DEVICES = 5;
export const PIN_CODE_LENGTH = 6;
export const PIN_DISPLAY_DURATION = 300; // 5 minutes

export const CACHE_SIZE_DEFAULT = 2147483648; // 2GB - Default cache size

export const PLAYBACK_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
export const VOLUME_STEP = 5;

export const MEDIA_TYPES = {
  VIDEO: 'video',
  IMAGE: 'image',
  AUDIO: 'audio',
} as const;

export const CLOUD_PROVIDERS = {
  GOOGLE_DRIVE: 'google_drive',
} as const;

export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
} as const;

export const PLATFORMS = {
  IOS: 'ios',
  ANDROID: 'android',
} as const;

export const PERMISSIONS = {
  READ: 'read',
  CONTROL: 'control',
  SYNC: 'sync',
  ADMIN: 'admin',
} as const;

export const PLAYBACK_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  BUFFERING: 'buffering',
  ENDED: 'ended',
} as const;

export const SYNC_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export const SORT_OPTIONS = {
  DATE: 'date',
  NAME: 'name',
  SIZE: 'size',
  DURATION: 'duration',
} as const;

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const RESOLUTION_OPTIONS = ['auto', '720p', '1080p', '4K'];
export const ASPECT_RATIOS = ['16:9', '4:3', 'fill', 'fit'];
