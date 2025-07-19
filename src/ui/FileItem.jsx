import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
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

function FileItem({
  fileId,
  fileType,
  text,
  singleClick,
  doubleClick,
  onEditFileName,
}) {
  const Icon = getIconForFileType(fileType);
  const clickTimeout = useRef(null);
  const [editingName, setEditingName] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const nameEditor = useRef(null);
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

  const handleEditName = (e) => {
    e.stopPropagation();
    setNewFileName(text);
    setEditingName(true);
  };

  const handleFormChange = (e) => {
    setNewFileName(e.target.value);
  };

  // close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (nameEditor.current && !nameEditor.current.contains(event.target)) {
        if (newFileName?.length > 0) {
          onEditFileName(fileId, newFileName);
        }
        setEditingName(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fileId, newFileName, onEditFileName]);

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
        <Icon fontSize="inherit" sx={{ color: "rgb(52 118 187)" }} />
      </Box>
      <Box
        height={48}
        overflow="auto"
        textAlign="center"
        ref={nameEditor}
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
        {editingName ? (
          <TextField
            size="small"
            autoFocus
            onChange={handleFormChange}
            value={newFileName}
            slotProps={{
              htmlInput: {
                style: {
                  fontSize: "0.875rem", // MUI 'body2' is 14px = 0.875rem
                  lineHeight: 1.43,
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  hyphens: "auto",
                },
              },
            }}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{
              overflowWrap: "break-word",
              wordBreak: "break-word",
              hyphens: "auto",
            }}
            onClick={handleEditName}
          >
            {text}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default FileItem;
