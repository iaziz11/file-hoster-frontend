import React, { useContext, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContext } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { signUp } from "../firebase/signUp";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import Navbar from "../ui/Navbar";

export default function RegisterPage() {
  // state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const { openToast } = useContext(ToastContext);
  const navigate = useNavigate();

  // event handlers

  // form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "password") {
      if (value.length > 0 && value.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else {
        setPasswordError("");
      }
      if (value === form.confirmPassword) {
        setConfirmPasswordError("");
      }
    } else if (name === "confirmPassword")
      if (
        form.password.length > 0 &&
        value.length > 0 &&
        form.password !== value
      ) {
        setConfirmPasswordError("Passwords must match");
      } else {
        setConfirmPasswordError("");
      }
  };

  // submit register
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      openToast("error", "Please make sure passwords match");
      return;
    }
    setIsRegistering(true);
    const res = await signUp(form.email, form.password, form.fullName);
    if (res.success) {
      navigate("/");
    } else {
      openToast("error", res.error);
    }
    setIsRegistering(false);
  };

  return (
    <>
      <Navbar />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: "100%",
            maxWidth: 400,
            boxShadow: `0 4px 12px rgba(0, 0, 255, 0.2)`,
            border: "1px solid rgba(0, 0, 255, 0.2)",
            borderRadius: 2,
          }}
        >
          <Box display="flex" justifyContent="center">
            <LockOutlineIcon
              sx={{
                fontSize: 40,
                mb: 1,
                color: "primary.main",
              }}
            />
          </Box>
          <Typography variant="h5" mb={3} textAlign="center">
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              type="text"
              margin="normal"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              margin="normal"
              value={form.email}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={form.password}
              onChange={handleChange}
              error={!!passwordError}
              helperText={passwordError}
              required
              slotProps={{
                htmlInput: { minLength: 6 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              margin="normal"
              value={form.confirmPassword}
              onChange={handleChange}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              required
              slotProps={{
                htmlInput: { minLength: 6 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirm((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              loading={isRegistering}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
}
