/**
 * @file AppHeader.tsx
 * @description
 * Top-level application header component using MUI's AppBar.
 *
 * Features:
 * - Responsive site title (hidden on xs screens)
 * - Navigation icons for Search and Favourites, highlighted when active
 * - Logout button shown only when user is authenticated
 * - Welcome message displaying the user's name when logged in
 *
 * Hooks:
 * - `useLocation()` to determine the current route and highlight active icons
 * - `useAppSelector()` to access authentication state from Redux
 * - `useAppDispatch()` to dispatch logout action
 * - `useNavigate()` to redirect after logout
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
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/store/authSlice";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { accessToken, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!accessToken && !!user;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
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
                Welcome {user.firstName} {user.lastName}
              </Typography>
            </>
          )}
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          {isAuthenticated && (
            <>
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
                color={
                  location.pathname === "/favourites" ? "primary" : "default"
                }
              >
                <FavoriteBorderIcon />
              </IconButton>

              <Button
                onClick={handleLogout}
                color="inherit"
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                Logout
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
