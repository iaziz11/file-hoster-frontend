import { TableCell, TableRow } from "@mui/material";
import { useRef } from "react";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MovieIcon from "@mui/icons-material/Movie";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ArchiveIcon from "@mui/icons-material/Archive";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";

const fileTypeIconMap = {
  // Images
  "image/jpeg": ImageIcon,
  "image/png": ImageIcon,
  "image/gif": ImageIcon,
  "image/webp": ImageIcon,
  "image/svg+xml": ImageIcon,

  // PDFs
  "application/pdf": PictureAsPdfIcon,

  // Word Documents
  "application/msword": DescriptionIcon,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    DescriptionIcon,

  // Excel Files
  "application/vnd.ms-excel": DescriptionIcon,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    DescriptionIcon,

  // PowerPoint Files
  "application/vnd.ms-powerpoint": DescriptionIcon,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    DescriptionIcon,

  // Text Files
  "text/plain": DescriptionIcon,
  "text/html": DescriptionIcon,
  "text/css": DescriptionIcon,
  "application/json": DescriptionIcon,
  "application/javascript": DescriptionIcon,

  // Video
  "video/mp4": MovieIcon,
  "video/quicktime": MovieIcon,
  "video/x-msvideo": MovieIcon,
  "video/webm": MovieIcon,

  // Audio
  "audio/mpeg": MusicNoteIcon,
  "audio/wav": MusicNoteIcon,
  "audio/ogg": MusicNoteIcon,

  // Archives
  "application/zip": ArchiveIcon,
  "application/x-rar-compressed": ArchiveIcon,
  "application/x-7z-compressed": ArchiveIcon,
  "application/gzip": ArchiveIcon,

  folder: FolderIcon,
};

// Fallback function
function getIconForFileType(mimeType) {
  return fileTypeIconMap[mimeType] || DescriptionIcon;
}

function ListFileItem({
  singleClick,
  doubleClick,
  fileType,
  text,
  size,
  uploadedBy,
}) {
  const Icon = getIconForFileType(fileType);
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
      <TableCell
        sx={{ borderBottom: "none", display: "flex", alignItems: "center" }}
      >
        <Icon fontSize="medium" sx={{ color: "rgb(52 118 187)" }} />
      </TableCell>
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
