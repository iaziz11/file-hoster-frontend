import { ToastContext } from "../contexts/ToastContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { logout } from "../firebase/logout";
import { useContext } from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import logo from "../assets/logo.png";
import Box from "@mui/material/Box";

export default function Navbar() {
  const { user: loggedInUser, loading: isLoadingLoggedInUser } = useAuthUser();
  const { openToast } = useContext(ToastContext);
  const navigate = useNavigate();

  // logout
  const handleLogout = async () => {
    const res = await logout();
    if (res) {
      navigate("/login");
    } else {
      openToast("error", "Error logging out");
    }
  };

  if (isLoadingLoggedInUser) return;
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#FAFAFA",
        boxShadow: "0px 4px 10px rgba(0, 0, 255, 0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/">
          <Box
            component="img"
            sx={{
              height: 40,
              marginRight: 2,
            }}
            alt="Logo"
            src={logo}
          />
        </Link>
        <Box sx={{ display: "flex" }} gap={2}>
          {loggedInUser?.role === "admin" && (
            <Link to="/admin">
              <Button variant="outlined" color="primary">
                Admin
              </Button>
            </Link>
          )}
          {loggedInUser && (
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          )}

          {!loggedInUser && (
            <Link to="/register">
              <Button variant="outlined" color="primary">
                Register
              </Button>
            </Link>
          )}
          {!loggedInUser && (
            <Link to="/login">
              <Button variant="contained" color="primary">
                Login
              </Button>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
    // </Box>
  );
}
