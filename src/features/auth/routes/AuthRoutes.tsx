/**
 * @file AuthRoutes.tsx
 * @description Defines authentication-related routes within a shared public layout.
 *
 * Routes:
 * - `/login`: Displays the login form
 * - `/register`: Displays the registration form
 * - `/verify-email`: Displays the email verification page
 *
 * All routes are nested under `PublicLayout`, which provides a consistent layout
 * for unauthenticated pages.
 *
 * @component
 * @returns {JSX.Element} Route configuration for authentication pages
 */

import { Route, Routes } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>
    </Routes>
  );
};
