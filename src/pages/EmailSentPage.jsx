import { Box, Button, Paper, Typography } from "@mui/material";
import Navbar from "../ui/Navbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";

function EmailSentPage() {
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
            maxWidth: 500,
            boxShadow: `0 4px 12px rgba(0, 0, 255, 0.2)`,
            border: "1px solid rgba(0, 0, 255, 0.2)",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Box display="flex" justifyContent="center">
            <CheckCircleIcon sx={{ fontSize: 40, mb: 1, color: "green" }} />
          </Box>
          <Typography variant="h5" mb={1}>
            Email Sent
          </Typography>
          <Typography variant="body1">
            A link has been sent to your email to reset your password.
          </Typography>
          <Typography variant="body1">
            If you don’t see the email, check your spam or junk folder.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/login"
            sx={{ mt: 3 }}
          >
            Back to Login
          </Button>
        </Paper>
      </Box>
    </>
  );
}

export default EmailSentPage;
