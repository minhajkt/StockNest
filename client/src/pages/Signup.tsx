import React, { useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/authValidation";
import { Card, SignInContainer } from "../themes/authStyles";
import AppTheme from "../themes/AppTheme";
import ColorModeSelect from "../themes/ColorModeSelect";
import { registerUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validate fields dynamically
    if (name === "name") {
      const { isValid, message } = validateName(value);
      setErrors((prev) => ({ ...prev, name: isValid ? "" : message }));
    } else if (name === "email") {
      const { isValid, message } = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: isValid ? "" : message }));
    } else if (name === "password") {
      const { isValid, message } = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: isValid ? "" : message }));
    } else if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === form.password ? "" : "Passwords do not match",
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate fields before submitting
    const nameValidation = validateName(form.name);
    const emailValidation = validateEmail(form.email);
    const passwordValidation = validatePassword(form.password);
    const passwordsMatch = form.password === form.confirmPassword;

    if (
      !nameValidation.isValid ||
      !emailValidation.isValid ||
      !passwordValidation.isValid ||
      !passwordsMatch
    ) {
      setErrors({
        name: nameValidation.message,
        email: emailValidation.message,
        password: passwordValidation.message,
        confirmPassword: passwordsMatch ? "" : "Passwords do not match",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(form.name, form.email, form.password);
      setLoading(false);
      if (result.success) {
        navigate("/login");
      } else {
        setErrors((prev) => ({
          ...prev,
          email: result.message || "Signup failed.",
        }));
      }
    } catch (error) {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        email: (error as Error).message || "Something went wrong.",
      }));
    }
  };

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
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 0 }}
          >
            <FormControl>
              <FormLabel>Name</FormLabel>
              <TextField
                error={!!errors.name}
                helperText={errors.name || " "}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
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
            <FormControl>
              <FormLabel>Confirm Password</FormLabel>
              <TextField
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword || " "}
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
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
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </Box>
          <Divider>or</Divider>
          <Typography sx={{ textAlign: "center" }}>
            Already a User?{" "}
            <Link href="/login" variant="body2">
              Log in
            </Link>
          </Typography>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
};

export default SignupPage;
