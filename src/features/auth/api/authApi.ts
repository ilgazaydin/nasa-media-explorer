/**
 * @file authApi.ts
 * @description Provides authentication-related API calls using the app's HTTP client wrapper.
 */

import { api } from "@/lib/api/app";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  MeResponse,
} from "../model/auth";

/**
 * Sends a login request with user credentials.
 *
 * @param {LoginPayload} payload - The user's email and password.
 * @returns {Promise<LoginResponse>} A promise that resolves to a token if authentication is successful.
 *
 * @example
 * const res = await login({ email: "user@example.com", password: "password123" });
 * console.log(res.token); // "abc.def.ghi"
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return api.post("/auth/login", payload);
}

/**
 * Sends a registration request with new user details.
 *
 * @param {RegisterPayload} payload - The user's registration data including name, email, and password.
 * @returns {Promise<RegisterResponse>} A promise that resolves to a token on successful registration.
 *
 * @example
 * const res = await register({
 *   email: "new@example.com",
 *   password: "strongPass123",
 *   firstName: "John",
 *   lastName: "Doe"
 * });
 */
export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  return api.post("/auth/register", payload);
}

/**
 * Fetches the currently authenticated user's profile.
 * Requires a valid token to be present (typically in Authorization headers).
 *
 * @returns {Promise<MeResponse>} A promise that resolves to the user's profile information.
 *
 * @example
 * const user = await me();
 * console.log(user.email); // "user@example.com"
 */
export async function me(): Promise<MeResponse> {
  return api.get("/auth/me");
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return api.get(`/auth/verify-email?token=${token}`);
}
