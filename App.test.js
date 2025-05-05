import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import App from './App'; // Adjust the import path if necessary

// Mock child components
// We will use jest.doMock inside beforeEach, but keep top-level mocks 
// for any components NOT directly rendered by App if needed elsewhere.
// It might also help Jest resolve the types correctly.
jest.mock('./src/components/Header'); 
jest.mock('./src/components/Sidebar');
jest.mock('./src/components/SessionList');
jest.mock('./src/components/BottomTabs');
jest.mock('./src/components/MobileFilters');
jest.mock('./src/components/MurliScreen', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Murli Screen Content</Text></View>;
});
jest.mock('./src/components/EventsScreen', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Events Screen Content</Text></View>;
});
jest.mock('./src/components/ExampleComponent');

// Mock the dynamic import for native MSW setup in App.js
jest.mock('./mocks/native', () => {
  console.log('[App.test.js] Mocking ./mocks/native');
  return {
    nativeServer: {
      listen: jest.fn(),
    },
  };
}, { virtual: true });

// --- Remove or comment out the broad react-native mock ---
// jest.mock('react-native', () => {
//   const RN = jest.requireActual('react-native');
//   RN.useWindowDimensions = jest.fn().mockReturnValue({ width: 400, height: 800 }); // Mobile-like dimensions
//   return RN;
// });

// --- Add specific mock for the hook ---
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ width: 400, height: 800 }),
}));

describe('<App /> Navigation', () => {
  let mockSetActiveScreen;
  let mockActiveScreen;

  beforeEach(() => {
    // Reset state and setup doMocks as before
    mockActiveScreen = 'Stats';
    mockSetActiveScreen = jest.fn((newScreen) => {
      mockActiveScreen = newScreen;
    });

    const { View, Text, TouchableOpacity } = require('react-native');

    // Keep the doMocks for components directly used by App
    jest.doMock('./src/components/Header', () => (props) => {
       return (
         <View>
           <TouchableOpacity testID="header-stats-button" onPress={() => props.setActiveScreen('Stats')}><Text>Stats</Text></TouchableOpacity>
           <TouchableOpacity testID="header-murlis-button" onPress={() => props.setActiveScreen('Murlis')}><Text>Murlis</Text></TouchableOpacity>
           <TouchableOpacity testID="header-events-button" onPress={() => props.setActiveScreen('Events')}><Text>Events</Text></TouchableOpacity>
         </View>
       );
    });
    jest.doMock('./src/components/BottomTabs', () => (props) => {
      return (
        <View>
          <TouchableOpacity testID="tabs-stats-button" onPress={() => props.setActiveScreen('Stats')}><Text>StatsTab</Text></TouchableOpacity>
          <TouchableOpacity testID="tabs-murlis-button" onPress={() => props.setActiveScreen('Murlis')}><Text>MurlisTab</Text></TouchableOpacity>
          <TouchableOpacity testID="tabs-events-button" onPress={() => props.setActiveScreen('Events')}><Text>EventsTab</Text></TouchableOpacity>
        </View>
      );
    });
    jest.doMock('./src/components/ExampleComponent', () => {
      return () => <View testID="mock-example-component" />;
    });
    jest.doMock('./src/components/SessionList', () => {
       return () => <View testID="mock-session-list" />;
    });
    jest.doMock('./src/components/Sidebar', () => {
       return () => <View testID="mock-sidebar" />;
    });
    jest.doMock('./src/components/MobileFilters', () => {
       return () => <View testID="mock-mobile-filters" />;
    });

  });

  afterEach(() => {
    jest.resetModules(); // Reset mocks between tests
  });


  test('should render Stats screen by default', () => {
    render(<App />);
    // Check for the mock component using testID
    expect(screen.getByTestId('mock-session-list')).toBeTruthy();
  });

  test('should navigate to Murlis screen when Header button is pressed', async () => {
    render(<App />);
    const murlisButton = screen.getByTestId('header-murlis-button');
    fireEvent.press(murlisButton);
    await waitFor(() => {
        expect(screen.getByText('Murli Screen Content')).toBeTruthy();
    });
    // Verify SessionList mock is gone
    expect(screen.queryByTestId('mock-session-list')).toBeNull();
  });

  test('should navigate to Events screen when Header button is pressed', async () => {
    render(<App />);
    const eventsButton = screen.getByTestId('header-events-button');
    fireEvent.press(eventsButton);
     await waitFor(() => {
        expect(screen.getByText('Events Screen Content')).toBeTruthy();
    });
    // Verify SessionList mock is gone
    expect(screen.queryByTestId('mock-session-list')).toBeNull();
  });

  // Add similar tests for BottomTabs interaction if testing on mobile
  // test('should navigate to Murlis screen when BottomTabs button is pressed', async () => {
  //   // Ensure Platform mock is set for mobile
  //   jest.spyOn(require('react-native'), 'Platform', 'get').mockReturnValue({ OS: 'ios' });
  //   // Ensure dimensions are mobile-like (already done in outer mock)
  //   render(<App />);
  //   const murlisTabButton = screen.getByTestId('tabs-murlis-button');
  //   fireEvent.press(murlisTabButton);
  //   await waitFor(() => {
  //       expect(screen.getByText('Murli Screen Content')).toBeTruthy();
  //   });
  //   expect(screen.queryByTestId('mock-session-list')).toBeNull();
  // });

}); 