/**
 * @file AppHeader.tsx
 * @description
 * Top-level application header component using MUI's AppBar.
 *
 * Features:
 * - Responsive site title (hidden on xs screens)
 * - Navigation icons for Search and Favourites, highlighted when active
 * - Simple mock authentication with login/logout toggle
 * - Displays a welcome message when a user is logged in
 *
 * Hooks:
 * - `useLocation()` to determine current route and apply active icon styles
 * - `useAuthContext()` to manage and display auth state
 */

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const AppHeader = () => {
  const location = useLocation();
  const { user, login, logout } = useAuthContext();
  const handleAuthClick = () => {
    if (user) logout();
    else login();
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ mb: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography
            variant="h6"
            onClick={() => (window.location.href = "/")}
            sx={{
              display: { xs: "none", sm: "block" },
              textDecoration: "none",
              color: "inherit",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            NASA Media Explorer
          </Typography>

          {user && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: { xs: "none", sm: "block" },
                  borderColor: "rgba(255, 255, 255, 0.2)",
                }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Welcome {user.name}
              </Typography>
            </>
          )}
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            component={RouterLink}
            to="/"
            color={location.pathname === "/" ? "primary" : "default"}
          >
            <SearchIcon />
          </IconButton>

          <IconButton
            component={RouterLink}
            to="/favourites"
            color={location.pathname === "/favourites" ? "primary" : "default"}
          >
            <FavoriteBorderIcon />
          </IconButton>

          <Button
            onClick={handleAuthClick}
            color="inherit"
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            {user ? "Logout" : "Login"}
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
