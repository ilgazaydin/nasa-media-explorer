/**
 * @file RegisterPage.tsx
 * @description User registration page using Redux Toolkit and React Router.
 *
 * Renders a registration form that collects user details (first name, last name, email, password).
 * Handles form submission by dispatching the registration action and navigates to login on success.
 *
 * Features:
 * - Controlled inputs for user credentials
 * - Success and error handling with alerts
 * - Loading state with spinner
 * - Redirect to login after successful registration
 * - Link to login page for existing users
 *
 * Hooks:
 * - `useAppDispatch()` for dispatching the register action
 * - `useNavigate()` for redirecting after registration
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
import { register } from "@/features/auth/store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { registerSchema, RegisterFormData } from "../validation/authValidation";

// 🧾 Zod validation schema

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    const result = await dispatch(register(data));
    if (register.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setServerError(result.payload || "Registration failed.");
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
            Sign Up
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="First Name"
              fullWidth
              {...registerField("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              disabled={isSubmitting}
            />
            <TextField
              label="Last Name"
              fullWidth
              {...registerField("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              disabled={isSubmitting}
            />
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
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>

            {serverError && <Alert severity="error">{serverError}</Alert>}
            {success && (
              <Alert severity="success">Registration successful!</Alert>
            )}
          </Box>
        </form>

        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
