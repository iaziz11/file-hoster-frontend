import { Alert, Slide, Snackbar } from "@mui/material";

function Toast({ open, onClose, variant, message, autoHide }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHide ? 4000 : null}
      onClose={onClose}
      slots={{ transition: Slide }}
      transitionDuration={{ enter: 100 }}
    >
      <Alert
        severity={variant}
        variant="filled"
        sx={{ width: "100%" }}
        onClose={onClose}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Toast;
