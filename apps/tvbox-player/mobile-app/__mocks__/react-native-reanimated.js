'use strict';

// Minimal stub for react-native-reanimated used in tests.
module.exports = {
  default: {
    call: () => {},
    createAnimatedComponent: c => c,
    Value: jest.fn(),
    timing: jest.fn(),
    spring: jest.fn(),
    add: jest.fn(),
    multiply: jest.fn(),
    interpolate: jest.fn(),
    event: jest.fn(),
    block: jest.fn(),
    cond: jest.fn(),
    set: jest.fn(),
  },
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn(v => v),
  withSpring: jest.fn(v => v),
};
