/**
 * @file main.tsx
 * @description Entry point for the React application.
 *
 * Wraps the root `<App />` component with essential global providers:
 * - React StrictMode for highlighting potential problems
 * - MUI's ThemeProvider and CssBaseline for styling
 * - StoreProvider for application-wide state management
 *
 * Uses React 18's `createRoot` API to bootstrap the app.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { StoreProvider } from "./app/StoreProvider.tsx";
import App from "./App.tsx";
import theme from "./theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StoreProvider>
        <App />
      </StoreProvider>
    </ThemeProvider>
  </StrictMode>
);
