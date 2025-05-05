/**
 * Shared test utilities and constants for component tests
 */
import { rest } from 'msw';

// Mock API endpoints
export const API_BASE_URL = 'https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/events';

// Common API headers
export const API_HEADERS = {
  'x-appery-api-express-api-key': '7ec55934-696a-485b-8770-4ad8dc7c40f1',
  'x-appery-session-token': 'b84fd727-6292-4e7e-8e1d-5341437db663',
};

// Common mock setup for expo-vector-icons
export const mockExpoVectorIcons = () => {
  jest.mock('@expo/vector-icons', () => {
    const { View } = require('react-native');
    return {
      Ionicons: ({ name }) => <View testID={`icon-${name}`} />,
    };
  });
};

// Common mock setup for Platform
export const mockPlatform = (os = 'web') => {
  jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: os,
    select: jest.fn((obj) => obj[os]), 
  }));
};

// Helper for creating API handlers for MSW
export const createApiHandlers = (mockResponses) => {
  return Object.keys(mockResponses).map((endpoint) => {
    return rest.get(endpoint, (req, res, ctx) => {
      // Find the matching handler based on query parameters
      const handlerKey = Object.keys(mockResponses[endpoint]).find(key => {
        const params = JSON.parse(key);
        return Object.entries(params).every(([param, value]) => {
          return req.url.searchParams.get(param) === value;
        });
      });

      if (handlerKey) {
        return res(
          ctx.status(200),
          ctx.json(mockResponses[endpoint][handlerKey])
        );
      }

      return res(ctx.status(400));
    });
  });
};

// Helper for testing loading states
export const testLoadingState = async (Component, props, screen, loadingText) => {
  // Set loading to true
  const { rerender } = render(<Component {...props} isLoading={true} />);
  
  // Check if loading indicator is shown
  const loadingIndicator = screen.getByTestId('activity-indicator');
  expect(loadingIndicator).toBeTruthy();
  
  // Check if loading text is shown
  if (loadingText) {
    expect(screen.getByText(loadingText)).toBeTruthy();
  }
  
  // Set loading to false and check if content is shown
  rerender(<Component {...props} isLoading={false} />);
  expect(screen.queryByTestId('activity-indicator')).toBeNull();
};

// Helper for testing error states
export const testErrorState = async (Component, props, screen, errorText, retryText) => {
  // Set error state
  const mockError = "Test error message";
  const { rerender } = render(<Component {...props} error={mockError} />);
  
  // Check if error icon is shown
  const errorIcon = screen.getByTestId('icon-alert-circle');
  expect(errorIcon).toBeTruthy();
  
  // Check if error text is shown
  if (errorText) {
    expect(screen.getByText(errorText)).toBeTruthy();
  }
  
  // Check if retry button is shown
  if (retryText) {
    expect(screen.getByText(retryText)).toBeTruthy();
  }
  
  // Clear error and check if content is shown
  rerender(<Component {...props} error={null} />);
  expect(screen.queryByTestId('icon-alert-circle')).toBeNull();
};

// Generic function to test radio button selection
export const testRadioButtonSelection = (screen, optionLabel) => {
  const radioOption = screen.getByText(optionLabel).parent;
  fireEvent.press(radioOption);
  
  // Additional checks would be component-specific
  // This is just a placeholder
  return true;
}; 