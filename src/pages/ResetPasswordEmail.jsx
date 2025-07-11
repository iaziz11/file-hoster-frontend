import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { resetPassword } from "../firebase/resetPassword";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import Navbar from "../ui/Navbar";

function ResetPasswordEmail() {
  // state
  const [inputEmail, setInputEmail] = useState("");
  const navigate = useNavigate();

  // submit reset password request
  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(inputEmail);
    navigate("/emailSent");
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
            <EmailIcon
              sx={{
                fontSize: 40,
                mb: 1,
                color: "primary.main",
              }}
            />
          </Box>
          <Typography variant="h5" mb={3} textAlign="center">
            Password Reset
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              margin="normal"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Send Email
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
}

export default ResetPasswordEmail;
