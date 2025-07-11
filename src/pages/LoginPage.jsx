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
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "../contexts/ToastContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { login } from "../firebase/login";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import Navbar from "../ui/Navbar";

export default function LoginPage() {
  // state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // hooks

  const { user: loggedInUser, loading: isLoadingLoggedInUser } = useAuthUser();
  const { openToast } = useContext(ToastContext);

  const navigate = useNavigate();

  // event handlers

  // form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit login
  const handleSubmit = async (e) => {
    setIsLoggingIn(true);
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) {
      navigate("/");
      openToast("success", "Successfully logged in!");
    } else {
      openToast("error", res.error);
    }
    setIsLoggingIn(false);
  };

  // if user is already logged in, redirect to home
  useEffect(() => {
    if (!isLoadingLoggedInUser && loggedInUser) {
      navigate("/");
    }
  }, [isLoadingLoggedInUser, loggedInUser, navigate]);

  if (isLoadingLoggedInUser || loggedInUser) return;
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
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              margin="normal"
              required
              value={form.email}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              required
              value={form.password}
              onChange={handleChange}
              slotProps={{
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
            <Link to="/resetPassword" style={{ display: "inline-block" }}>
              <Typography sx={{ ml: "3px" }}>Forgot your password?</Typography>
            </Link>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              loading={isLoggingIn}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
}
