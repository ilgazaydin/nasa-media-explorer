/**
 * @file main.tsx
 * @description Entry point for the React application.
 *
 * Wraps the root `<App />` component with essential global providers:
 * - React StrictMode for highlighting potential problems
 * - MUI's ThemeProvider and CssBaseline for styling
 * - AuthProvider for basic authentication state
 *
 * Uses React 18's `createRoot` API to bootstrap the app.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "@/context/AuthContext";
import App from "./App.tsx";
import theme from "./theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
