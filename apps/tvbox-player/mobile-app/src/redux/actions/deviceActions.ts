import { DEVICE_ACTIONS } from './types';
import { Device } from '../../utils/types';

export const discoverDevicesRequest = () => ({
  type: DEVICE_ACTIONS.DISCOVER_DEVICES_REQUEST,
});

export const discoverDevicesSuccess = (devices: Device[]) => ({
  type: DEVICE_ACTIONS.DISCOVER_DEVICES_SUCCESS,
  payload: devices,
});

export const discoverDevicesFailure = (error: string) => ({
  type: DEVICE_ACTIONS.DISCOVER_DEVICES_FAILURE,
  payload: error,
});

export const pairDeviceRequest = (sessionId: string, pinCode: string, deviceName: string) => ({
  type: DEVICE_ACTIONS.PAIR_DEVICE_REQUEST,
  payload: { sessionId, pinCode, deviceName },
});

export const pairDeviceSuccess = (device: Device, tokens: any) => ({
  type: DEVICE_ACTIONS.PAIR_DEVICE_SUCCESS,
  payload: { device, tokens },
});

export const pairDeviceFailure = (error: string) => ({
  type: DEVICE_ACTIONS.PAIR_DEVICE_FAILURE,
  payload: error,
});

export const unpairDeviceRequest = (deviceId: string) => ({
  type: DEVICE_ACTIONS.UNPAIR_DEVICE_REQUEST,
  payload: deviceId,
});

export const unpairDeviceSuccess = (deviceId: string) => ({
  type: DEVICE_ACTIONS.UNPAIR_DEVICE_SUCCESS,
  payload: deviceId,
});

export const selectDevice = (device: Device) => ({
  type: DEVICE_ACTIONS.SELECT_DEVICE,
  payload: device,
});

export const updateDeviceStatus = (deviceId: string, status: any) => ({
  type: DEVICE_ACTIONS.UPDATE_DEVICE_STATUS,
  payload: { deviceId, status },
});
