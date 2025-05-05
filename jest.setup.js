/**
 * Jest setup file
 */

// Import necessary testing libraries
import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';
import 'whatwg-fetch';

// Polyfill for setImmediate/clearImmediate needed by React Native internals in Jest
// See: https://github.com/facebook/jest/issues/4545#issuecomment-332762365
// and potential issues with React Native's usage: https://github.com/facebook/react-native/issues/34798
global.setImmediate = global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));
global.clearImmediate = global.clearImmediate || global.clearTimeout;

// Silence the warning about act() wrapping from React Native
const originalWarn = console.warn;
const originalError = console.error;

jest.spyOn(console, 'warn').mockImplementation((message) => {
  if (message && (
    message.includes('You called act(async () => ...)') || 
    message.includes('Cannot update a component from inside') ||
    message.includes('Setting a timer for a long period of time') ||
    message.includes('[MSW]') ||
    message.includes('inside a test was not wrapped in act')
  )) {
    return; // Suppress the specific warnings
  }
  // Log other warnings
  originalWarn(message);
});

jest.spyOn(console, 'error').mockImplementation((message) => {
  if (message && (
    message.includes('inside a test was not wrapped in act') ||
    message.includes('Failed to fetch murlis:')
  )) {
    return; // Suppress act() warnings and fetch errors
  }
  // Log other errors
  originalError(message);
});

// Mock the react-native modules that are not implemented in Jest environment
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => {
  return {
    addListener: jest.fn(),
    removeListeners: jest.fn()
  };
}, { virtual: true });

// Mock the Platform module with default web platform
jest.mock('react-native/Libraries/Utilities/Platform', () => {
  return {
    OS: 'web',
    select: (obj) => obj.web || obj.default
  };
});

// Properly mock Ionicons for test rendering
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  // Create a function to return the mock component
  return {
    Ionicons: function MockIonicons(props) {
      return React.createElement(View, {
        ...props,
        testID: `icon-${props.name || 'default'}`
      });
    }
  };
});

// Set up fetch mock
global.fetch = jest.fn().mockImplementation((url) => {
  console.warn(`[Test] Fetch called with: ${url}`);
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    status: 200
  });
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Set up MSW for API mocking in all tests
const { setupServer } = require('msw/node');
const { http, HttpResponse } = require('msw');

// Create empty server for tests to add handlers to
global.mswServer = setupServer();
global.msw = { http, HttpResponse }; // Export MSW components for tests to use

// Start MSW server before tests
beforeAll(() => global.mswServer.listen());

// Reset handlers after each test
afterEach(() => {
  global.mswServer.resetHandlers();
  if (global.fetch.mockClear) {
    global.fetch.mockClear();
  }
});

// Close server after all tests
afterAll(() => global.mswServer.close());
