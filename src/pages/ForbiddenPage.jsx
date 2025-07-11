import { Box, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Navbar from "../ui/Navbar";

const ForbiddenPage = () => {
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
            <RemoveCircleOutlineIcon sx={{ fontSize: 80, color: "red" }} />
          </Box>
          <Typography variant="h5" mb={1}>
            403 - Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth="sm">
            You don’t have permission to view this page. If you believe this is
            a mistake, please contact your administrator.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/"
            sx={{ mt: 3 }}
          >
            Back to Main Page
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default ForbiddenPage;
