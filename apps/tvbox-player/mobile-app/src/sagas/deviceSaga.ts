import { call, put, takeLatest } from 'redux-saga/effects';
import { DEVICE_ACTIONS } from '../redux/actions/types';
import {
  discoverDevicesSuccess,
  discoverDevicesFailure,
  pairDeviceSuccess,
  pairDeviceFailure,
  unpairDeviceSuccess,
} from '../redux/actions';
import { mdnsService, apiClient, storageService } from '../services';
import { Device } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';
import { Platform } from 'react-native';

function* discoverDevicesSaga(): Generator<any, void, any> {
  try {
    yield new Promise<Device[]>((resolve, reject) => {
      try {
        mdnsService.startDiscovery(devices => {
          resolve(devices);
        });
        setTimeout(() => {
          mdnsService.stopDiscovery();
          const devices = mdnsService.getDiscoveredDevices();
          resolve(devices);
        }, 10000);
      } catch (error) {
        reject(error);
      }
    });

    const devices = mdnsService.getDiscoveredDevices();
    yield put(discoverDevicesSuccess(devices));
  } catch (error: any) {
    yield put(discoverDevicesFailure(error.message));
  }
}

function* pairDeviceSaga(action: any): Generator<any, void, any> {
  try {
    const { sessionId, pinCode, deviceName } = action.payload;
    const deviceId = uuidv4();
    
    const response = yield call(
      [apiClient, 'submitPairing'],
      sessionId,
      pinCode,
      deviceName,
      deviceId
    );

    const device: Device = {
      deviceId: response.device_id,
      deviceName,
      deviceType: 'mobile',
      platform: Platform.OS as 'ios' | 'android',
      pairedAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      isPrimary: true,
      permissions: response.permissions,
    };

    yield call([apiClient, 'setTokens'], response);
    yield call([storageService, 'savePairedDevices'], [device]);
    yield call([storageService, 'saveSelectedDevice'], device);

    yield put(pairDeviceSuccess(device, response));
  } catch (error: any) {
    yield put(pairDeviceFailure(error.response?.data?.error?.message || error.message));
  }
}

function* unpairDeviceSaga(action: any): Generator<any, void, any> {
  try {
    const deviceId = action.payload;
    
    yield call([apiClient, 'unpairDevice'], deviceId);
    yield call([apiClient, 'clearTokens']);
    
    const devices: Device[] = yield call([storageService, 'getPairedDevices']);
    const updatedDevices = devices.filter(d => d.deviceId !== deviceId);
    yield call([storageService, 'savePairedDevices'], updatedDevices);

    yield put(unpairDeviceSuccess(deviceId));
  } catch (error: any) {
    console.error('Unpair device error:', error);
  }
}

export default function* deviceSaga() {
  yield takeLatest(DEVICE_ACTIONS.DISCOVER_DEVICES_REQUEST, discoverDevicesSaga);
  yield takeLatest(DEVICE_ACTIONS.PAIR_DEVICE_REQUEST, pairDeviceSaga);
  yield takeLatest(DEVICE_ACTIONS.UNPAIR_DEVICE_REQUEST, unpairDeviceSaga);
}
