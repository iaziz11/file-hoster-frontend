import { Box } from "@mui/material";

function MainBox({ children, variant }) {
  return (
    <Box display="flex" justifyContent="center">
      <Box
        sx={{
          marginTop: "40px",
          border: "1px solid rgba(0, 0, 255, 0.3)",
          borderRadius: "5px",
          boxShadow: "0 0 5px rgba(0, 0, 255, 0.3)",
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "width 300ms ease-in",
          ...(variant === "narrow"
            ? { width: { xs: "90%", md: "60%" } }
            : variant === "narrower"
            ? { width: { xs: "90%", md: "40%" } }
            : { width: { xs: "90%", md: "80%" } }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default MainBox;
