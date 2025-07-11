import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { ToastContext } from "../contexts/ToastContext";
import { fetchFolder } from "../firebase/fetchFolder";
import { useContext, useState } from "react";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DescriptionIcon from "@mui/icons-material/Description";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import FolderIcon from "@mui/icons-material/Folder";
import CloseIcon from "@mui/icons-material/Close";

function PopupTab({
  open,
  item,
  onClose,
  setActiveFolder,
  onDelete,
  loggedInUser,
}) {
  const openableFileTypes = [
    "text/html",
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "text/plain",
    "application/json",
    "application/xml",
    "text/xml",
    "audio/mpeg",
    "video/mp4",
  ];

  const [isDownloading, setIsDownloading] = useState(false);

  const { openToast } = useContext(ToastContext);

  // open file in new tab
  const handleClickOpen = async () => {
    if (!item) return;
    if (item.type === "folder") {
      setActiveFolder(item?.id, item?.type, item?.fileName);
      onClose();
    } else {
      const res = await fetch(`http://localhost:3000/download/${item.id}`);
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    }
  };

  // download file or folder
  const handleDownload = async () => {
    if (!item) return;
    setIsDownloading(true);
    if (item.type === "folder") {
      try {
        const downloadFiles = await fetchFolder(item.id, loggedInUser);
        const reqBody = {
          folderName: item.fileName,
          files: [],
        };
        downloadFiles.forEach((dfile) => {
          reqBody.files.push([dfile.id, dfile.path]);
        });
        const res = await fetch(`http://localhost:3000/download/folder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqBody),
        });
        const archiveBlob = await res.blob();
        const url = URL.createObjectURL(archiveBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${item.fileName}.zip`;
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        openToast("success", "Folder successfully downloaded");
      } catch (e) {
        console.error(e.message);
        openToast("error", "Problem downloading folder");
      }
    } else {
      try {
        const res = await fetch(`http://localhost:3000/download/${item.id}`);
        const data = await res.json();
        if (data.url) {
          const s3File = await fetch(data.url);
          const blob = await s3File.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = item.fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
          openToast("success", "File successfully downloaded");
        }
      } catch (e) {
        console.error(e.message);
        openToast("error", "Problem downloading file");
      }
    }

    setIsDownloading(false);
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

  const isFolder = item?.type === "folder";

  // delete item
  const handleDelete = () => {
    onDelete();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      ModalProps={{
        BackdropProps: {
          sx: {
            backgroundColor: "transparent",
          },
        },
      }}
      slotProps={{
        paper: {
          sx: {
            maxWidth: {
              xs: "100%",
              sm: 400,
              md: 500,
            },
            borderLeft: "1px solid rgba(0, 0, 255, 0.1)",
            borderRadius: "5px",
            boxShadow: "0 0 5px rgba(0, 0, 255, 0.3)",
          },
        },
      }}
    >
      {item && (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ height: "40%", marginBottom: "10px" }}>
            {isFolder ? (
              <FolderIcon
                sx={{
                  width: "100%",
                  height: "100%",
                  color: "rgb(52 118 187)",
                }}
              />
            ) : (
              <DescriptionIcon
                sx={{
                  width: "100%",
                  height: "100%",
                  color: "rgb(52 118 187)",
                }}
              />
            )}
          </Box>
          <Divider
            variant="middle"
            sx={{
              "&::before, &::after": {
                borderColor: "rgba(0, 0, 255, 0.3)",
              },
            }}
          >
            <Typography sx={{ color: "rgba(0, 0, 255, 0.5)" }}>
              Details
            </Typography>
          </Divider>
          <Box
            sx={{
              height: "30%",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <List dense sx={{ overflowX: "auto" }}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        display: "block",
                        width: "100%",
                      }}
                    >
                      {isFolder ? "Folder" : "File"} Name: {item.fileName}
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText>
                  Date {isFolder ? "Created" : "Uploaded"}:{" "}
                  {new Date(item.dateUploaded).toLocaleString()}
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  {isFolder ? "Created" : "Uploaded"} By:{" "}
                  {item.uploadedBy.fullName}
                </ListItemText>
              </ListItem>
              {isFolder && (
                <ListItem>
                  <ListItemText>Items: {item.subitems}</ListItemText>
                </ListItem>
              )}
              <ListItem>
                <ListItemText>Size: {formatBytes(item.fileSize)}</ListItemText>
              </ListItem>
              {!isFolder && (
                <ListItem>
                  <ListItemText>Content Type: {item.contentType}</ListItemText>
                </ListItem>
              )}
              <ListItem>
                <ListItemText sx={{ textTransform: "capitalize" }}>
                  Permissions: {item.permission}
                </ListItemText>
              </ListItem>
            </List>
          </Box>
          <Divider
            variant="middle"
            sx={{
              "&::before, &::after": {
                borderColor: "rgba(0, 0, 255, 0.3)",
              },
            }}
          >
            <Typography sx={{ color: "rgba(0, 0, 255, 0.5)" }}>
              Actions
            </Typography>
          </Divider>
          <Box
            sx={{
              height: "30%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
              margin: "auto",
              paddingTop: 3,
              gap: 2,
            }}
          >
            {(isFolder || openableFileTypes.includes(item.contentType)) && (
              <Button
                onClick={handleClickOpen}
                fullWidth
                variant="outlined"
                endIcon={isFolder ? <OpenInBrowserIcon /> : <OpenInNewIcon />}
              >
                Open
              </Button>
            )}
            <Button
              fullWidth
              variant="contained"
              loading={isDownloading}
              endIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download
            </Button>
            {loggedInUser.role != "field" && (
              <Button
                fullWidth
                variant="contained"
                color="error"
                endIcon={<DeleteForeverIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
}

export default PopupTab;
