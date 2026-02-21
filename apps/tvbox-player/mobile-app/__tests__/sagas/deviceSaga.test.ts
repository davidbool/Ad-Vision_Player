import { runSaga } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import * as sagas from '../../src/sagas/deviceSaga';
import * as actions from '../../src/redux/actions/deviceActions';
import * as types from '../../src/redux/actions/types';
import { mdnsService } from '../../src/services/mdnsService';
import { apiClient } from '../../src/services/apiClient';

jest.mock('../../src/services/mdnsService');
jest.mock('../../src/services/apiClient');

describe('Device Saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('discoverDevicesSaga', () => {
    it('should discover devices successfully', async () => {
      const devices = [
        { id: '1', name: 'TV Box 1', ipAddress: '192.168.1.100' },
        { id: '2', name: 'TV Box 2', ipAddress: '192.168.1.101' },
      ];

      const dispatched: any[] = [];
      const saga = runSaga(
        {
          dispatch: (action: any) => dispatched.push(action),
          getState: () => ({}),
        },
        sagas.discoverDevicesSaga
      );

      (mdnsService.discoverDevices as jest.Mock).mockResolvedValue(devices);

      await saga.toPromise();

      expect(mdnsService.discoverDevices).toHaveBeenCalled();
      expect(dispatched).toContainEqual(
        actions.discoverDevicesSuccess(devices)
      );
    });

    it('should handle discovery failure', async () => {
      const error = new Error('Discovery failed');
      const dispatched: any[] = [];
      
      const saga = runSaga(
        {
          dispatch: (action: any) => dispatched.push(action),
          getState: () => ({}),
        },
        sagas.discoverDevicesSaga
      );

      (mdnsService.discoverDevices as jest.Mock).mockRejectedValue(error);

      await saga.toPromise();

      expect(dispatched).toContainEqual(
        actions.discoverDevicesFailure(error.message)
      );
    });
  });

  describe('pairDeviceSaga', () => {
    it('should pair device successfully', async () => {
      const pairAction = {
        type: types.PAIR_DEVICE_REQUEST,
        payload: { deviceId: 'device-123', pin: '123456' },
      };

      const pairedDevice = {
        id: 'device-123',
        name: 'TV Box',
        token: 'jwt-token-abc',
      };

      const dispatched: any[] = [];
      const saga = runSaga(
        {
          dispatch: (action: any) => dispatched.push(action),
          getState: () => ({}),
        },
        sagas.pairDeviceSaga,
        pairAction
      );

      (apiClient.pairDevice as jest.Mock).mockResolvedValue(pairedDevice);

      await saga.toPromise();

      expect(apiClient.pairDevice).toHaveBeenCalledWith(
        pairAction.payload.deviceId,
        pairAction.payload.pin
      );
      expect(dispatched).toContainEqual(
        actions.pairDeviceSuccess(pairedDevice)
      );
    });

    it('should handle pairing failure with invalid PIN', async () => {
      const pairAction = {
        type: types.PAIR_DEVICE_REQUEST,
        payload: { deviceId: 'device-123', pin: 'wrong-pin' },
      };

      const error = new Error('Invalid PIN');
      const dispatched: any[] = [];
      
      const saga = runSaga(
        {
          dispatch: (action: any) => dispatched.push(action),
          getState: () => ({}),
        },
        sagas.pairDeviceSaga,
        pairAction
      );

      (apiClient.pairDevice as jest.Mock).mockRejectedValue(error);

      await saga.toPromise();

      expect(dispatched).toContainEqual(
        actions.pairDeviceFailure(error.message)
      );
    });

    it('should handle network errors during pairing', async () => {
      const pairAction = {
        type: types.PAIR_DEVICE_REQUEST,
        payload: { deviceId: 'device-123', pin: '123456' },
      };

      const error = new Error('Network error');
      const dispatched: any[] = [];
      
      const saga = runSaga(
        {
          dispatch: (action: any) => dispatched.push(action),
          getState: () => ({}),
        },
        sagas.pairDeviceSaga,
        pairAction
      );

      (apiClient.pairDevice as jest.Mock).mockRejectedValue(error);

      await saga.toPromise();

      expect(dispatched).toContainEqual(
        actions.pairDeviceFailure(error.message)
      );
    });
  });

  describe('unpairDeviceSaga', () => {
    it('should unpair device successfully', async () => {
      const unpairAction = {
        type: types.UNPAIR_DEVICE_REQUEST,
        payload: 'device-456',
      };

      const dispatched: any[] = [];
      const saga = runSaga(
        {
          dispatch: (action: any) => dispatched.push(action),
          getState: () => ({}),
        },
        sagas.unpairDeviceSaga,
        unpairAction
      );

      (apiClient.unpairDevice as jest.Mock).mockResolvedValue({ success: true });

      await saga.toPromise();

      expect(apiClient.unpairDevice).toHaveBeenCalledWith(unpairAction.payload);
      expect(dispatched).toContainEqual({
        type: types.UNPAIR_DEVICE_SUCCESS,
        payload: unpairAction.payload,
      });
    });

    it('should handle unpair failure', async () => {
      const unpairAction = {
        type: types.UNPAIR_DEVICE_REQUEST,
        payload: 'device-456',
      };

      const error = new Error('Unpair failed');
      const dispatched: any[] = [];
      
      const saga = runSaga(
        {
          dispatch: (action: any) => dispatched.push(action),
          getState: () => ({}),
        },
        sagas.unpairDeviceSaga,
        unpairAction
      );

      (apiClient.unpairDevice as jest.Mock).mockRejectedValue(error);

      await saga.toPromise();

      expect(dispatched).toContainEqual({
        type: types.UNPAIR_DEVICE_FAILURE,
        payload: error.message,
      });
    });
  });

  describe('device status monitoring', () => {
    it('should update device status periodically', async () => {
      const devices = [
        { id: 'device-1', status: 'online' },
        { id: 'device-2', status: 'offline' },
      ];

      const dispatched: any[] = [];
      const saga = runSaga(
        {
          dispatch: (action: any) => dispatched.push(action),
          getState: () => ({ device: { pairedDevices: devices } }),
        },
        sagas.monitorDeviceStatusSaga
      );

      (apiClient.checkDeviceStatus as jest.Mock).mockResolvedValue({
        id: 'device-1',
        status: 'offline',
      });

      await new Promise(resolve => setTimeout(resolve, 100));
      saga.cancel();

      expect(apiClient.checkDeviceStatus).toHaveBeenCalled();
    });
  });
});
