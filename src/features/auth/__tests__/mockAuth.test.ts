/**
 * @file mockAuth.test.ts
 * @description Tests for mock authentication functionality
 */

import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, {
  enableMockAuth,
  disableMockAuth,
} from "@/features/auth/store/authSlice";
import { mockUser, mockTokens } from "@/config";

describe("Mock Authentication Actions", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    localStorage.clear();
  });

  describe("enableMockAuth action", () => {
    it("should set mock tokens and user", () => {
      const initialState = (store.getState() as any).auth;
      expect(initialState.accessToken).toBeDefined();

      store.dispatch(enableMockAuth());

      const newState = (store.getState() as any).auth;
      expect(newState.accessToken).toBe(mockTokens.accessToken);
      expect(newState.refreshToken).toBe(mockTokens.refreshToken);
      expect(newState.user).toEqual(mockUser);
      expect(newState.loading).toBe(false);
    });
  });

  describe("disableMockAuth action", () => {
    it("should clear mock state and load from localStorage", () => {
      store.dispatch(enableMockAuth());
      expect((store.getState() as any).auth.user).toEqual(mockUser);

      localStorage.setItem("access_token", "real-token");
      localStorage.setItem("refresh_token", "real-refresh-token");

      store.dispatch(disableMockAuth());

      const newState = (store.getState() as any).auth;
      expect(newState.accessToken).toBe("real-token");
      expect(newState.refreshToken).toBe("real-refresh-token");
      expect(newState.user).toBeNull();
      expect(newState.loading).toBe(true);
    });

    it("should handle empty localStorage gracefully", () => {
      store.dispatch(enableMockAuth());
      store.dispatch(disableMockAuth());

      const newState = (store.getState() as any).auth;
      expect(newState.accessToken).toBeNull();
      expect(newState.refreshToken).toBeNull();
      expect(newState.user).toBeNull();
      expect(newState.loading).toBe(false);
    });
  });

  describe("Mock data validation", () => {
    it("should have valid mock user data", () => {
      expect(mockUser).toBeDefined();
      expect(mockUser.id).toBe("mock-user-id");
      expect(mockUser.email).toBe("dev@example.com");
      expect(mockUser.firstName).toBe("Developer");
      expect(mockUser.lastName).toBe("User");
    });

    it("should have valid mock tokens", () => {
      expect(mockTokens).toBeDefined();
      expect(mockTokens.accessToken).toBe("mock-access-token-for-development");
      expect(mockTokens.refreshToken).toBe(
        "mock-refresh-token-for-development"
      );
    });
  });
});
