import { Box } from "@mui/material";

function AppLayout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {children}
    </Box>
  );
}

export default AppLayout;
