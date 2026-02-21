import Zeroconf from 'react-native-zeroconf';
import { MDNS_SERVICE_TYPE, DEFAULT_API_PORT } from '../constants';
import { Device } from '../utils/types';

class MdnsService {
  private zeroconf: Zeroconf;
  private discoveredServices: Map<string, any>;
  private onDevicesFoundCallback: ((devices: Device[]) => void) | null;

  constructor() {
    this.zeroconf = new Zeroconf();
    this.discoveredServices = new Map();
    this.onDevicesFoundCallback = null;
    this.setupListeners();
  }

  private setupListeners() {
    this.zeroconf.on('resolved', (service: any) => {
      console.log('mDNS service resolved:', service);
      
      const device: Device = {
        deviceId: service.txt?.device_id || service.name,
        deviceName: service.txt?.device_name || service.name,
        deviceType: 'mobile',
        platform: 'android',
        isPrimary: false,
        permissions: [],
        pairedAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        ipAddress: service.addresses?.[0] || service.host,
        port: service.port || DEFAULT_API_PORT,
      };

      this.discoveredServices.set(service.name, device);
      this.notifyDevicesFound();
    });

    this.zeroconf.on('remove', (service: any) => {
      console.log('mDNS service removed:', service);
      this.discoveredServices.delete(service.name);
      this.notifyDevicesFound();
    });

    this.zeroconf.on('error', (error: any) => {
      console.error('mDNS error:', error);
    });
  }

  startDiscovery(onDevicesFound: (devices: Device[]) => void) {
    this.onDevicesFoundCallback = onDevicesFound;
    this.discoveredServices.clear();
    
    console.log('Starting mDNS discovery for:', MDNS_SERVICE_TYPE);
    this.zeroconf.scan(MDNS_SERVICE_TYPE, 'local.');
  }

  stopDiscovery() {
    console.log('Stopping mDNS discovery');
    this.zeroconf.stop();
    this.onDevicesFoundCallback = null;
  }

  private notifyDevicesFound() {
    if (this.onDevicesFoundCallback) {
      const devices = Array.from(this.discoveredServices.values());
      this.onDevicesFoundCallback(devices);
    }
  }

  getDiscoveredDevices(): Device[] {
    return Array.from(this.discoveredServices.values());
  }
}

export default new MdnsService();
