import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography, Snackbar, IconButton,
} from "@mui/material";
import { validateEmail, validatePassword } from "../utils/authValidation";
import { Card, SignInContainer } from "../themes/authStyles";
import AppTheme from "../themes/AppTheme";
import ColorModeSelect from "../themes/ColorModeSelect";
import { loginUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import { Close } from '@mui/icons-material'

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      const { isValid, message } = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: isValid ? "" : message }));
    } else if (name === "password") {
      const { isValid, message } = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: isValid ? "" : message }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailValidation = validateEmail(form.email);
    const passwordValidation = validatePassword(form.password);

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      setErrors({
        email: emailValidation.message,
        password: passwordValidation.message,
      });
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(form.email, form.password);
      setLoading(false);
      if (result.success) {
        localStorage.setItem("loginSuccessMessage", "Login successful!");
        navigate("/dashboard");
      } else {
        setErrors({ email: result.message || "Login failed.", password: "" });
      }
    } catch (error) {
      setLoading(false);
      setErrors({
        email: (error as Error).message || "Something went wrong.",
        password: "",
      });
    }
  };

  
  useEffect(() => {
    const message = localStorage.getItem("logout success");
    if (message) {
      setOpenSnackbar(true);
      setSnackbarMessage("Logout successful");
    }
  }, []);

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            textAlign="center"
            fontWeight="bold"
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 0 }}
          >
            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField
                error={!!errors.email}
                helperText={errors.email || " "}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <TextField
                error={!!errors.password}
                helperText={errors.password || " "}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </Box>
          <Divider>or</Divider>
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" variant="body2">
              Sign up
            </Link>
          </Typography>
        </Card>
      </SignInContainer>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={2000}
        message={snackbarMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpenSnackbar(false)}>
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </AppTheme>
  );
};

export default LoginPage;
