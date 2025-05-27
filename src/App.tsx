/**
 * @file App.tsx
 * @description The root component of the application.
 *
 * It sets up the global providers including React Query's QueryClientProvider
 * and React Router's BrowserRouter, along with global styles via MUI's CssBaseline.
 * Routes are defined for the main search page, media detail view, and favourites page.
 *
 * @component
 * @returns {JSX.Element} The top-level component containing the app layout and routes.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CssBaseline from "@mui/material/CssBaseline";

import AppHeader from "@/components/layout/AppHeader";
import MediaSearchPage from "@/features/media/pages/MediaSearchPage";
import MediaDetailPage from "@/features/media/pages/MediaDetailPage";
import MediaFavouritesPage from "@/features/media/pages/MediaFavouritesPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route path="/" element={<MediaSearchPage />} />
          <Route path="/detail/:id" element={<MediaDetailPage />} />
          <Route path="/favourites" element={<MediaFavouritesPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
