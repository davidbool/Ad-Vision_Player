import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DeviceDiscoveryScreen from '../../src/screens/DeviceDiscoveryScreen';
import * as actions from '../../src/redux/actions/deviceActions';

const mockStore = configureStore([]);

describe('DeviceDiscoveryScreen', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      device: {
        discovering: false,
        availableDevices: [],
        error: null,
      },
    });
    store.dispatch = jest.fn();
  });

  it('should render correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <DeviceDiscoveryScreen />
      </Provider>
    );

    expect(getByText(/Discover TV Boxes/i)).toBeTruthy();
  });

  it('should dispatch discover action when scan button is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <DeviceDiscoveryScreen />
      </Provider>
    );

    const scanButton = getByText(/Scan for Devices/i);
    fireEvent.press(scanButton);

    expect(store.dispatch).toHaveBeenCalledWith(actions.discoverDevices());
  });

  it('should display loading indicator when discovering', () => {
    store = mockStore({
      device: {
        discovering: true,
        availableDevices: [],
        error: null,
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <DeviceDiscoveryScreen />
      </Provider>
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should display list of discovered devices', () => {
    const devices = [
      { id: '1', name: 'TV Box 1', ipAddress: '192.168.1.100' },
      { id: '2', name: 'TV Box 2', ipAddress: '192.168.1.101' },
    ];

    store = mockStore({
      device: {
        discovering: false,
        availableDevices: devices,
        error: null,
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <DeviceDiscoveryScreen />
      </Provider>
    );

    expect(getByText('TV Box 1')).toBeTruthy();
    expect(getByText('TV Box 2')).toBeTruthy();
  });

  it('should dispatch select device action when device is tapped', () => {
    const devices = [
      { id: '1', name: 'TV Box 1', ipAddress: '192.168.1.100' },
    ];

    store = mockStore({
      device: {
        discovering: false,
        availableDevices: devices,
        error: null,
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <DeviceDiscoveryScreen />
      </Provider>
    );

    const deviceItem = getByText('TV Box 1');
    fireEvent.press(deviceItem);

    expect(store.dispatch).toHaveBeenCalledWith(actions.selectDevice('1'));
  });

  it('should display error message when discovery fails', () => {
    const errorMessage = 'Network error';

    store = mockStore({
      device: {
        discovering: false,
        availableDevices: [],
        error: errorMessage,
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <DeviceDiscoveryScreen />
      </Provider>
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('should display empty state when no devices found', () => {
    store = mockStore({
      device: {
        discovering: false,
        availableDevices: [],
        error: null,
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <DeviceDiscoveryScreen />
      </Provider>
    );

    expect(getByText(/No devices found/i)).toBeTruthy();
  });

  it('should refresh device list on pull to refresh', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <DeviceDiscoveryScreen />
      </Provider>
    );

    const flatList = getByTestId('device-list');
    fireEvent(flatList, 'refresh');

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(actions.discoverDevices());
    });
  });

  it('should handle device selection navigation', () => {
    const mockNavigation = {
      navigate: jest.fn(),
    };

    const devices = [
      { id: '1', name: 'TV Box 1', ipAddress: '192.168.1.100' },
    ];

    store = mockStore({
      device: {
        discovering: false,
        availableDevices: devices,
        error: null,
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <DeviceDiscoveryScreen navigation={mockNavigation} />
      </Provider>
    );

    const deviceItem = getByText('TV Box 1');
    fireEvent.press(deviceItem);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('PairingScreen', {
      deviceId: '1',
    });
  });
});
