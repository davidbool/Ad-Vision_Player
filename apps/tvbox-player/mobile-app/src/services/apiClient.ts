import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_VERSION, API_TIMEOUT } from '../constants';
import { AuthTokens } from '../utils/types';
import * as Keychain from 'react-native-keychain';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string = '';
  private tokens: AuthTokens | null = null;

  constructor() {
    this.client = axios.create({
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setBaseURL(ipAddress: string, port: number) {
    this.baseURL = `https://${ipAddress}:${port}/api/${API_VERSION}`;
    this.client.defaults.baseURL = this.baseURL;
  }

  async setTokens(tokens: AuthTokens) {
    this.tokens = tokens;
    await Keychain.setGenericPassword('tokens', JSON.stringify(tokens));
  }

  async getTokens(): Promise<AuthTokens | null> {
    if (this.tokens) {
      return this.tokens;
    }
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        this.tokens = JSON.parse(credentials.password);
        return this.tokens;
      }
    } catch (error) {
      console.error('Failed to get tokens from keychain:', error);
    }
    return null;
  }

  async clearTokens() {
    this.tokens = null;
    await Keychain.resetGenericPassword();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async config => {
        const tokens = await this.getTokens();
        if (tokens) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401 && this.tokens?.refreshToken) {
          try {
            const newTokens = await this.refreshToken(this.tokens.refreshToken);
            await this.setTokens(newTokens);
            error.config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return this.client.request(error.config);
          } catch (refreshError) {
            await this.clearTokens();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async requestPairing(deviceName: string, deviceType: string, platform: string, appVersion: string) {
    const response = await this.client.post('/pairing/request', {
      device_name: deviceName,
      device_type: deviceType,
      platform,
      app_version: appVersion,
    });
    return response.data;
  }

  async submitPairing(sessionId: string, pinCode: string, deviceName: string, deviceId: string) {
    const response = await this.client.post('/pairing/submit', {
      session_id: sessionId,
      pin_code: pinCode,
      device_name: deviceName,
      device_id: deviceId,
    });
    return response.data;
  }

  async refreshToken(refreshToken: string) {
    const response = await this.client.post('/auth/refresh', {
      refresh_token: refreshToken,
      device_id: this.tokens?.deviceId,
    });
    return response.data;
  }

  async unpairDevice(deviceId: string) {
    await this.client.delete(`/auth/devices/${deviceId}`);
  }

  async getDevices() {
    const response = await this.client.get('/devices');
    return response.data;
  }

  async updateDevice(deviceId: string, updates: any) {
    const response = await this.client.patch(`/devices/${deviceId}`, updates);
    return response.data;
  }

  async startSync(provider: string, folders: any[], options?: any) {
    const response = await this.client.post('/sync/start', {
      provider,
      folders,
      sync_options: options,
    });
    return response.data;
  }

  async getSyncStatus(jobId: string) {
    const response = await this.client.get(`/sync/jobs/${jobId}`);
    return response.data;
  }

  async cancelSync(jobId: string) {
    const response = await this.client.post(`/sync/jobs/${jobId}/cancel`);
    return response.data;
  }

  async listSyncJobs(status?: string, limit = 20, offset = 0) {
    const response = await this.client.get('/sync/jobs', {
      params: { status, limit, offset },
    });
    return response.data;
  }

  async getMedia(params?: any) {
    const response = await this.client.get('/media', { params });
    return response.data;
  }

  async getMediaItem(mediaId: string) {
    const response = await this.client.get(`/media/${mediaId}`);
    return response.data;
  }

  async deleteMedia(mediaId: string, deleteFromCloud = false) {
    await this.client.delete(`/media/${mediaId}`, {
      params: { delete_from_cloud: deleteFromCloud },
    });
  }

  async getPlaylists() {
    const response = await this.client.get('/playlists');
    return response.data;
  }

  async getPlaylist(playlistId: string) {
    const response = await this.client.get(`/playlists/${playlistId}`);
    return response.data;
  }

  async createPlaylist(name: string, description?: string, mediaIds?: string[]) {
    const response = await this.client.post('/playlists', {
      name,
      description,
      media_ids: mediaIds,
    });
    return response.data;
  }

  async updatePlaylist(playlistId: string, updates: any) {
    const response = await this.client.patch(`/playlists/${playlistId}`, updates);
    return response.data;
  }

  async deletePlaylist(playlistId: string) {
    await this.client.delete(`/playlists/${playlistId}`);
  }

  async addItemsToPlaylist(playlistId: string, mediaIds: string[], position?: number) {
    const response = await this.client.post(`/playlists/${playlistId}/items`, {
      media_ids: mediaIds,
      position,
    });
    return response.data;
  }

  async removeItemsFromPlaylist(playlistId: string, mediaIds: string[]) {
    const response = await this.client.delete(`/playlists/${playlistId}/items`, {
      data: { media_ids: mediaIds },
    });
    return response.data;
  }

  async reorderPlaylistItems(playlistId: string, mediaIds: string[]) {
    const response = await this.client.put(`/playlists/${playlistId}/items/reorder`, {
      media_ids: mediaIds,
    });
    return response.data;
  }

  async startPlayback(playlistId: string, startPosition = 0) {
    const response = await this.client.post('/playback/start', {
      playlist_id: playlistId,
      start_position: startPosition,
      autoplay: true,
    });
    return response.data;
  }

  async getPlaybackStatus() {
    const response = await this.client.get('/playback/status');
    return response.data;
  }

  async controlPlayback(action: string, params?: any) {
    const response = await this.client.post('/playback/control', {
      action,
      ...params,
    });
    return response.data;
  }

  async stopPlayback() {
    const response = await this.client.post('/playback/stop');
    return response.data;
  }

  async getSettings() {
    const response = await this.client.get('/settings');
    return response.data;
  }

  async updateSettings(updates: any) {
    const response = await this.client.patch('/settings', updates);
    return response.data;
  }

  async getSystemInfo() {
    const response = await this.client.get('/system/info');
    return response.data;
  }

  async getCacheStats() {
    const response = await this.client.get('/system/cache/stats');
    return response.data;
  }

  async clearCache(mediaTypes?: string[], olderThanDays?: number) {
    const response = await this.client.post('/system/cache/clear', {
      media_types: mediaTypes,
      older_than_days: olderThanDays,
    });
    return response.data;
  }
}

export default new ApiClient();
