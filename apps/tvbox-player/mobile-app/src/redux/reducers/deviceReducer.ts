import { DEVICE_ACTIONS } from '../actions/types';
import { Device } from '../../utils/types';

interface DeviceState {
  discoveredDevices: Device[];
  pairedDevices: Device[];
  selectedDevice: Device | null;
  isDiscovering: boolean;
  isPairing: boolean;
  error: string | null;
}

const initialState: DeviceState = {
  discoveredDevices: [],
  pairedDevices: [],
  selectedDevice: null,
  isDiscovering: false,
  isPairing: false,
  error: null,
};

export default function deviceReducer(state = initialState, action: any): DeviceState {
  switch (action.type) {
    case DEVICE_ACTIONS.DISCOVER_DEVICES_REQUEST:
      return { ...state, isDiscovering: true, error: null };
    
    case DEVICE_ACTIONS.DISCOVER_DEVICES_SUCCESS:
      return {
        ...state,
        isDiscovering: false,
        discoveredDevices: action.payload,
      };
    
    case DEVICE_ACTIONS.DISCOVER_DEVICES_FAILURE:
      return {
        ...state,
        isDiscovering: false,
        error: action.payload,
      };
    
    case DEVICE_ACTIONS.PAIR_DEVICE_REQUEST:
      return { ...state, isPairing: true, error: null };
    
    case DEVICE_ACTIONS.PAIR_DEVICE_SUCCESS:
      return {
        ...state,
        isPairing: false,
        pairedDevices: [...state.pairedDevices, action.payload.device],
        selectedDevice: action.payload.device,
      };
    
    case DEVICE_ACTIONS.PAIR_DEVICE_FAILURE:
      return {
        ...state,
        isPairing: false,
        error: action.payload,
      };
    
    case DEVICE_ACTIONS.UNPAIR_DEVICE_SUCCESS:
      return {
        ...state,
        pairedDevices: state.pairedDevices.filter(d => d.deviceId !== action.payload),
        selectedDevice: state.selectedDevice?.deviceId === action.payload ? null : state.selectedDevice,
      };
    
    case DEVICE_ACTIONS.SELECT_DEVICE:
      return {
        ...state,
        selectedDevice: action.payload,
      };
    
    case DEVICE_ACTIONS.UPDATE_DEVICE_STATUS:
      return {
        ...state,
        pairedDevices: state.pairedDevices.map(device =>
          device.deviceId === action.payload.deviceId
            ? { ...device, ...action.payload.status }
            : device
        ),
      };
    
    default:
      return state;
  }
}
