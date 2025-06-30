import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });
};

// Common preloaded states for testing
export const mockAuthenticatedState = {
  auth: {
    accessToken: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    loading: false
  }
};

export const mockUnauthenticatedState = {
  auth: {
    accessToken: null,
    refreshToken: null,
    user: null,
    loading: false
  }
};

export const mockAuthLoadingState = {
  auth: {
    accessToken: null,
    refreshToken: null,
    user: null,
    loading: true
  }
};
