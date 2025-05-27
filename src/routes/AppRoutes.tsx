/**
 * @file AppRoutes.tsx
 * @description Combines and renders all application routes, including public and authenticated sections.
 *
 * Includes:
 * - `AuthRoutes`: Routes for login and registration (public access)
 * - `MediaRoutes`: Routes for media search, detail, and favourites (protected access)
 *
 * @component
 * @returns {JSX.Element} Top-level route configuration for the application
 */

import { MediaRoutes } from "@/features/media/routes/MediaRoutes";
import { AuthRoutes } from "@/features/auth/routes/AuthRoutes";

const AppRoutes = () => {
  return (
    <>
      <AuthRoutes />
      <MediaRoutes />
    </>
  );
};

export default AppRoutes;
