/**
 * @file PublicLayout.tsx
 * @description Layout component for public (unauthenticated) routes.
 *
 * Redirects authenticated users away from public pages (e.g. login, register) to the main app.
 * Otherwise, renders the nested public route content via `Outlet`.
 *
 * Hooks:
 * - `useAppSelector()` to access authentication state
 *
 * @component
 * @returns {JSX.Element} A layout wrapper for public routes
 */

import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

const PublicLayout = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!token && !!user;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicLayout;
