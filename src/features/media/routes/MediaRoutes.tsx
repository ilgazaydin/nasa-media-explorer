/**
 * @file MediaRoutes.tsx
 * @description Defines media-related routes within an authenticated layout.
 *
 * Routes:
 * - `/`           → Media search page
 * - `/detail/:id` → Media detail view
 * - `/favourites` → User's favourite media items
 *
 * All routes are nested under `AuthLayout`, which ensures they are only accessible
 * to authenticated users.
 *
 * @component
 * @returns {JSX.Element} Route configuration for media-related pages
 */

import { Route, Routes } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import MediaSearchPage from "../pages/MediaSearchPage";
import MediaDetailPage from "../pages/MediaDetailPage";
import MediaFavouritesPage from "../pages/MediaFavouritesPage";

export const MediaRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<MediaSearchPage />} />
        <Route path="/detail/:id" element={<MediaDetailPage />} />
        <Route path="/favourites" element={<MediaFavouritesPage />} />
      </Route>
    </Routes>
  );
};
