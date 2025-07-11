import { TableCell, TableRow } from "@mui/material";
import { useRef } from "react";

function ListFileItem({
  singleClick,
  doubleClick,
  icon,
  text,
  size,
  uploadedBy,
}) {
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

  // format size to make readable
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const value = bytes / Math.pow(k, i);
    return `${parseFloat(value.toFixed(decimals))} ${sizes[i]}`;
  }
  return (
    <TableRow
      sx={{
        transition: "box-shadow 150ms ease-in",
        "&:hover": {
          cursor: "pointer",
          boxShadow: "0px 0px 4px rgba(0, 0, 255, 0.3)",
        },
      }}
      onClick={handleClickEvents}
    >
      <TableCell sx={{ borderBottom: "none" }}>{icon}</TableCell>
      <TableCell
        sx={{
          whiteSpace: "nowrap",
          overflowX: "auto",
          borderBottom: "none",
          maxWidth: 300,
        }}
      >
        {text}
      </TableCell>
      <TableCell sx={{ borderBottom: "none" }}>{uploadedBy}</TableCell>
      <TableCell sx={{ borderBottom: "none" }}>{formatBytes(size)}</TableCell>
    </TableRow>
  );
}

export default ListFileItem;
