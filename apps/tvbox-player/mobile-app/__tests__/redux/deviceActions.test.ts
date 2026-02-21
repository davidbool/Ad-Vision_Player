import * as actions from '../../src/redux/actions/deviceActions';
import * as types from '../../src/redux/actions/types';

describe('Device Actions', () => {
  describe('discoverDevices', () => {
    it('should create action to start device discovery', () => {
      const expectedAction = {
        type: types.DISCOVER_DEVICES_REQUEST,
      };
      expect(actions.discoverDevices()).toEqual(expectedAction);
    });
  });

  describe('discoverDevicesSuccess', () => {
    it('should create action for successful device discovery', () => {
      const devices = [
        { id: '1', name: 'TV Box 1', ipAddress: '192.168.1.100' },
        { id: '2', name: 'TV Box 2', ipAddress: '192.168.1.101' },
      ];
      const expectedAction = {
        type: types.DISCOVER_DEVICES_SUCCESS,
        payload: devices,
      };
      expect(actions.discoverDevicesSuccess(devices)).toEqual(expectedAction);
    });
  });

  describe('discoverDevicesFailure', () => {
    it('should create action for failed device discovery', () => {
      const error = 'Network error';
      const expectedAction = {
        type: types.DISCOVER_DEVICES_FAILURE,
        payload: error,
      };
      expect(actions.discoverDevicesFailure(error)).toEqual(expectedAction);
    });
  });

  describe('selectDevice', () => {
    it('should create action to select a device', () => {
      const deviceId = 'device-123';
      const expectedAction = {
        type: types.SELECT_DEVICE,
        payload: deviceId,
      };
      expect(actions.selectDevice(deviceId)).toEqual(expectedAction);
    });
  });

  describe('pairDevice', () => {
    it('should create action to initiate device pairing', () => {
      const deviceId = 'device-456';
      const pin = '123456';
      const expectedAction = {
        type: types.PAIR_DEVICE_REQUEST,
        payload: { deviceId, pin },
      };
      expect(actions.pairDevice(deviceId, pin)).toEqual(expectedAction);
    });
  });

  describe('pairDeviceSuccess', () => {
    it('should create action for successful pairing', () => {
      const device = {
        id: 'device-789',
        name: 'Paired TV Box',
        token: 'jwt-token-123',
      };
      const expectedAction = {
        type: types.PAIR_DEVICE_SUCCESS,
        payload: device,
      };
      expect(actions.pairDeviceSuccess(device)).toEqual(expectedAction);
    });
  });

  describe('pairDeviceFailure', () => {
    it('should create action for failed pairing', () => {
      const error = 'Invalid PIN';
      const expectedAction = {
        type: types.PAIR_DEVICE_FAILURE,
        payload: error,
      };
      expect(actions.pairDeviceFailure(error)).toEqual(expectedAction);
    });
  });

  describe('unpairDevice', () => {
    it('should create action to unpair a device', () => {
      const deviceId = 'device-999';
      const expectedAction = {
        type: types.UNPAIR_DEVICE_REQUEST,
        payload: deviceId,
      };
      expect(actions.unpairDevice(deviceId)).toEqual(expectedAction);
    });
  });

  describe('updateDeviceStatus', () => {
    it('should create action to update device status', () => {
      const deviceId = 'device-111';
      const status = 'online';
      const expectedAction = {
        type: types.UPDATE_DEVICE_STATUS,
        payload: { deviceId, status },
      };
      expect(actions.updateDeviceStatus(deviceId, status)).toEqual(expectedAction);
    });
  });
});
