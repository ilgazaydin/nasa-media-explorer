/**
 * @file AuthLayout.tsx
 * @description Layout component that wraps authenticated routes.
 *
 * Ensures the user is authenticated before rendering protected content.
 * Redirects to the login page if no token is present.
 * While loading or fetching user data, displays a loading spinner.
 * Once authenticated, renders the `AppHeader` and nested route content via `Outlet`.
 *
 * Hooks:
 * - `useAppSelector()` to access authentication state
 * - `useAppDispatch()` to trigger user profile fetching
 * - `useEffect()` to fetch user data if a token exists but the user is not yet loaded
 *
 * @component
 * @returns {JSX.Element} A layout component for authenticated pages
 */

import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { fetchMe } from "@/features/auth/store/authSlice";
import AppHeader from "@/components/layout/AppHeader";
import { Box, CircularProgress } from "@mui/material";
import { config } from "@/config";

const AuthLayout = () => {
  const dispatch = useAppDispatch();
  const { accessToken, user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (config.mockAuth) {
      return;
    }

    if (accessToken && !user) {
      dispatch(fetchMe());
    }
  }, [accessToken, user, dispatch]);

  if (!accessToken) return <Navigate to="/login" replace />;
  if (loading || (accessToken && !user)) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
};

export default AuthLayout;
