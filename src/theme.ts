/**
 * @file theme.ts
 * @description
 * This file defines the custom MUI theme used across the app.
 * The theme includes a manually crafted dark color palette,
 * typography inspired by modern design systems like shadcn/ui,
 * and consistent overrides for core MUI components like buttons, cards, and text fields.
 *
 * Key customizations:
 * - Dark mode palette with soft contrasts and muted backgrounds
 * - Tailored typography for readability and clean layout
 * - Reusable border radius and component overrides
 * - Global `fadeIn` keyframe animation used by various UI elements
 */

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f4f4f5",
      light: "#fafafa",
      dark: "#e4e4e7",
      contrastText: "#09090b",
    },
    background: {
      default: "#09090b",
      paper: "#1a1a1a",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    divider: "rgba(255, 255, 255, 0.08)",
    action: {
      hover: "rgba(255, 255, 255, 0.05)",
      selected: "rgba(255, 255, 255, 0.08)",
    },
  },
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.875rem",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: "6px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "8px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          height: "24px",
        },
      },
    },
  },
});

export default theme;
