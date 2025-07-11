import { Box, Paper, Typography } from "@mui/material";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import Navbar from "../ui/Navbar";

export default function PendingApprovalPage() {
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
            textAlign: "center",
          }}
        >
          <Box display="flex" justifyContent="center">
            <HourglassBottomIcon
              sx={{ fontSize: 40, mb: 1, color: "primary.main" }}
            />
          </Box>
          <Typography variant="h5" mb={1}>
            Awaiting Approval
          </Typography>
          <Typography variant="body1">
            Your account is currently under review.
            <br />
            An admin will approve your access shortly.
          </Typography>
        </Paper>
      </Box>
    </>
  );
}
