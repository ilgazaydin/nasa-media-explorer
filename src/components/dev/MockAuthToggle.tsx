/**
 * @file MockAuthToggle.tsx
 * @description Development component for toggling mock authentication mode
 *
 * This component should only be used in development environments.
 * It allows developers to quickly switch between real authentication
 * and mock authentication for testing purposes.
 */

import { useState } from "react";
import {
  Box,
  Switch,
  FormControlLabel,
  Paper,
  Typography,
  Chip,
  Alert,
  Fab,
  Popover,
} from "@mui/material";
import { DeveloperMode } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  enableMockAuth,
  disableMockAuth,
  logout,
} from "@/features/auth/store/authSlice";
import { config } from "@/config";

interface MockAuthToggleProps {
  visible?: boolean;
}

const MockAuthToggle = ({ visible = true }: MockAuthToggleProps) => {
  const dispatch = useAppDispatch();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const [isMockMode, setIsMockMode] = useState(config.mockAuth);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!visible || import.meta.env.PROD) {
    return null;
  }

  const handleFabClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const enableMock = event.target.checked;
    setIsMockMode(enableMock);

    if (enableMock) {
      dispatch(enableMockAuth());
    } else {
      dispatch(disableMockAuth());
      dispatch(logout());
    }
  };

  const isCurrentlyMocked = accessToken === "mock-access-token-for-development";
  const open = Boolean(anchorEl);

  return (
    <>
      <Fab
        size="small"
        color="warning"
        onClick={handleFabClick}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          width: 48,
          height: 48,
        }}
      >
        <DeveloperMode />
      </Fab>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        disableScrollLock={true}
        disableRestoreFocus={true}
        slotProps={{
          backdrop: {
            invisible: true,
          },
        }}
      >
        <Paper sx={{ p: 2, minWidth: 280, maxWidth: 320 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography variant="subtitle2" fontWeight={600}>
              Dev Tools
            </Typography>
            <Chip label="DEV" size="small" color="warning" variant="outlined" />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={isMockMode}
                onChange={handleToggle}
                color="primary"
              />
            }
            label="Mock Authentication"
            sx={{ mb: 1 }}
          />

          {isCurrentlyMocked && (
            <Alert severity="info" sx={{ mt: 1, fontSize: "0.75rem" }}>
              <Typography variant="caption" display="block">
                <strong>Mock User:</strong> {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" display="block">
                <strong>Email:</strong> {user?.email}
              </Typography>
            </Alert>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={1}
          >
            Toggle between real authentication and mock mode for testing.
          </Typography>
        </Paper>
      </Popover>
    </>
  );
};

export default MockAuthToggle;
