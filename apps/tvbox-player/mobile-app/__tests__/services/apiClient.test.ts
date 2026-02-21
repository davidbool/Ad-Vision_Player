import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../src/services/apiClient';

const mock = new MockAdapter(axios);

describe('API Client', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('pairDevice', () => {
    it('should successfully pair device with valid PIN', async () => {
      const deviceId = 'device-123';
      const pin = '123456';
      const responseData = {
        id: deviceId,
        name: 'TV Box',
        token: 'jwt-token-abc',
      };

      mock.onPost(`/api/devices/${deviceId}/pair`).reply(200, responseData);

      const result = await apiClient.pairDevice(deviceId, pin);

      expect(result).toEqual(responseData);
    });

    it('should throw error for invalid PIN', async () => {
      const deviceId = 'device-123';
      const pin = 'wrong-pin';

      mock.onPost(`/api/devices/${deviceId}/pair`).reply(400, {
        error: 'Invalid PIN',
      });

      await expect(apiClient.pairDevice(deviceId, pin)).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      const deviceId = 'device-123';
      const pin = '123456';

      mock.onPost(`/api/devices/${deviceId}/pair`).networkError();

      await expect(apiClient.pairDevice(deviceId, pin)).rejects.toThrow();
    });
  });

  describe('unpairDevice', () => {
    it('should successfully unpair device', async () => {
      const deviceId = 'device-456';

      mock.onDelete(`/api/devices/${deviceId}/pair`).reply(200, {
        success: true,
      });

      const result = await apiClient.unpairDevice(deviceId);

      expect(result.success).toBe(true);
    });

    it('should handle unpair errors', async () => {
      const deviceId = 'device-456';

      mock.onDelete(`/api/devices/${deviceId}/pair`).reply(404, {
        error: 'Device not found',
      });

      await expect(apiClient.unpairDevice(deviceId)).rejects.toThrow();
    });
  });

  describe('getMediaLibrary', () => {
    it('should fetch media library', async () => {
      const deviceId = 'device-789';
      const mediaItems = [
        { id: '1', title: 'Video 1', type: 'video' },
        { id: '2', title: 'Video 2', type: 'video' },
      ];

      mock.onGet(`/api/devices/${deviceId}/media`).reply(200, mediaItems);

      const result = await apiClient.getMediaLibrary(deviceId);

      expect(result).toEqual(mediaItems);
    });

    it('should handle empty library', async () => {
      const deviceId = 'device-789';

      mock.onGet(`/api/devices/${deviceId}/media`).reply(200, []);

      const result = await apiClient.getMediaLibrary(deviceId);

      expect(result).toEqual([]);
    });
  });

  describe('sendPlaybackCommand', () => {
    it('should send play command', async () => {
      const deviceId = 'device-111';
      const command = { action: 'play', mediaId: 'media-123' };

      mock.onPost(`/api/devices/${deviceId}/playback`).reply(200, {
        success: true,
      });

      const result = await apiClient.sendPlaybackCommand(deviceId, command);

      expect(result.success).toBe(true);
    });

    it('should send pause command', async () => {
      const deviceId = 'device-111';
      const command = { action: 'pause' };

      mock.onPost(`/api/devices/${deviceId}/playback`).reply(200, {
        success: true,
      });

      const result = await apiClient.sendPlaybackCommand(deviceId, command);

      expect(result.success).toBe(true);
    });

    it('should send seek command', async () => {
      const deviceId = 'device-111';
      const command = { action: 'seek', position: 30000 };

      mock.onPost(`/api/devices/${deviceId}/playback`).reply(200, {
        success: true,
      });

      const result = await apiClient.sendPlaybackCommand(deviceId, command);

      expect(result.success).toBe(true);
    });

    it('should handle playback command errors', async () => {
      const deviceId = 'device-111';
      const command = { action: 'play' };

      mock.onPost(`/api/devices/${deviceId}/playback`).reply(500, {
        error: 'Playback error',
      });

      await expect(
        apiClient.sendPlaybackCommand(deviceId, command)
      ).rejects.toThrow();
    });
  });

  describe('getPlaybackStatus', () => {
    it('should fetch current playback status', async () => {
      const deviceId = 'device-222';
      const status = {
        state: 'playing',
        position: 15000,
        duration: 120000,
        mediaId: 'media-456',
      };

      mock.onGet(`/api/devices/${deviceId}/playback/status`).reply(200, status);

      const result = await apiClient.getPlaybackStatus(deviceId);

      expect(result).toEqual(status);
    });
  });

  describe('createPlaylist', () => {
    it('should create new playlist', async () => {
      const deviceId = 'device-333';
      const playlist = {
        name: 'My Playlist',
        items: ['media-1', 'media-2', 'media-3'],
      };

      const responseData = {
        id: 'playlist-123',
        ...playlist,
      };

      mock.onPost(`/api/devices/${deviceId}/playlists`).reply(201, responseData);

      const result = await apiClient.createPlaylist(deviceId, playlist);

      expect(result).toEqual(responseData);
    });
  });

  describe('updatePlaylist', () => {
    it('should update existing playlist', async () => {
      const deviceId = 'device-333';
      const playlistId = 'playlist-123';
      const updates = {
        name: 'Updated Playlist',
      };

      mock
        .onPut(`/api/devices/${deviceId}/playlists/${playlistId}`)
        .reply(200, { id: playlistId, ...updates });

      const result = await apiClient.updatePlaylist(deviceId, playlistId, updates);

      expect(result.name).toBe(updates.name);
    });
  });

  describe('deletePlaylist', () => {
    it('should delete playlist', async () => {
      const deviceId = 'device-333';
      const playlistId = 'playlist-456';

      mock
        .onDelete(`/api/devices/${deviceId}/playlists/${playlistId}`)
        .reply(200, { success: true });

      const result = await apiClient.deletePlaylist(deviceId, playlistId);

      expect(result.success).toBe(true);
    });
  });

  describe('authentication', () => {
    it('should include auth token in requests', async () => {
      const deviceId = 'device-444';
      const token = 'jwt-token-xyz';

      apiClient.setAuthToken(token);

      mock.onGet(`/api/devices/${deviceId}/media`).reply((config) => {
        expect(config.headers?.Authorization).toBe(`Bearer ${token}`);
        return [200, []];
      });

      await apiClient.getMediaLibrary(deviceId);
    });

    it('should refresh token on 401 response', async () => {
      const deviceId = 'device-444';
      const oldToken = 'old-token';
      const newToken = 'new-token';

      apiClient.setAuthToken(oldToken);

      mock
        .onGet(`/api/devices/${deviceId}/media`)
        .replyOnce(401)
        .onPost('/api/auth/refresh')
        .reply(200, { token: newToken })
        .onGet(`/api/devices/${deviceId}/media`)
        .reply(200, []);

      await apiClient.getMediaLibrary(deviceId);

      expect(apiClient.getAuthToken()).toBe(newToken);
    });
  });

  describe('error handling', () => {
    it('should handle timeout errors', async () => {
      const deviceId = 'device-555';

      mock.onGet(`/api/devices/${deviceId}/media`).timeout();

      await expect(apiClient.getMediaLibrary(deviceId)).rejects.toThrow();
    });

    it('should handle server errors', async () => {
      const deviceId = 'device-555';

      mock.onGet(`/api/devices/${deviceId}/media`).reply(500, {
        error: 'Internal server error',
      });

      await expect(apiClient.getMediaLibrary(deviceId)).rejects.toThrow();
    });
  });
});
