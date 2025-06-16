/**
 * @file auth.ts
 * @description Type definitions for authentication-related request and response payloads.
 *
 * Interfaces:
 * - `LoginPayload`: Credentials for logging in.
 * - `LoginResponse`: Response containing both access and refresh tokens after successful login.
 * - `RegisterPayload`: Data required for registering a new user.
 * - `RegisterResponse`: Response containing both access and refresh tokens after successful registration.
 * - `MeResponse`: Authenticated user's profile information returned from the `/auth/me` endpoint.
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}

export interface MeResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}
