/**
 * @file App.tsx
 * @description The root component of the application.
 *
 * Sets up global providers including React Query's QueryClientProvider,
 * React Router's BrowserRouter, and global styles with MUI's CssBaseline.
 * Delegates route definitions to the AppRoutes component.
 *
 * @component
 * @returns {JSX.Element} The top-level component wrapping the application with providers and routing.
 */

import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CssBaseline from "@mui/material/CssBaseline";
import AppRoutes from "@/routes/AppRoutes";

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
