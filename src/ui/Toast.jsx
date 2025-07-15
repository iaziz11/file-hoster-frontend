import { Alert, CircularProgress, Slide, Snackbar } from "@mui/material";

function Toast({ open, onClose, variant, message, autoHide, spinner }) {
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
        sx={{ width: "100%", alignItems: "center" }}
        onClose={onClose}
      >
        {spinner && (
          <CircularProgress
            size={16}
            thickness={5}
            sx={{ color: "white", mr: 1 }}
          />
        )}
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Toast;
