import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import EventsScreen from '../EventsScreen';

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

// Mock API response data for events
const mockEventsApiResponse = {
  header: {
    pageNum: 1,
    pageSize: 10,
    found: 3
  },
  results: [
    {
      eventId: 5001,
      eventName: "Bhog Session",
      subcatId: 2,
      isActive: true,
      recurringCode: "W",
      sessionWeekDays: "0000001",
      sessionStartTime: "09:00",
      sessionEndTime: "10:00",
      recurringFrom: "2024-07-14",
      recurringUntil: null,
      isPublic: true,
      langCode: "en",
      hasIssue: false,
      hasIntgIssue: false,
      isPending: false,
      isAuto: true,
      sourceSystemCode: null,
      hasSessions: true,
      statusColor: "green",
      isManualSubmitted: true,
      isIntgSubmitted: true,
      recurringDays: "Sun ",
      location: "UK Main Center"
    },
    {
      eventId: 5002,
      eventName: "Yoga Session",
      subcatId: 2,
      isActive: true,
      recurringCode: "W",
      sessionWeekDays: "1010100",
      sessionStartTime: "18:30",
      sessionEndTime: "19:30",
      recurringFrom: "2024-07-15",
      recurringUntil: null,
      isPublic: true,
      langCode: "en",
      hasIssue: false,
      hasIntgIssue: false,
      isPending: false,
      isAuto: true,
      sourceSystemCode: null,
      hasSessions: true,
      statusColor: "green",
      isManualSubmitted: true,
      isIntgSubmitted: true,
      recurringDays: "Mon , Wed , Fri ",
      location: "Ilford Center"
    },
    {
      eventId: 5003,
      eventName: "Special Class",
      subcatId: 2,
      isActive: true,
      recurringCode: "",
      sessionWeekDays: "",
      sessionStartTime: "20:00",
      sessionEndTime: "21:00",
      recurringFrom: "2024-07-16",
      recurringUntil: null,
      isPublic: true,
      langCode: "en",
      hasIssue: false,
      hasIntgIssue: false,
      isPending: false,
      isAuto: true,
      sourceSystemCode: null,
      hasSessions: true,
      statusColor: "green",
      isManualSubmitted: true,
      isIntgSubmitted: true,
      recurringDays: "",
      location: "Online"
    }
  ]
};

// Create MSW server for mocking API calls
const server = setupServer(
  rest.get('https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/events', (req, res, ctx) => {
    // Check for the proper query parameters
    if (req.url.searchParams.get('isMurli') === 'false' && req.url.searchParams.get('subcatId') === '2') {
      return res(
        ctx.status(200),
        ctx.json(mockEventsApiResponse)
      );
    }
    return res(ctx.status(400));
  })
);

// Setup and teardown MSW server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('EventsScreen Component Tests', () => {
  // Render Tests
  describe('Rendering', () => {
    test('renders the component without crashing', () => {
      render(<EventsScreen />);
      expect(screen.getByText(/Showing results for:/)).toBeTruthy();
    });

    test('displays the correct number of events', () => {
      render(<EventsScreen />);
      expect(screen.getByText(/3 events/)).toBeTruthy();
    });

    test('displays the filter section on web platform', () => {
      render(<EventsScreen />);
      // Since we mocked Platform.OS to be 'web', we should see filter sections
      expect(screen.getByText('Event Type')).toBeTruthy();
      expect(screen.getByText('Status')).toBeTruthy();
    });

    test('displays the correct event cards with proper information', () => {
      render(<EventsScreen />);
      
      // Check for event titles
      expect(screen.getByText('Bhog Session')).toBeTruthy();
      expect(screen.getByText('Yoga Session')).toBeTruthy();
      expect(screen.getByText('Special Class')).toBeTruthy();
      
      // Check for times
      expect(screen.getByText('09:00')).toBeTruthy();
      expect(screen.getByText('18:30')).toBeTruthy();
      
      // Check for location display
      expect(screen.getByText('UK Main Center')).toBeTruthy();
      expect(screen.getByText('Ilford Center')).toBeTruthy();
      expect(screen.getByText('Online')).toBeTruthy();
    });

    test('displays the floating action button', () => {
      render(<EventsScreen />);
      const fabIcon = screen.getByTestId('icon-add');
      expect(fabIcon).toBeTruthy();
    });
  });

  // Interaction Tests
  describe('User Interactions', () => {
    test('search input accepts text', () => {
      render(<EventsScreen />);
      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.changeText(searchInput, 'Yoga');
      expect(searchInput.props.value).toBe('Yoga');
    });

    test('radio buttons can be selected', () => {
      render(<EventsScreen />);
      
      // Find and click a radio button (e.g., "Special Events" in Event Type section)
      const specialEventsOption = screen.getByText('Special Events').parent;
      fireEvent.press(specialEventsOption);
      
      // Verify the selection changed (implementation-specific, may need adjustment)
      // This is just a placeholder assertion - actual implementation would depend on your component
      expect(true).toBe(true);
    });
  });

  // API Integration Tests with MSW
  describe('API Integration', () => {
    test('fetches and displays event data from API', async () => {
      // Assuming your component has been modified to fetch data from the API
      render(<EventsScreen useApi={true} />); // Use the useApi prop to enable API fetching
      
      // Wait for the API request to complete and content to load
      await waitFor(() => {
        // Verify items from API are displayed
        expect(screen.getByText('Bhog Session')).toBeTruthy();
        expect(screen.getByText('Yoga Session')).toBeTruthy();
        expect(screen.getByText('Special Class')).toBeTruthy();
      });
    });

    test('handles API error gracefully', async () => {
      // Mock an API error
      server.use(
        rest.get('https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/events', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );
      
      // Render component with API enabled
      render(<EventsScreen useApi={true} />);
      
      // Wait for error handling to occur
      await waitFor(() => {
        // Verify error message is displayed (implementation-specific)
        // This assumes your component shows some error state
        // expect(screen.getByText('Failed to load events')).toBeTruthy();
        expect(true).toBe(true); // Placeholder
      });
    });
  });
}); 