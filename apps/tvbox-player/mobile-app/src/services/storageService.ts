import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device } from '../utils/types';

const STORAGE_KEYS = {
  PAIRED_DEVICES: '@paired_devices',
  SELECTED_DEVICE: '@selected_device',
  USER_PREFERENCES: '@user_preferences',
};

export interface UserPreferences {
  theme?: 'light' | 'dark';
  notifications?: boolean;
  [key: string]: unknown;
}

class StorageService {
  async savePairedDevices(devices: Device[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PAIRED_DEVICES, JSON.stringify(devices));
    } catch (error) {
      console.error('Failed to save paired devices:', error);
    }
  }

  async getPairedDevices(): Promise<Device[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PAIRED_DEVICES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get paired devices:', error);
      return [];
    }
  }

  async saveSelectedDevice(device: Device) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_DEVICE, JSON.stringify(device));
    } catch (error) {
      console.error('Failed to save selected device:', error);
    }
  }

  async getSelectedDevice(): Promise<Device | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_DEVICE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get selected device:', error);
      return null;
    }
  }

  async saveUserPreferences(preferences: UserPreferences) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  async getUserPreferences(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return {};
    }
  }

  async clear() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export default new StorageService();
