import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useChangeUserRole } from "../hooks/useChangeUserRole";
import { useApproveUser } from "../hooks/useApproveUser";
import { ToastContext } from "../contexts/ToastContext";
import { useContext, useEffect, useState } from "react";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useAuthUser } from "../hooks/useAuthUser";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AdminTableRow from "../ui/AdminTableRow";
import MainBox from "../ui/MainBox";
import Navbar from "../ui/Navbar";

function AdminPage() {
  // state
  const [activeModal, setActiveModal] = useState(null);
  const [hasShownError, setHasShownError] = useState(false);
  const [activeUser, setActiveUser] = useState({
    userId: "",
    fullName: "",
    email: "",
  });

  // context
  const { openToast } = useContext(ToastContext);

  // hooks
  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isLoadingUsersError,
    error: loadingUsersError,
  } = useFetchUsers();

  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  const { mutateAsync: changeUserRole, isPending: isChangingRole } =
    useChangeUserRole();

  const { mutateAsync: approveUser, isPending: isApprovingUser } =
    useApproveUser();

  const { user: loggedInUser, loading: isLoadingLoggedInUser } = useAuthUser();

  // event handlers

  // open approve user modal
  const handleClickApprove = (userId, name, email) => {
    setActiveUser({ userId, email, fullName: name });
    setActiveModal("approveUser");
  };

  // open change role confirmation modal
  const handleAttemptChangeRole = (userId, fullName, oldRole, newRole) => {
    setActiveUser({ userId, fullName, oldRole, newRole });
    setActiveModal("changeRole");
  };

  // open delete user modal
  const handleClickDelete = (userId, fullName) => {
    setActiveUser({ userId, fullName });
    setActiveModal("deleteUser");
  };

  // change user's role
  const handleChangeRole = async () => {
    try {
      await changeUserRole({
        uid: activeUser.userId,
        role: activeUser.newRole,
      });
      setActiveModal(null);
      openToast("success", "Successfully changed user role!");
    } catch (e) {
      console.error(e.message);
      openToast("error", "There was a problem changing user role");
    }
  };

  // approve user
  const handleApproveUser = async () => {
    try {
      await approveUser({ uid: activeUser.userId, role: "field" });
      setActiveModal(null);
      openToast("success", "Successfully approved user!");
    } catch (e) {
      console.error(e.message);
      openToast("error", "There was an error approving user");
    }
  };

  // delete user
  const handleDeleteUser = async () => {
    try {
      await deleteUser(activeUser.userId);
      setActiveModal(null);
      openToast("success", "Successfully deleted user!");
    } catch (e) {
      console.error(e.message);
      openToast("error", "There was an error deleting user");
    }
  };

  // problem loading users
  useEffect(() => {
    if (isLoadingUsersError && !hasShownError) {
      console.error(loadingUsersError);
      openToast("error", "Could not load users");
      setHasShownError(true);
    }
  }, [isLoadingUsersError, openToast, hasShownError, loadingUsersError]);

  return (
    <>
      <Navbar />

      {/* approve user modal */}
      <Dialog
        open={activeModal === "approveUser"}
        onClose={() => setActiveModal(null)}
        fullWidth
        maxWidth="xs"
        slotProps={{
          transition: {
            onExited: () => setActiveUser(null),
          },
        }}
      >
        <DialogTitle>Approve User</DialogTitle>

        <DialogContent>
          <Typography>
            Would you like to approve this user: {activeUser?.fullName} (
            {activeUser?.email})?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            loading={isDeletingUser}
            onClick={handleDeleteUser}
            endIcon={<CloseIcon />}
          >
            Reject
          </Button>
          <Button
            loading={isApprovingUser}
            variant="contained"
            onClick={handleApproveUser}
            endIcon={<CheckIcon />}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* change role modal */}
      <Dialog
        open={activeModal === "changeRole"}
        onClose={() => setActiveModal(null)}
        fullWidth
        maxWidth="xs"
        slotProps={{
          transition: {
            onExited: () => setActiveUser(null),
          },
        }}
      >
        <DialogTitle>Change Role</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you would like to change {activeUser?.fullName}'s role
            from{" "}
            <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {activeUser?.oldRole}{" "}
            </span>
            to{" "}
            <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {activeUser?.newRole}
            </span>
            ?
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
            onClick={handleChangeRole}
            loading={isChangingRole}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* delete user modal */}
      <Dialog
        open={activeModal === "deleteUser"}
        onClose={() => setActiveModal(null)}
        fullWidth
        maxWidth="xs"
        slotProps={{
          transition: {
            onExited: () => setActiveUser(null),
          },
        }}
      >
        <DialogTitle>Delete User</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you would like to remove {activeUser?.fullName}'s
            account?
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
            loading={isDeletingUser}
            color="error"
            endIcon={<DeleteIcon />}
            onClick={handleDeleteUser}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* user list box */}
      <MainBox variant="narrow">
        {isLoadingLoggedInUser || isLoadingUsers || isLoadingUsersError ? (
          <CircularProgress sx={{ margin: "auto auto" }} />
        ) : (
          <>
            <Box
              sx={{
                height: "60px",
                borderBottom: "1px solid rgba(0, 0, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 15px",
              }}
            >
              <Tabs value={0}>
                <Tab label="Users" sx={{ color: "rgba(0, 0, 255, 0.4)" }} />
              </Tabs>
            </Box>

            <TableContainer
              component={Paper}
              sx={{
                maxWidth: "100%",
                overflowX: "auto",
                boxShadow: "0 1px 1px rgba(0, 0, 255, 0.3)",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email </TableCell>
                    <TableCell align="center">Role</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <AdminTableRow
                      key={user.id}
                      loggedInUserId={loggedInUser.uid}
                      id={user.id}
                      name={user.fullName}
                      email={user.email}
                      role={user.role}
                      status={user.status}
                      onClickApprove={handleClickApprove}
                      onChangeRole={handleAttemptChangeRole}
                      onClickDelete={handleClickDelete}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </MainBox>
    </>
  );
}

export default AdminPage;
