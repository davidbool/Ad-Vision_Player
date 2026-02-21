import deviceReducer, { initialState } from '../../src/redux/reducers/deviceReducer';
import * as types from '../../src/redux/actions/types';

describe('Device Reducer', () => {
  it('should return initial state', () => {
    expect(deviceReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('DISCOVER_DEVICES_REQUEST', () => {
    it('should set discovering to true', () => {
      const action = { type: types.DISCOVER_DEVICES_REQUEST };
      const state = deviceReducer(initialState, action);

      expect(state.discovering).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('DISCOVER_DEVICES_SUCCESS', () => {
    it('should store discovered devices', () => {
      const devices = [
        { id: '1', name: 'TV Box 1', ipAddress: '192.168.1.100' },
        { id: '2', name: 'TV Box 2', ipAddress: '192.168.1.101' },
      ];
      const action = { type: types.DISCOVER_DEVICES_SUCCESS, payload: devices };
      const state = deviceReducer(initialState, action);

      expect(state.discovering).toBe(false);
      expect(state.availableDevices).toEqual(devices);
      expect(state.error).toBeNull();
    });
  });

  describe('DISCOVER_DEVICES_FAILURE', () => {
    it('should store error message', () => {
      const error = 'Network error';
      const action = { type: types.DISCOVER_DEVICES_FAILURE, payload: error };
      const state = deviceReducer(initialState, action);

      expect(state.discovering).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('SELECT_DEVICE', () => {
    it('should set selected device ID', () => {
      const deviceId = 'device-123';
      const action = { type: types.SELECT_DEVICE, payload: deviceId };
      const state = deviceReducer(initialState, action);

      expect(state.selectedDeviceId).toBe(deviceId);
    });
  });

  describe('PAIR_DEVICE_REQUEST', () => {
    it('should set pairing to true', () => {
      const action = {
        type: types.PAIR_DEVICE_REQUEST,
        payload: { deviceId: 'device-123', pin: '123456' },
      };
      const state = deviceReducer(initialState, action);

      expect(state.pairing).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('PAIR_DEVICE_SUCCESS', () => {
    it('should add paired device to list', () => {
      const device = {
        id: 'device-456',
        name: 'Paired TV Box',
        token: 'jwt-token-123',
      };
      const action = { type: types.PAIR_DEVICE_SUCCESS, payload: device };
      const state = deviceReducer(initialState, action);

      expect(state.pairing).toBe(false);
      expect(state.pairedDevices).toContainEqual(device);
      expect(state.error).toBeNull();
    });

    it('should not duplicate paired devices', () => {
      const device = {
        id: 'device-456',
        name: 'Paired TV Box',
        token: 'jwt-token-123',
      };
      
      let state = deviceReducer(initialState, {
        type: types.PAIR_DEVICE_SUCCESS,
        payload: device,
      });

      state = deviceReducer(state, {
        type: types.PAIR_DEVICE_SUCCESS,
        payload: device,
      });

      expect(state.pairedDevices.length).toBe(1);
    });
  });

  describe('PAIR_DEVICE_FAILURE', () => {
    it('should store error and set pairing to false', () => {
      const error = 'Invalid PIN';
      const action = { type: types.PAIR_DEVICE_FAILURE, payload: error };
      const state = deviceReducer(initialState, action);

      expect(state.pairing).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('UNPAIR_DEVICE_REQUEST', () => {
    it('should remove device from paired list', () => {
      const device = {
        id: 'device-789',
        name: 'TV Box',
        token: 'token',
      };
      
      let state = {
        ...initialState,
        pairedDevices: [device],
      };

      state = deviceReducer(state, {
        type: types.UNPAIR_DEVICE_REQUEST,
        payload: device.id,
      });

      expect(state.pairedDevices.length).toBe(0);
    });
  });

  describe('UPDATE_DEVICE_STATUS', () => {
    it('should update device status', () => {
      const device = {
        id: 'device-111',
        name: 'TV Box',
        status: 'offline',
      };

      let state = {
        ...initialState,
        pairedDevices: [device],
      };

      state = deviceReducer(state, {
        type: types.UPDATE_DEVICE_STATUS,
        payload: { deviceId: device.id, status: 'online' },
      });

      expect(state.pairedDevices[0].status).toBe('online');
    });
  });

  describe('state immutability', () => {
    it('should not mutate state', () => {
      const originalState = { ...initialState };
      const action = { type: types.DISCOVER_DEVICES_REQUEST };
      
      deviceReducer(originalState, action);

      expect(originalState).toEqual(initialState);
    });
  });
});
