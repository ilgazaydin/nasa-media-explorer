/**
 * @file config.ts
 * @description Application configuration management
 *
 * Centralizes environment variable access and provides typed configuration
 * options for the application.
 */

export interface AppConfig {
  /** Whether to bypass authentication and use mock user */
  mockAuth: boolean;
  /** API base URL */
  apiBaseUrl: string;
}

/**
 * Application configuration object
 */
export const config: AppConfig = {
  mockAuth: import.meta.env.VITE_MOCK_AUTH === "true",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
};

/**
 * Mock user data for development/testing
 */
export const mockUser = {
  id: "mock-user-id",
  email: "dev@example.com",
  firstName: "Developer",
  lastName: "User",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Mock tokens for development/testing
 */
export const mockTokens = {
  accessToken: "mock-access-token-for-development",
  refreshToken: "mock-refresh-token-for-development",
};
