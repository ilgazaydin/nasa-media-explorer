/**
 * @file LoginPage.tsx
 * @description User login page using Redux Toolkit and React Router.
 *
 * Renders a login form with prefilled test credentials for development purposes.
 * Handles form submission by dispatching a login action and redirects on success.
 *
 * Features:
 * - Controlled inputs for email and password
 * - Error and success handling
 * - Loading indicator during authentication
 * - Redirects to the originating route after successful login
 * - Link to registration page 
 *
 * Hooks:
 * - `useAppDispatch()` for dispatching the login action
 * - `useNavigate()` and `useLocation()` for post-login redirection
 */

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/app/hooks";
import { login } from "@/features/auth/store/authSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { loginSchema, LoginFormData } from "../validation/authValidation";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const result = await dispatch(login(data));

    if (login.fulfilled.match(result)) {
      setSuccess(true);
      navigate(from, { replace: true });
    } else {
      setServerError(result.payload || "Login failed.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box width="100%">
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={600}>
            Sign In
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...registerField("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isSubmitting}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              {...registerField("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={20} />}
            >
              {isSubmitting || success ? "Logging in..." : "Login"}
            </Button>

            {serverError && <Alert severity="error">{serverError}</Alert>}
          </Box>
        </form>

        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary">
            Don’t have an account?{" "}
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
