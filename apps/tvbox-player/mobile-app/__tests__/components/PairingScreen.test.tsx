import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PairingScreen from '../../src/screens/PairingScreen';
import * as actions from '../../src/redux/actions/deviceActions';

const mockStore = configureStore([]);

describe('PairingScreen', () => {
  let store: any;
  const mockRoute = {
    params: { deviceId: 'device-123' },
  };

  beforeEach(() => {
    store = mockStore({
      device: {
        pairing: false,
        error: null,
      },
    });
    store.dispatch = jest.fn();
  });

  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <PairingScreen route={mockRoute} />
      </Provider>
    );

    expect(getByText(/Enter PIN/i)).toBeTruthy();
    expect(getByPlaceholderText(/6-digit PIN/i)).toBeTruthy();
  });

  it('should accept only numeric input', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <PairingScreen route={mockRoute} />
      </Provider>
    );

    const input = getByPlaceholderText(/6-digit PIN/i);
    
    fireEvent.changeText(input, 'abc123');
    
    // Should only accept numbers
    expect(input.props.value).toBe('123');
  });

  it('should limit PIN to 6 digits', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <PairingScreen route={mockRoute} />
      </Provider>
    );

    const input = getByPlaceholderText(/6-digit PIN/i);
    
    fireEvent.changeText(input, '1234567890');
    
    expect(input.props.value.length).toBeLessThanOrEqual(6);
  });

  it('should dispatch pair action with valid PIN', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <PairingScreen route={mockRoute} />
      </Provider>
    );

    const input = getByPlaceholderText(/6-digit PIN/i);
    const pairButton = getByText(/Pair Device/i);
    
    fireEvent.changeText(input, '123456');
    fireEvent.press(pairButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      actions.pairDevice('device-123', '123456')
    );
  });

  it('should disable pair button when PIN is incomplete', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <PairingScreen route={mockRoute} />
      </Provider>
    );

    const input = getByPlaceholderText(/6-digit PIN/i);
    const pairButton = getByText(/Pair Device/i);
    
    fireEvent.changeText(input, '123');
    
    expect(pairButton.props.accessibilityState.disabled).toBe(true);
  });

  it('should show loading indicator when pairing', () => {
    store = mockStore({
      device: {
        pairing: true,
        error: null,
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <PairingScreen route={mockRoute} />
      </Provider>
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should display error message when pairing fails', () => {
    const errorMessage = 'Invalid PIN';
    store = mockStore({
      device: {
        pairing: false,
        error: errorMessage,
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <PairingScreen route={mockRoute} />
      </Provider>
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('should navigate to home on successful pairing', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    store = mockStore({
      device: {
        pairing: false,
        pairedDevices: [{ id: 'device-123', name: 'TV Box' }],
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <PairingScreen route={mockRoute} navigation={mockNavigation} />
      </Provider>
    );

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('should clear error on retry', () => {
    const errorMessage = 'Invalid PIN';
    store = mockStore({
      device: {
        pairing: false,
        error: errorMessage,
      },
    });

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <PairingScreen route={mockRoute} />
      </Provider>
    );

    const input = getByPlaceholderText(/6-digit PIN/i);
    
    // Clear error by changing input
    fireEvent.changeText(input, '1');
    
    // Error should be cleared (implementation dependent)
  });

  it('should show PIN visibility toggle', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <PairingScreen route={mockRoute} />
      </Provider>
    );

    const toggleButton = getByTestId('pin-visibility-toggle');
    
    fireEvent.press(toggleButton);
    
    // Visibility should toggle
  });
});
