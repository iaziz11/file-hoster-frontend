import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCreateFolder } from "../hooks/useCreateFolder";
import { ToastContext } from "../contexts/ToastContext";
import { useUploadFile } from "../hooks/useUploadFile";
import { useContext, useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import ListFileItem from "./ListFileItem";
import FileItem from "./FileItem";

function FileDisplay({
  displayLoading,
  files,
  handleSingleClick,
  handleDoubleClick,
  root,
  rootData,
  loggedInUser,
  variant,
}) {
  const [isDragEnter, setIsDragEnter] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();

  const { mutateAsync: createFolder } = useCreateFolder();

  const { openToast, closeToast } = useContext(ToastContext);

  // upload file from drag-and-drop
  const handleFileUpload = async (ufile, rootInfo) => {
    await uploadFile({
      meta: {
        fileName: ufile.name,
        fileSize: ufile.size,
        permission: rootInfo.permission,
        contentType: ufile.type,
        parentFolder: rootInfo.id,
        uploadedBy: {
          uid: loggedInUser?.uid,
          fullName: loggedInUser?.fullName,
        },
        path: rootInfo.path + "/" + ufile.name,
        idPath: [...rootInfo.idPath, rootInfo.id],
      },
      file: ufile,
    });
  };

  // drag over with file
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragEnter(true);
  };

  // drop file into area
  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragEnter(false);
    const items = event.dataTransfer.items;
    openToast("info", `Uploading item${items.length === 1 ? "" : "s"}`, false);

    const entries = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file") {
        const entry = item.webkitGetAsEntry();
        if (entry) entries.push(entry);
      }
    }

    for (const entry of entries) {
      await traverseFileTree(entry, { id: root, ...rootData }, entries.length);
    }

    closeToast();
    openToast(
      "success",
      `Uploaded item${items.length === 1 ? "" : "s"} successfully!`
    );
    setIsDragEnter(false);
  };

  // upload folder
  const traverseFileTree = async (item, rootInfo, totalFiles, path = "") => {
    if (item.isFile) {
      try {
        const file = await new Promise((resolve) => item.file(resolve));
        await handleFileUpload(file, rootInfo);
      } catch (e) {
        openToast("error", "There was an problem uploading the file");
        console.error(e.message);
      }
    } else if (item.isDirectory) {
      try {
        const dirReader = item.createReader();
        const newFolderId = await createFolder({
          fileName: item.name,
          permission: rootInfo.permission,
          parentFolder: rootInfo.id,
          uploadedBy: {
            uid: loggedInUser?.uid,
            fullName: loggedInUser?.fullName,
          },
          path: rootInfo.path + "/" + item.name,
          idPath: [...rootInfo.idPath, rootInfo.id],
        });
        const entries = await readAllEntries(dirReader);

        for (const entry of entries) {
          await traverseFileTree(
            entry,
            {
              id: newFolderId,
              idPath: [...rootInfo.idPath, rootInfo.id],
              parentFolder: rootInfo.id,
              path: rootInfo.path + "/" + item.name,
              permission: rootInfo.permission,
            },
            totalFiles,
            path + item.name + "/"
          );
        }
      } catch (e) {
        console.error(e.message);
        openToast("error", "There was a uploading the folder");
      }
    }
  };

  // read all files in folder
  const readAllEntries = async (dirReader) => {
    let entries = [];
    let batch;

    do {
      batch = await new Promise((resolve) => dirReader.readEntries(resolve));
      entries = entries.concat(batch);
    } while (batch.length > 0);

    return entries;
  };

  let displayStyles =
    variant === "grid"
      ? {
          display: files?.length > 0 ? "grid" : "flex",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "16px",
          justifyItems: "center",
          justifyContent: "center",
          alignContent: "start",
          padding: 2,
        }
      : {
          display: "flex",
          justifyContent: files?.length > 0 ? "start" : "center",
        };

  if (displayLoading)
    return (
      <Box
        sx={{
          ...displayStyles,
          flex: 1,
          overflowY: "auto",
          ...{ alignItems: "center" },
        }}
      >
        <CircularProgress sx={{ margin: "auto auto" }} />
      </Box>
    );
  return (
    <>
      {/* file area */}
      <Box
        onDragLeave={() => setIsDragEnter(false)}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          flex: 1,
          overflowY: "auto",

          transition: "box-shadow 250ms ease-in-out",
          ...displayStyles,
          ...{
            boxShadow: isDragEnter
              ? "inset 0 0 16px rgba(0, 0, 255, 0.3)"
              : null,
          },
          ...{ alignItems: files.length > 0 ? null : "center" },
        }}
      >
        {files.length === 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ color: "gray" }}>
              No files in this directory
            </Typography>
          </Box>
        )}
        {variant === "grid" &&
          files.map((file) => (
            <FileItem
              singleClick={() => handleSingleClick(file)}
              doubleClick={() =>
                handleDoubleClick(file.id, file.type, file.fileName)
              }
              key={file.id}
              icon={
                file.type === "folder" ? (
                  <FolderIcon
                    fontSize="inherit"
                    sx={{ color: "rgb(52 118 187)" }}
                  />
                ) : (
                  <DescriptionIcon
                    fontSize="inherit"
                    sx={{ color: "rgb(52 118 187)" }}
                  />
                )
              }
              text={file.fileName}
            />
          ))}
        {files.length > 0 && variant === "list" && (
          <TableContainer>
            <Table stickyHeader sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ width: "5%", padding: "4px 8px" }}
                  ></TableCell>
                  <TableCell sx={{ width: "55%", padding: "4px 8px" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ width: "20%", padding: "4px 8px" }}>
                    Uploaded By
                  </TableCell>
                  <TableCell sx={{ width: "20%", padding: "4px 8px" }}>
                    Size
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <ListFileItem
                    singleClick={() => handleSingleClick(file)}
                    doubleClick={() =>
                      handleDoubleClick(file.id, file.type, file.fileName)
                    }
                    key={file.id}
                    icon={
                      file.type === "folder" ? (
                        <FolderIcon sx={{ color: "rgb(52 118 187)" }} />
                      ) : (
                        <DescriptionIcon sx={{ color: "rgb(52 118 187)" }} />
                      )
                    }
                    text={file.fileName}
                    size={file.fileSize}
                    uploadedBy={file.uploadedBy.fullName}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
}

export default FileDisplay;
