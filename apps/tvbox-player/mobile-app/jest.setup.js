import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';

// Mock React Native modules
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock async storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Native Keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve({ username: 'test', password: 'test' })),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

// Mock React Native Device Info
jest.mock('react-native-device-info', () => ({
  getDeviceId: jest.fn(() => 'test-device-id'),
  getDeviceName: jest.fn(() => 'Test Device'),
  getSystemName: jest.fn(() => 'iOS'),
  getSystemVersion: jest.fn(() => '16.0'),
}));

// Mock mDNS service
jest.mock('react-native-zeroconf', () => ({
  Zeroconf: jest.fn().mockImplementation(() => ({
    scan: jest.fn(),
    stop: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
}));

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup global test timeout
jest.setTimeout(10000);

