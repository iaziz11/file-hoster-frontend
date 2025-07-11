import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TableCell,
  TableRow,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function AdminTableRow({
  loggedInUserId,
  id,
  name,
  email,
  role,
  status,
  onClickApprove,
  onChangeRole,
  onClickDelete,
}) {
  const isPending = status === "pending_authorization";
  const isLoggedInUser = loggedInUserId === id;
  return (
    <TableRow sx={{ borderBottom: "1px solid rgba(0, 0, 255, 0.4)" }}>
      <TableCell
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          overflowX: "auto",
          maxWidth: 200,
        }}
      >
        {`${name} ${isLoggedInUser ? "(me)" : ""}`}
      </TableCell>
      <TableCell
        sx={{
          whiteSpace: "nowrap",
          overflowX: "auto",
          maxWidth: 300,
        }}
      >
        {email}
      </TableCell>
      <TableCell align="center">
        {!isPending && (
          <FormControl disabled={isLoggedInUser}>
            <Select
              size="small"
              value={role}
              onChange={(e) => onChangeRole(id, name, role, e.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="office">Office</MenuItem>
              <MenuItem value="Project Manager">Project Manager</MenuItem>
              <MenuItem value="field">Field</MenuItem>
            </Select>
          </FormControl>
        )}
      </TableCell>
      <TableCell align="center">
        <Box>
          {!isLoggedInUser && (
            <Button
              size="small"
              variant="outlined"
              color={isPending ? "primary" : "error"}
              onClick={
                isPending
                  ? () => onClickApprove(id, name, email)
                  : () => onClickDelete(id, name)
              }
            >
              {isPending ? <PersonAddIcon /> : <PersonRemoveIcon />}
            </Button>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}

export default AdminTableRow;
