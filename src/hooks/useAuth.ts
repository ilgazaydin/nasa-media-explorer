/**
 * @file useAuth.ts
 * @description A simple mock authentication hook to simulate login/logout state.
 *
 * @returns {{
 *   user: { name: string } | null;
 *   login: (name?: string) => void;
 *   logout: () => void;
 *   isAuthenticated: boolean;
 * }}
 * - `user`: the current authenticated user, or `null` if not logged in
 * - `login`: function to simulate logging in a user (defaults to "Mock User")
 * - `logout`: function to simulate logging out
 * - `isAuthenticated`: boolean flag indicating if a user is currently logged in
 */

import { useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<{ name: string } | null>({
    name: "Mock User",
  });

  const login = (name: string = "Mock User") => {
    setUser({ name });
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, logout, isAuthenticated: !!user };
};
