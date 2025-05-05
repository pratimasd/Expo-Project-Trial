import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { ExampleComponent } from './ExampleComponent';
import { server } from '../../mocks/server'; // Import the MSW server
import { http, HttpResponse } from 'msw'; // Import MSW utilities

// IMPORTANT: Setup and teardown
beforeAll(() => {
  // Ensure server is properly setup
  console.log('Setting up MSW server for tests');
});

afterEach(() => {
  // Reset handlers to default after each test
  server.resetHandlers();
});

describe('ExampleComponent', () => {
  it('initially renders Loading... text', () => {
    const { getByTestId } = render(<ExampleComponent />);
    expect(getByTestId('api-message')).toHaveTextContent('Loading...');
  });

  it('renders API response from MSW after successful fetch', async () => {
    // Explicitly override the handler for this test
    server.use(
      http.get('https://api.example.com/message', () => {
        console.log('MSW: Intercepted message request, returning successful response');
        return HttpResponse.json({ message: 'Hello from MSW!' });
      })
    );

    render(<ExampleComponent />);
    
    // Wait for the component to update - with a longer timeout and specific error message
    await waitFor(() => {
      expect(screen.getByTestId('api-message').props.children).toBe('Hello from MSW!');
    }, { timeout: 5000, interval: 100 });
  });
  
  it('renders error message after failed fetch (MSW override)', async () => {
    // Explicitly override the handler for this test
    server.use(
      http.get('https://api.example.com/message', () => {
        console.log('MSW: Intercepted message request, returning 404');
        return HttpResponse.json({ error: 'Not found' }, { status: 404 });
      })
    );

    render(<ExampleComponent />);

    // Explicitly wait for the message to update
    await waitFor(() => {
      expect(screen.getByTestId('api-message').props.children).toBe('Error loading message');
    }, { timeout: 5000, interval: 100 });
  });

  it('renders error message when fetch throws an error (MSW override)', async () => {
    // Explicitly override the handler to simulate a network error
    server.use(
      http.get('https://api.example.com/message', () => {
        console.log('MSW: Intercepted message request, throwing network error');
        return HttpResponse.error();
      })
    );

    render(<ExampleComponent />);

    // Explicitly wait for the message to update
    await waitFor(() => {
      expect(screen.getByTestId('api-message').props.children).toBe('Error loading message');
    }, { timeout: 5000, interval: 100 });
  });
}); 