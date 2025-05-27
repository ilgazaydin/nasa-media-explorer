import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Button,
} from "@mui/material";
import { useAppDispatch } from "@/app/hooks";
import { verifyEmail } from "@/features/auth/store/authSlice";

const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    dispatch(verifyEmail(token))
      .unwrap()
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [params, dispatch]);

  return (
    <Container maxWidth="sm" sx={{ pt: 10 }}>
      <Box textAlign="center">
        {status === "loading" && <CircularProgress />}
        {status === "success" && (
          <>
            <Alert severity="success">
              Your email has been verified successfully
            </Alert>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{ mt: 3 }}
            >
              Go to Login
            </Button>
          </>
        )}
        {status === "error" && (
          <Alert severity="error">
            Invalid or expired verification link
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default VerifyEmailPage;
