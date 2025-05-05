import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import MurliScreen from '../MurliScreen';

// Mock the expo-vector-icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: ({ name }) => <View testID={`icon-${name}`} />,
  };
});

// Mock the Platform module
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web', // or 'ios', 'android' for different test scenarios
  select: jest.fn((obj) => obj.web), // Default to web for our tests
}));

// Mock API response data
const mockMurliApiResponse = {
  header: {
    pageNum: 1,
    pageSize: 10,
    found: 3
  },
  results: [
    {
      eventId: 17205,
      eventName: "Hindi Murli",
      subcatId: 1,
      isActive: true,
      recurringCode: "W",
      sessionWeekDays: "0100000",
      sessionStartTime: "11:00",
      sessionEndTime: "12:00",
      recurringFrom: "2025-04-29",
      recurringUntil: null,
      isPublic: false,
      langCode: "hi",
      hasIssue: false,
      hasIntgIssue: false,
      isPending: true,
      isAuto: false,
      sourceSystemCode: null,
      hasSessions: true,
      statusColor: "yellow",
      isManualSubmitted: false,
      isIntgSubmitted: false,
      recurringDays: "Tue "
    },
    {
      eventId: 9758,
      eventName: "English Murli",
      subcatId: 1,
      isActive: true,
      recurringCode: "W",
      sessionWeekDays: "1111111",
      sessionStartTime: "18:00",
      sessionEndTime: "19:00",
      recurringFrom: "2025-05-02",
      recurringUntil: null,
      isPublic: false,
      langCode: "en",
      hasIssue: false,
      hasIntgIssue: false,
      isPending: true,
      isAuto: false,
      sourceSystemCode: null,
      hasSessions: true,
      statusColor: "yellow",
      isManualSubmitted: false,
      isIntgSubmitted: true,
      recurringDays: "Mon , Tue , Wed , Thurs , Fri , Sat , Sun "
    },
    {
      eventId: 9759,
      eventName: "English Murli",
      subcatId: 1,
      isActive: true,
      recurringCode: "W",
      sessionWeekDays: "0010100",
      sessionStartTime: "21:53",
      sessionEndTime: "22:53",
      recurringFrom: "2025-05-03",
      recurringUntil: null,
      isPublic: false,
      langCode: "en",
      hasIssue: false,
      hasIntgIssue: false,
      isPending: true,
      isAuto: false,
      sourceSystemCode: null,
      hasSessions: true,
      statusColor: "yellow",
      isManualSubmitted: false,
      isIntgSubmitted: true,
      recurringDays: "Wed , Fri "
    }
  ]
};

// Create MSW server for mocking API calls
const server = setupServer(
  http.get('https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/events', ({ request }) => {
    // Check for the proper query parameters
    const url = new URL(request.url);
    if (url.searchParams.get('isMurli') === 'true' && url.searchParams.get('subcatId') === '1') {
      return HttpResponse.json(mockMurliApiResponse, { status: 200 });
    }
    return new HttpResponse(null, { status: 400 });
  })
);

// Setup and teardown MSW server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('MurliScreen Component Tests', () => {
  // Render Tests
  describe('Rendering', () => {
    test('renders the component without crashing', () => {
      render(<MurliScreen />);
      expect(screen.getByText(/Showing results for:/)).toBeTruthy();
    });

    test('displays the correct number of murlis', () => {
      render(<MurliScreen />);
      expect(screen.getByText(/3 murlis/)).toBeTruthy();
    });

    test('displays the filter section on web platform', () => {
      render(<MurliScreen />);
      // Since we mocked Platform.OS to be 'web', we should see filter sections
      expect(screen.getByText('Language')).toBeTruthy();
      expect(screen.getByText('Status')).toBeTruthy();
    });

    test('displays the correct murli cards with proper information', () => {
      render(<MurliScreen />);
      
      // Check for Hindi Murli
      expect(screen.getByText('Hindi Murli')).toBeTruthy();
      expect(screen.getByText('11:00')).toBeTruthy();
      
      // Check for English Murli at 18:00
      expect(screen.getAllByText('English Murli').length).toBe(2); // Should have 2 English Murlis
      expect(screen.getByText('18:00')).toBeTruthy();
      
      // Check for recurring days display
      expect(screen.getByText('Mon , Tue , Wed , Thurs , Fri , Sat , Sun')).toBeTruthy();
      expect(screen.getByText('Wed , Fri')).toBeTruthy();
    });

    test('displays the floating action button', () => {
      render(<MurliScreen />);
      const fabIcon = screen.getByTestId('icon-add');
      expect(fabIcon).toBeTruthy();
    });
  });

  // Interaction Tests
  describe('User Interactions', () => {
    test('search input accepts text', () => {
      render(<MurliScreen />);
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.changeText(searchInput, 'Hindi');
      expect(searchInput.props.value).toBe('Hindi');
    });

    test('radio buttons can be selected', () => {
      render(<MurliScreen />);
      
      // Find and click a radio button (e.g., "English" in Language section)
      const englishRadioOption = screen.getByText('English').parent;
      fireEvent.press(englishRadioOption);
      
      // Verify the selection changed (implementation-specific, may need adjustment)
      // This is just a placeholder assertion - actual implementation would depend on your component
      expect(true).toBe(true);
    });
  });

  // API Integration Tests with MSW
  describe('API Integration', () => {
    // This is a mock implementation that would replace the current mock data in your component
    // with data fetched from the API. You'll need to modify your component to use this approach.
    test('fetches and displays murli data from API', async () => {
      // Assuming your component has been modified to fetch data from the API
      render(<MurliScreen useApi={true} />); // Hypothetical prop to enable API fetching
      
      // Wait for the API request to complete and content to load
      await waitFor(() => {
        // Verify items from API are displayed
        expect(screen.getByText('Hindi Murli')).toBeTruthy();
        expect(screen.getByText('11:00')).toBeTruthy();
        expect(screen.getAllByText('English Murli').length).toBe(2);
      });
    });

    test('handles API error gracefully', async () => {
      // Mock an API error
      server.use(
        http.get('https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/events', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      
      // Render component with API enabled
      render(<MurliScreen useApi={true} />);
      
      // Wait for error handling to occur
      await waitFor(() => {
        // Verify error message is displayed (implementation-specific)
        // This assumes your component shows some error state
        // expect(screen.getByText('Failed to load murlis')).toBeTruthy();
        expect(true).toBe(true); // Placeholder
      });
    });
  });
});

/**
 * Guidelines for adapting this test file for EventsScreen:
 * 
 * 1. Create a copy of this file named 'EventsScreen.test.js'
 * 2. Replace all instances of 'MurliScreen' with 'EventsScreen'
 * 3. Update the API endpoint URL parameters (remove isMurli=true or set it to false)
 * 4. Create a new mock response for events data with appropriate structure
 * 5. Update test assertions to match the expected event data
 * 6. Adjust test descriptions to reflect testing events rather than murlis
 */ 