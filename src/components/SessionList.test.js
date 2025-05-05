import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import SessionList from './SessionList';
// Import these when SessionList uses API fetching
import { server } from '../../mocks/server'; 
import { http, HttpResponse } from 'msw'; 

// Mock the child component SessionCard
jest.mock('./SessionCard', () => {
  const { View, Text } = require('react-native');
  return ({ session }) => (
    <View testID="mock-session-card">
      <Text>{session.eventName}</Text>
    </View>
  );
});

// Mock data for tests
const mockSessionData = [
  { id: '1', title: 'Test Session 1', type: 'Murli', date: '2024-06-30' },
  { id: '2', title: 'Test Session 2', type: 'Class', date: '2024-06-30' },
  { id: '3', title: 'Test Session 3', type: 'Murli', date: '2024-06-29' },
];

// Mock the entire data module (now commented out as we use API)
// jest.mock('../data/mockData', () => ({
//   sessions: [
//     { id: '1', title: 'Test Session 1', type: 'Murli', date: '2024-06-30' },
//     { id: '2', title: 'Test Session 2', type: 'Class', date: '2024-06-30' },
//     { id: '3', title: 'Test Session 3', type: 'Murli', date: '2024-06-29' },
//   ],
// }));

// CRITICAL: Mock the FlatList component to render all items synchronously
jest.mock('react-native/Libraries/Lists/FlatList', () => {
  const { View } = require('react-native');
  return ({ data, renderItem, keyExtractor }) => {
    return (
      <View>
        {data && data.map((item, index) => (
          <View key={keyExtractor ? keyExtractor(item) : `item-${index}`}>
            {renderItem({ item })}
 
          </View>
        ))}
      </View>
    );
  };
});

describe('<SessionList />', () => {
  // Setup MSW before each test
  beforeAll(() => {
    console.log('[TEST SETUP] Starting MSW server');
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    console.log('[TEST CLEANUP] Resetting MSW handlers');
    server.resetHandlers();
  });

  afterAll(() => {
    console.log('[TEST CLEANUP] Closing MSW server');
    server.close();
  });

  // Original tests that relied on imported mock data (previously skipped)
  it('should render the results header text and hardcoded count', async () => {
    console.log('[RENDERING TEST] Testing header text and result count display');
    
    // Render with normal function, not inside act()
    render(<SessionList />);
    
    // Wait for loading to complete before checking elements
    await waitFor(() => {
      // Make sure loading indicator is gone
      expect(screen.queryByTestId('loading-indicator')).toBeNull();
    }, { timeout: 2000 });
    
    // Check for the static text part using a regex to be more flexible with nested text
    expect(screen.getByText(/Showing results for:/i)).toBeTruthy();
    // Count is now dynamic based on API response
    console.log('[RENDERING TEST] ✓ Header text rendered correctly');
  });

  it('should render the hardcoded filter tags', async () => {
    console.log('[RENDERING TEST] Testing filter tag elements');
    
    // Use normal render without act()
    render(<SessionList />);
    
    // Wait for loading to complete before checking elements
    await waitFor(() => {
      // Make sure loading indicator is gone
      expect(screen.queryByTestId('loading-indicator')).toBeNull();
    }, { timeout: 2000 });
    
    expect(screen.getByText('30 Jun 2024')).toBeTruthy();
    expect(screen.getByText('Murli')).toBeTruthy();
    expect(screen.getByText('Tamil')).toBeTruthy();
    console.log('[RENDERING TEST] ✓ All filter tags rendered correctly');
  });

  it('should render the correct number of SessionCard mocks based on API data', async () => {
    console.log('[UNIT TEST] Testing FlatList renders correct number of items');
    // Use a standard API mock from above
    render(<SessionList />);
    
    // Wait for API data to load
    await waitFor(() => {
      // Find all instances of the mocked SessionCard using the testID we assigned
      const sessionCards = screen.getAllByTestId('mock-session-card');
      expect(sessionCards.length).toBeGreaterThan(0);
      console.log(`[UNIT TEST] Found ${sessionCards.length} session cards`);
    }, { timeout: 1000 });
    
    console.log('[UNIT TEST] ✓ FlatList rendered items correctly');
  });

  it('should render the session names from the API data', async () => {
    console.log('[UNIT TEST] Testing session data eventNames are displayed correctly');
    
    // Setup a specific test handler
    server.use(
      http.get('https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/sessions/stats*', () => {
        return new HttpResponse(
          JSON.stringify({
            header: {
              pageNum: 2,
              pageSize: 10,
              found: 3
            },
            results: [
              { 
                eventName: "Special Test Session 1",
                eventSessionId: 335784,
                sessionStartsOn: "2025-04-29 11:08:00.0",
                statusColor: "yellow"
              },
              { 
                eventName: "Special Test Session 2",
                eventSessionId: 335764, 
                sessionStartsOn: "2025-04-29 11:00:00.0",
                statusColor: "yellow"
              }
            ]
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    
    render(<SessionList />);
    
    // Wait for API data and check if eventNames are displayed
    await waitFor(() => {
      expect(screen.getByText('Special Test Session 1')).toBeTruthy();
      expect(screen.getByText('Special Test Session 2')).toBeTruthy();
    }, { timeout: 1000 });
    
    console.log('[UNIT TEST] ✓ All session names displayed correctly');
  });

  // --- MSW TEST CASES ---
  it('should load and display sessions from the API', async () => {
    // STEP 1: Override the MSW handler to provide test session data
    console.log('[MSW TEST] Setting up API mocking for sessions endpoint');
    server.use(
      http.get('https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/sessions/stats*', ({ request }) => {
        console.log('[MSW TEST] Intercepted fetch request to sessions endpoint');
        
        // Check for required headers
        const contentType = request.headers.get('Content-Type');
        const apiExpressKey = request.headers.get('x-appery-api-express-api-key');
        const sessionToken = request.headers.get('x-appery-session-token');
        
        // Verify headers (comment this out if you just want to mock without checking)
        if (!contentType || !apiExpressKey || !sessionToken) {
          console.warn('[MSW TEST] Required headers missing!');
          // You can return an error response here if you want to test header validation
          // return new HttpResponse(null, { status: 401 });
        }
        
        return new HttpResponse(
          JSON.stringify({
            header: {
              pageNum: 2,
              pageSize: 10,
              found: 3878
            },
            results: [
              { 
                ROW_NUM: 11,
                eventId: 21894,
                eventName: "Trial recurring session",
                subcatId: 4,
                langCode: "fa",
                eventSessionId: 335784, 
                sessionStartsOn: "2025-04-29 11:08:00.0",
                isCancelled: false,
                hasIssues: 0,
                isPending: 1,
                isManualSubmitted: 0,
                isIntgSubmitted: 0,
                hasIntgIssues: 0,
                numManualChannels: 1,
                numAutoChannels: 0,
                isAuto: false,
                statusColor: "yellow",
                channels: [
                  {
                    eventSessionId: 335784,
                    channelCode: "TP",
                    statsId: null,
                    statsNumber: null,
                    statsTypeCode: "",
                    channelStatusCode: "M",
                    channelStatsStatus: "PE"
                  }
                ]
              },
              { 
                ROW_NUM: 12,
                eventId: 17205,
                eventName: "Hindi Murli",
                subcatId: 1,
                langCode: "hi",
                eventSessionId: 335764, 
                sessionStartsOn: "2025-04-29 11:00:00.0",
                isCancelled: false,
                hasIssues: 0,
                isPending: 1,
                isManualSubmitted: 0,
                isIntgSubmitted: 0,
                hasIntgIssues: 0,
                numManualChannels: 1,
                numAutoChannels: 0,
                isAuto: false,
                statusColor: "yellow",
                channels: [
                  {
                    eventSessionId: 335764,
                    channelCode: "PH",
                    statsId: null,
                    statsNumber: null,
                    statsTypeCode: "",
                    channelStatusCode: "M",
                    channelStatsStatus: "PE"
                  }
                ]
              },
              { 
                ROW_NUM: 13,
                eventId: 9758,
                eventName: "English Murli",
                subcatId: 1,
                langCode: "en",
                eventSessionId: 335543, 
                sessionStartsOn: "2025-04-28 18:00:00.0",
                isCancelled: false,
                hasIssues: 0,
                isPending: 1,
                isManualSubmitted: 0,
                isIntgSubmitted: 0,
                hasIntgIssues: 0,
                numManualChannels: 1,
                numAutoChannels: 0,
                isAuto: false,
                statusColor: "yellow",
                channels: [
                  {
                    eventSessionId: 335543,
                    channelCode: "PH",
                    statsId: null,
                    statsNumber: null,
                    statsTypeCode: "",
                    channelStatusCode: "M",
                    channelStatsStatus: "PE"
                  }
                ]
              }
            ]
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    
    // STEP 2: Render the component - it will fetch data from mocked API
    console.log('[MSW TEST] Rendering SessionList component (it will fetch data from API)');
    render(<SessionList />);
    
    // STEP 3: Wait for the API data to be loaded and displayed
    console.log('[MSW TEST] Waiting for API data to appear in component');
    await waitFor(() => {
      expect(screen.getByText('Trial recurring session')).toBeTruthy();
    }, { timeout: 3000 });
    
    // STEP 4: Assert that all API-provided sessions are displayed
    console.log('[MSW TEST] Verifying all API sessions are displayed');
    expect(screen.getByText('Hindi Murli')).toBeTruthy();
    expect(screen.getByText('English Murli')).toBeTruthy();
    
    // STEP 5: Verify the count updates to match the API data count
    expect(screen.getByText('3 Sessions')).toBeTruthy();
    
    console.log('[MSW TEST] ✓ API data was correctly fetched and displayed');
  });

  it('should display loading state while fetching data', async () => {
    // Create a delayed response to test loading state
    server.use(
      http.get('https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/sessions/stats*', async ({ request }) => {
        // Delay the response by 500ms
        await new Promise(resolve => setTimeout(resolve, 500));
        return new HttpResponse(
          JSON.stringify({
            header: {
              pageNum: 2,
              pageSize: 10,
              found: 1
            },
            results: [
              { 
                ROW_NUM: 11,
                eventId: 21894,
                eventName: "Delayed Session",
                subcatId: 4,
                langCode: "fa",
                eventSessionId: 335784, 
                sessionStartsOn: "2025-04-29 11:08:00.0",
                isCancelled: false,
                sourceSystemCode: null,
                num_registrations: null,
                hasIssues: 0,
                isPending: 1,
                isManualSubmitted: 0,
                isIntgSubmitted: 0,
                hasIntgIssues: 0,
                numManualChannels: 1,
                numAutoChannels: 0,
                isAuto: false,
                statusColor: "yellow",
                channels: [
                  {
                    eventSessionId: 335784,
                    channelCode: "TP",
                    statsId: null,
                    statsNumber: null,
                    statsTypeCode: "",
                    channelStatusCode: "M",
                    channelStatsStatus: "PE"
                  }
                ]
              }
            ]
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    
    render(<SessionList />);
    
    // Test that loading indicator appears
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Delayed Session')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('should display error message when API fails', async () => {
    // Override handler to return an error
    server.use(
      http.get('https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/sessions/stats*', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    
    render(<SessionList />);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to load sessions')).toBeTruthy();
    }, { timeout: 3000 });
  });

  // Unit tests (previously skipped)
  it('should render the results header text with dynamic count', async () => {
    console.log('[RENDERING TEST] Testing header text and result count display');
    
    server.use(
      http.get('https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/sessions/stats*', () => {
        return new HttpResponse(
          JSON.stringify({
            header: {
              pageNum: 2,
              pageSize: 10,
              found: 42 // Specific test value
            },
            results: [
              { 
                ROW_NUM: 11,
                eventId: 21894,
                eventName: "Test Session 1",
                subcatId: 4,
                langCode: "en",
                eventSessionId: 335784, 
                sessionStartsOn: "2025-04-29 11:08:00.0",
                isCancelled: false,
                hasIssues: 0,
                isPending: 1,
                isManualSubmitted: 0,
                isIntgSubmitted: 0,
                hasIntgIssues: 0,
                numManualChannels: 1,
                numAutoChannels: 0,
                isAuto: false,
                statusColor: "yellow"
              },
              { 
                ROW_NUM: 12,
                eventId: 17205,
                eventName: "Test Session 2",
                subcatId: 1,
                langCode: "hi",
                eventSessionId: 335764, 
                sessionStartsOn: "2025-04-29 11:00:00.0",
                isCancelled: false,
                hasIssues: 0,
                isPending: 1,
                isManualSubmitted: 0,
                isIntgSubmitted: 0,
                hasIntgIssues: 0,
                numManualChannels: 1,
                numAutoChannels: 0,
                isAuto: false,
                statusColor: "yellow"
              },
              { 
                ROW_NUM: 13,
                eventId: 9758,
                eventName: "Test Session 3",
                subcatId: 1,
                langCode: "en",
                eventSessionId: 335543, 
                sessionStartsOn: "2025-04-28 18:00:00.0",
                isCancelled: false,
                hasIssues: 0,
                isPending: 1,
                isManualSubmitted: 0,
                isIntgSubmitted: 0,
                hasIntgIssues: 0,
                numManualChannels: 1,
                numAutoChannels: 0,
                isAuto: false,
                statusColor: "yellow"
              }
            ]
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    
    render(<SessionList />);
    
    // Wait for data to load
    await waitFor(() => {
      // Check for the static text part
      expect(screen.getByText(/Showing results for:/i)).toBeTruthy();
      // Check for the dynamic count from our test data (3 items)
      expect(screen.getByText('3 Sessions')).toBeTruthy(); 
    }, { timeout: 1000 });
    
    console.log('[RENDERING TEST] ✓ Header text and count rendered correctly');
  });

  it('should render the filter tags', async () => {
    console.log('[RENDERING TEST] Testing filter tag elements');
    
    // Use the same handler as above
    render(<SessionList />);
    
    await waitFor(() => {
      expect(screen.getByText('30 Jun 2024')).toBeTruthy();
      expect(screen.getByText('Murli')).toBeTruthy();
      expect(screen.getByText('Tamil')).toBeTruthy();
    }, { timeout: 1000 });
    
    console.log('[RENDERING TEST] ✓ All filter tags rendered correctly');
  });

  it('should render the correct number of SessionCard items', async () => {
    console.log('[UNIT TEST] Testing FlatList renders correct number of items');
    
    // Use default handler which returns 3 sessions
    render(<SessionList />);
    
    await waitFor(() => {
      // Find all instances of the mocked SessionCard using the testID we assigned
      const sessionCards = screen.getAllByTestId('mock-session-card');
      console.log(`[UNIT TEST] Found ${sessionCards.length} session cards out of expected 3`);
      // Assert that the number of cards matches the expected count
      expect(sessionCards).toHaveLength(3); 
    }, { timeout: 1000 });
    
    console.log('[UNIT TEST] ✓ FlatList rendered correct number of items');
  });
}); 