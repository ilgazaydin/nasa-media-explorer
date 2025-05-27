/**
 * @file AuthContext.tsx
 * @description
 * Provides a simple mock authentication context using React Context API and a custom `useAuth` hook.
 *
 * This setup allows access to a shared authentication state (user, login, logout) across the app.
 * It can be extended to support real auth flows later on (e.g. Supabase, Firebase, Auth0).
 *
 * Usage:
 * Wrap your app in `<AuthProvider>` and use `useAuthContext()` to access the auth state.
 *
 * Notes:
 * - Currently uses a mock user object.
 * - Throws an error if `useAuthContext` is called outside of the provider.
 */

import { createContext, useContext } from "react";
import { useAuth } from "@/hooks/useAuth";

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be inside AuthProvider");
  return ctx;
};
