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
import { getAuth } from "firebase/auth";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DescriptionIcon from "@mui/icons-material/Description";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import FolderIcon from "@mui/icons-material/Folder";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

function PopupTab({
  open,
  item,
  onClose,
  setActiveFolder,
  onDelete,
  onEdit,
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

  const editableFileTypes = [
    // Word Processing
    "docx",
    "odt",
    "txt",
    "rtf",
    "html",
    "htm",
    "docxf",

    // Spreadsheets
    "xlsx",
    "ods",
    "csv",
    "xls",

    // Presentations
    "pptx",
    "odp",
    "ppsx",
    "ppt",
  ];

  const [isDownloading, setIsDownloading] = useState(false);

  const { openToast } = useContext(ToastContext);

  const fileType = item?.fileName.split(".").at(-1);

  // open file in new tab
  const handleClickOpen = async () => {
    if (!item) return;
    if (item.type === "folder") {
      setActiveFolder(item?.id, item?.type, item?.contentType, item?.fileName);
      onClose();
    } else {
      const newTab = window.open("", "_blank");
      const firebaseUser = getAuth().currentUser;
      const firebaseToken = await firebaseUser.getIdToken();
      const res = await fetch(
        `https://mpower-host.duckdns.org/download/${item.id}`,
        {
          headers: {
            Authorization: `Bearer ${firebaseToken}`,
          },
        }
      );
      const data = await res.json();
      if (data.url) {
        newTab.location = data.url;
      } else {
        newTab.close();
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
        const firebaseUser = getAuth().currentUser;
        const firebaseToken = await firebaseUser.getIdToken();
        const res = await fetch(
          `https://mpower-host.duckdns.org/download/folder`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${firebaseToken}`,
            },
            body: JSON.stringify(reqBody),
          }
        );
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
        const firebaseUser = getAuth().currentUser;
        const firebaseToken = await firebaseUser.getIdToken();
        const res = await fetch(
          `https://mpower-host.duckdns.org/download/${item.id}`,
          {
            headers: {
              Authorization: `Bearer ${firebaseToken}`,
            },
          }
        );
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
                  {isFolder ? "Date Created" : "Last Updated"}:{" "}
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
              {loggedInUser.role != "field" &&
                loggedInUser.role != "Project Manager" && (
                  <ListItem>
                    <ListItemText sx={{ textTransform: "capitalize" }}>
                      Permissions: {item.permission}
                    </ListItemText>
                  </ListItem>
                )}
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
              marginBottom: 2,
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
            {editableFileTypes.includes(fileType) && (
              <Button
                onClick={onEdit}
                fullWidth
                variant="outlined"
                endIcon={<EditIcon />}
              >
                Edit
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
                onClick={onDelete}
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
