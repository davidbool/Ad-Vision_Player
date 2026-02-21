import { mdnsService } from '../../src/services/mdnsService';
import { Zeroconf } from 'react-native-zeroconf';

jest.mock('react-native-zeroconf');

describe('mDNS Service', () => {
  let mockZeroconf: any;

  beforeEach(() => {
    mockZeroconf = {
      scan: jest.fn(),
      stop: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
    };
    (Zeroconf as jest.Mock).mockImplementation(() => mockZeroconf);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('discoverDevices', () => {
    it('should start mDNS scan', async () => {
      const serviceType = '_tvboxplayer._tcp';

      await mdnsService.startDiscovery();

      expect(mockZeroconf.scan).toHaveBeenCalledWith(
        serviceType,
        'local.',
        expect.any(Number)
      );
    });

    it('should discover TV Box devices', (done) => {
      const mockDevice = {
        name: 'TV Box 1',
        host: 'tvbox1.local',
        addresses: ['192.168.1.100'],
        port: 8080,
        txt: {
          deviceId: 'device-123',
          model: 'Android TV',
          version: '1.0.0',
        },
      };

      mockZeroconf.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'resolved') {
          setTimeout(() => callback(mockDevice), 100);
        }
      });

      mdnsService.startDiscovery();
      mdnsService.onDeviceFound((device) => {
        expect(device).toEqual({
          id: 'device-123',
          name: 'TV Box 1',
          ipAddress: '192.168.1.100',
          port: 8080,
          model: 'Android TV',
          version: '1.0.0',
        });
        done();
      });
    });

    it('should handle multiple devices', (done) => {
      const devices = [
        {
          name: 'TV Box 1',
          addresses: ['192.168.1.100'],
          txt: { deviceId: 'device-1' },
        },
        {
          name: 'TV Box 2',
          addresses: ['192.168.1.101'],
          txt: { deviceId: 'device-2' },
        },
      ];

      let foundDevices: any[] = [];

      mockZeroconf.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'resolved') {
          devices.forEach((device, index) => {
            setTimeout(() => callback(device), (index + 1) * 100);
          });
        }
      });

      mdnsService.startDiscovery();
      mdnsService.onDeviceFound((device) => {
        foundDevices.push(device);
        if (foundDevices.length === 2) {
          expect(foundDevices).toHaveLength(2);
          expect(foundDevices[0].id).toBe('device-1');
          expect(foundDevices[1].id).toBe('device-2');
          done();
        }
      });
    });

    it('should filter out non-TV Box services', (done) => {
      const mockDevice = {
        name: 'Other Device',
        addresses: ['192.168.1.200'],
        txt: {}, // Missing deviceId
      };

      mockZeroconf.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'resolved') {
          setTimeout(() => callback(mockDevice), 100);
        }
      });

      let deviceFound = false;
      mdnsService.startDiscovery();
      mdnsService.onDeviceFound(() => {
        deviceFound = true;
      });

      setTimeout(() => {
        expect(deviceFound).toBe(false);
        done();
      }, 200);
    });
  });

  describe('stopDiscovery', () => {
    it('should stop mDNS scan', () => {
      mdnsService.stopDiscovery();

      expect(mockZeroconf.stop).toHaveBeenCalled();
    });

    it('should remove all listeners', () => {
      mdnsService.stopDiscovery();

      expect(mockZeroconf.removeListener).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle scan errors', (done) => {
      const error = new Error('Network error');

      mockZeroconf.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'error') {
          setTimeout(() => callback(error), 100);
        }
      });

      mdnsService.startDiscovery();
      mdnsService.onError((err) => {
        expect(err).toEqual(error);
        done();
      });
    });

    it('should handle timeout', (done) => {
      jest.useFakeTimers();

      mockZeroconf.on.mockImplementation((event: string, callback: Function) => {
        // No devices found
      });

      mdnsService.startDiscovery({ timeout: 5000 });

      jest.advanceTimersByTime(5000);

      mdnsService.onTimeout(() => {
        done();
      });

      jest.useRealTimers();
    });
  });

  describe('device updates', () => {
    it('should handle device removed event', (done) => {
      const removedDevice = {
        name: 'TV Box 1',
        txt: { deviceId: 'device-123' },
      };

      mockZeroconf.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'removed') {
          setTimeout(() => callback(removedDevice), 100);
        }
      });

      mdnsService.startDiscovery();
      mdnsService.onDeviceRemoved((deviceId) => {
        expect(deviceId).toBe('device-123');
        done();
      });
    });
  });

  describe('service info', () => {
    it('should publish service info', () => {
      const serviceInfo = {
        name: 'My TV Box',
        port: 8080,
        txt: {
          deviceId: 'device-456',
          model: 'Android TV',
        },
      };

      mdnsService.publishService(serviceInfo);

      // Verify service is published (implementation dependent)
    });
  });

  describe('configuration', () => {
    it('should allow custom service type', () => {
      const customType = '_customservice._tcp';

      mdnsService.startDiscovery({ serviceType: customType });

      expect(mockZeroconf.scan).toHaveBeenCalledWith(
        customType,
        expect.any(String),
        expect.any(Number)
      );
    });

    it('should allow custom scan timeout', () => {
      const timeout = 10000;

      mdnsService.startDiscovery({ timeout });

      expect(mockZeroconf.scan).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        timeout
      );
    });
  });
});
