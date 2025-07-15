import {
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useChangeUserPrefs } from "../hooks/useChangeUserPreferences";
import { useFetchRootData } from "../hooks/useFetchRootData";
import { useCreateFolder } from "../hooks/useCreateFolder";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "../contexts/ToastContext";
import { useFetchFiles } from "../hooks/useFetchFiles";
import { useUploadFile } from "../hooks/useUploadFile";
import { useDeleteFile } from "../hooks/useDeleteFile";
import { useAuthUser } from "../hooks/useAuthUser";
import { CircularProgress } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import GridViewIcon from "@mui/icons-material/GridView";
import FolderIcon from "@mui/icons-material/Folder";
import ListIcon from "@mui/icons-material/List";
import HomeIcon from "@mui/icons-material/Home";
import FileDisplay from "../ui/FileDisplay";
import PopupTab from "../ui/PopupTab";
import MainBox from "../ui/MainBox";
import Navbar from "../ui/Navbar";

function FileStorage() {
  // state
  const [root, setRoot] = useState("null");
  const [activeModal, setActiveModal] = useState(null);
  const [hasShownError, setHasShownError] = useState(false);
  const [isFilePopupOpen, setIsFilePopupOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  const [currentBreadCrumbs, setCurrentBreadCrumbs] = useState([
    { bcName: "Home", bcId: "null" },
  ]);
  const [newFolderData, setNewFolderData] = useState({
    name: "",
    permissions: "field",
  });
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    permissions: "field",
  });

  // hooks
  const {
    user: loggedInUser,
    loading: isLoadingLoggedInUser,
    setUpdateUser: needUpdate,
  } = useAuthUser();
  const {
    data: files,
    isLoading: isLoadingFiles,
    isError: isLoadingFilesError,
    error: loadingFilesError,
  } = useFetchFiles(root, loggedInUser);
  const {
    mutateAsync: createFolder,
    isPending: isCreatingFolder,
    isError: isCreateFolderError,
    error: createFolderError,
  } = useCreateFolder();

  const {
    mutateAsync: uploadFile,
    isPending: isUploadingFile,
    isError: isUploadFileError,
    error: uploadFileError,
  } = useUploadFile();

  const {
    mutateAsync: deleteFile,
    isPending: isDeletingFile,
    isError: isDeleteFileError,
    error: deleteFileError,
  } = useDeleteFile();

  const {
    data: rootData,
    isLoading: isLoadingRootData,
    isError: isRootDataError,
    error: rootDataError,
  } = useFetchRootData(root);

  const {
    mutateAsync: changeUserPreferences,
    isError: isChangingPreferencesError,
    error: changingPreferencesError,
  } = useChangeUserPrefs();

  // context
  const { openToast } = useContext(ToastContext);

  // event handlers

  // creating a folder
  const handleCreateFolder = async () => {
    const filteredName = newFolderData.name.replace(/\//g, "");
    await createFolder({
      fileName: filteredName,
      permission: newFolderData.permissions,
      parentFolder: root,
      uploadedBy: {
        uid: loggedInUser?.uid,
        fullName: loggedInUser?.fullName,
      },
      path: rootData.path + "/" + filteredName,
      idPath: [...rootData.idPath, root],
    });
    if (isCreateFolderError) {
      console.error(createFolderError);
      openToast("error", "Could not create folder, please try again");
    } else {
      setNewFolderData({ name: "", permissions: "field" });
      setActiveModal(null);
    }
  };

  // single click on a file or folder
  const handleSingleClick = (file) => {
    setActiveFile(file);
    setIsFilePopupOpen(true);
  };

  // double click on a file or folder
  const handleDoubleClick = (id, type, name) => {
    if (type === "file") {
      console.log("Double clicked a file");
      return;
    }
    setCurrentBreadCrumbs((prev) => [...prev, { bcName: name, bcId: id }]);
    setRoot(id);
  };

  // uploading files
  const handleFileUpload = async (event) => {
    try {
      const uploadedFiles = event.target.files;
      const problemFiles = [];
      if (uploadedFiles) {
        for (const ufile of uploadedFiles) {
          await uploadFile({
            meta: {
              fileName: ufile.name,
              fileSize: ufile.size,
              permission: rootData.permission,
              contentType: ufile.type,
              parentFolder: root,
              uploadedBy: {
                uid: loggedInUser?.uid,
                fullName: loggedInUser?.fullName,
              },
              path: rootData.path + "/" + ufile.name,
              idPath: [...rootData.idPath, root],
            },
            file: ufile,
          });
          if (isUploadFileError) {
            console.error(uploadFileError);
            problemFiles.push(ufile.name);
          }
        }
        if (problemFiles.length === 0) {
          openToast(
            "success",
            uploadedFiles.length > 1
              ? "Successfully uploaded files!"
              : "Successfully uploaded file!"
          );
        } else {
          openToast(
            "error",
            "There was an error uploading the following files: " +
              problemFiles.reduce(
                (acc, cur, idx) => (idx === 0 ? acc : acc + ", ") + cur,
                ""
              )
          );
        }
      }
    } catch (e) {
      console.error(e.message);
      openToast("error", "There was an error uploading files: " + e.message);
    }
    event.target.value = null;
  };

  // open delete file confirmation modal
  const handleClickDelete = () => {
    setActiveModal("delete_file");
  };

  // delete file
  const handleDeleteFile = async () => {
    await deleteFile({
      fileId: activeFile.id,
      parentFolder: root,
      type: activeFile.type,
      fileSize: activeFile.fileSize,
    });
    if (isDeleteFileError) {
      console.error(deleteFileError);
      openToast("error", "There was a problem with deletion");
    }
    setIsFilePopupOpen(false);
    setActiveFile(null);
    setActiveModal(null);
  };

  // create a new project
  const handleCreateProject = async () => {
    setIsCreatingProject(true);
    const newFolders = [
      "Certified Payroll",
      "Change Orders",
      "Invoices",
      "On Boarding",
      "Original Estimate and Proposal",
      "Project Correspondence",
      "Project Inspections",
      "Project Photos",
      "Project Schedules",
      "RFI(s)",
      "Submittals",
      "Vendor Accounts",
    ];

    const newFolderId = await createFolder({
      fileName: newProjectData.name,
      permission: newProjectData.permissions,
      parentFolder: root,
      uploadedBy: {
        uid: loggedInUser?.uid,
        fullName: loggedInUser?.fullName,
      },
      path: rootData.path + "/" + newFolderData.name,
      idPath: [...rootData.idPath, root],
    });
    for (const folder of newFolders) {
      await createFolder({
        fileName: folder,
        permission: newProjectData.permissions,
        parentFolder: newFolderId,
        uploadedBy: {
          uid: loggedInUser?.uid,
          fullName: loggedInUser?.fullName,
        },
        path: rootData.path + "/" + newProjectData.name,
        idPath: [...rootData.idPath, root, newFolderId],
      });
    }
    if (isCreateFolderError) {
      console.error(createFolderError);
      openToast("error", "Error creating project");
    } else {
      openToast("success", "Created project successfully!");
    }
    setActiveModal(null);
    setIsCreatingProject(false);
  };

  // click on a breadcrumb
  const handleBreadcrumbClick = (idx, id) => {
    if (root === "null" || idx + 1 === currentBreadCrumbs.length) return;
    setCurrentBreadCrumbs((prev) => prev.slice(0, idx + 1));
    setRoot(id);
  };

  // change create folder form data
  const handleFormChange = (event) => {
    if (activeModal === "create_folder") {
      setNewFolderData({
        ...newFolderData,
        [event.target.name]: event.target.value,
      });
    } else if (activeModal === "create_project") {
      setNewProjectData({
        ...newProjectData,
        [event.target.name]: event.target.value,
      });
    }
  };

  // change file views
  const handleChangeUserPreferences = async (event, newAlign) => {
    if (!newAlign) return;
    await changeUserPreferences({
      uid: loggedInUser.uid,
      newPrefs: {
        displayMode: newAlign,
      },
    });
    if (isChangingPreferencesError) {
      console.error(changingPreferencesError);
      openToast("error", "There was an issue updating preferences");
    }
    needUpdate(true);
    setDisplayMode(newAlign);
  };

  // problem loading users or files
  useEffect(() => {
    if (isLoadingFilesError && !hasShownError) {
      console.error(loadingFilesError);
      openToast("error", "Could not load users");
      setHasShownError(true);
    }
    if (isRootDataError && !hasShownError) {
      console.error(rootDataError);
      openToast("error", "Could not load folder data");
      setHasShownError(true);
    }

    if (loggedInUser && !displayMode) {
      setDisplayMode(loggedInUser.preferences.displayMode);
    }
  }, [
    isLoadingFilesError,
    openToast,
    hasShownError,
    loadingFilesError,
    rootDataError,
    isRootDataError,
    loggedInUser,
    displayMode,
  ]);

  return (
    <>
      <Navbar />

      {/* create project modal */}
      <Dialog
        open={activeModal === "create_project"}
        onClose={() => setActiveModal(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Create New Project</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            name="name"
            required
            variant="outlined"
            value={newProjectData.name}
            onChange={handleFormChange}
          />
          <FormControl fullWidth required sx={{ mt: 2 }}>
            <InputLabel id="select-permission-p">Permissions</InputLabel>
            <Select
              name="permissions"
              labelId="select-permission-p"
              value={newProjectData.permissions}
              label="Permissions"
              onChange={handleFormChange}
            >
              <MenuItem value={"field"}>Field</MenuItem>
              <MenuItem value={"office"}>Office</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setActiveModal(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateProject}
            loading={isCreatingProject}
            disabled={newProjectData.name.length <= 0}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* create folder modal */}
      <Dialog
        open={activeModal === "create_folder"}
        onClose={() => setActiveModal(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Create New Folder</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            name="name"
            required
            variant="outlined"
            value={newFolderData.name}
            onChange={handleFormChange}
          />
          {loggedInUser?.role !== "field" &&
            loggedInUser?.role !== "Project Manager" && (
              <FormControl fullWidth required sx={{ mt: 2 }}>
                <InputLabel id="select-permission">Permissions</InputLabel>
                <Select
                  name="permissions"
                  labelId="select-permission"
                  value={newFolderData.permissions}
                  label="Permissions"
                  onChange={handleFormChange}
                >
                  <MenuItem value={"field"}>Field</MenuItem>
                  <MenuItem value={"office"}>Office</MenuItem>
                </Select>
              </FormControl>
            )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setActiveModal(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateFolder}
            loading={isCreatingFolder}
            disabled={newFolderData.name.length <= 0}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* delete file modal */}
      <Dialog
        open={activeModal === "delete_file"}
        onClose={() => setActiveModal(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Delete {activeFile?.type === "folder" ? "Folder" : "File"}
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you would you like to delete this{" "}
            {activeFile?.type === "folder" ? "folder" : "file"}? This action is
            irreversible.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            sx={{
              color: "gray",
              "&:hover": {
                borderColor: "darkgray",
              },
            }}
            onClick={() => setActiveModal(null)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            loading={isDeletingFile}
            color="error"
            endIcon={<DeleteForeverIcon />}
            onClick={handleDeleteFile}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* file details popup */}
      <PopupTab
        open={isFilePopupOpen}
        item={activeFile}
        onClose={() => setIsFilePopupOpen(false)}
        onDelete={handleClickDelete}
        setActiveFolder={handleDoubleClick}
        loggedInUser={loggedInUser}
      />

      {/* main file storage box */}
      <MainBox variant={displayMode === "list" ? "narrower" : null}>
        {isLoadingLoggedInUser ? (
          <CircularProgress sx={{ margin: "auto auto" }} />
        ) : (
          <>
            {/* breadcrumbs */}
            <Box
              sx={{
                height: "32px",
                borderBottom: "1px solid rgba(0, 0, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                padding: "0 15px",
              }}
            >
              <Box
                sx={{
                  overflowX: "auto",
                  "&::-webkit-scrollbar": {
                    height: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#eee",
                  },
                }}
              >
                <Breadcrumbs
                  sx={{
                    minWidth: "max-content",
                    flexShrink: 0,
                  }}
                >
                  {currentBreadCrumbs.map((bc, index) => (
                    <Link
                      key={index}
                      underline="hover"
                      onClick={() => handleBreadcrumbClick(index, bc.bcId)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      {index === 0 && (
                        <HomeIcon
                          sx={{ mr: 0.5, color: "rgb(52 118 187)" }}
                          fontSize="inherit"
                        />
                      )}
                      {index > 0 && (
                        <FolderIcon
                          sx={{ mr: 0.5, color: "rgb(52 118 187)" }}
                          fontSize="inherit"
                        />
                      )}
                      {bc.bcName}
                    </Link>
                  ))}
                </Breadcrumbs>
              </Box>

              {/* switch view */}
              <Box
                sx={{
                  marginLeft: "auto",
                  // borderLeft: "1px solid rgba(0, 0, 255, 0.3)",
                  width: "70px",
                  height: "100%",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <ToggleButtonGroup
                  color="primary"
                  value={displayMode}
                  exclusive
                  onChange={handleChangeUserPreferences}
                >
                  <ToggleButton
                    value="grid"
                    sx={{ height: "100%", padding: "0" }}
                  >
                    <GridViewIcon />
                  </ToggleButton>
                  <ToggleButton
                    value="list"
                    sx={{ height: "100%", padding: "0" }}
                  >
                    <ListIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
            {/* file area */}
            <FileDisplay
              displayLoading={
                isLoadingRootData || isLoadingFiles || isLoadingFilesError
              }
              files={files}
              handleSingleClick={handleSingleClick}
              handleDoubleClick={handleDoubleClick}
              root={root}
              rootData={rootData}
              loggedInUser={loggedInUser}
              variant={displayMode}
            />
            {/* button area */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: 2,
                justifyContent: "center",
                p: 2,
                borderTop: "1px solid rgba(0, 0, 255, 0.3)",
              }}
            >
              {loggedInUser.role === "admin" && (
                <Button
                  variant="outlined"
                  startIcon={<AccountTreeIcon />}
                  onClick={() => setActiveModal("create_project")}
                >
                  New Project
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<CreateNewFolderIcon />}
                onClick={() => setActiveModal("create_folder")}
              >
                Create Folder
              </Button>
              <Button
                component="label"
                variant="contained"
                color="primary"
                loading={isUploadingFile}
                startIcon={<UploadFileIcon />}
              >
                <input
                  accept="*"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                  multiple
                />
                Upload Files
              </Button>
              {import.meta.env.DEV && (
                <Button
                  onClick={() =>
                    deleteFile({ parentFolder: root, deleteAll: true })
                  }
                  loading={isDeletingFile}
                >
                  Clear
                </Button>
              )}
            </Box>
          </>
        )}
      </MainBox>
    </>
  );
}

export default FileStorage;
