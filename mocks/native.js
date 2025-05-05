import { setupServer } from 'msw/native';
import { handlers } from './handlers';

// This configures a request mocking server with the given request handlers for React Native.
export const nativeServer = setupServer(...handlers); 