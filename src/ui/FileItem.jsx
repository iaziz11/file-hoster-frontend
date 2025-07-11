import { Box, Typography } from "@mui/material";
import { useRef } from "react";

function FileItem({ icon, text, singleClick, doubleClick }) {
  const clickTimeout = useRef(null);

  const handleClickEvents = () => {
    if (clickTimeout.current) {
      // double click detected
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      doubleClick();
    } else {
      // start single click timer
      clickTimeout.current = setTimeout(() => {
        singleClick();
        clickTimeout.current = null;
      }, 200);
    }
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width={96}
      sx={{
        padding: "0 1px",
        border: "1px solid transparent",
        transition:
          "border 0.3s ease, border-radius 0.4s ease, boxShadow 0.2s ease-in-out",
        "&:hover": {
          border: "1px solid rgba(0, 0, 255, 0.3)",
          borderRadius: "5px",
          boxShadow: "0 0 5px rgba(0, 0, 255, 0.3)",
        },
      }}
    >
      <Box
        fontSize={64}
        onClick={handleClickEvents}
        sx={{
          "&:hover": {
            cursor: "pointer",
          },
        }}
      >
        {icon}
      </Box>
      <Box
        height={48}
        overflow="auto"
        textAlign="center"
        sx={{
          "&::-webkit-scrollbar": {
            width: 3,
            backgroundColor: "transparent",
          },
          "&:hover": {
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#aaa",
              borderRadius: 4,
            },
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            overflowWrap: "break-word",
            wordBreak: "break-word",
            hyphens: "auto",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
}

export default FileItem;
