import { createContext, useState } from "react";
import Toast from "../ui/Toast";

const ToastContext = createContext();
function ToastProvider({ children }) {
  const [activeToast, setActiveToast] = useState({
    variant: "",
    message: "",
  });

  const [isToastOpen, setIsToastOpen] = useState(false);

  const openToast = (variant, message, autoHide = true, spinner = false) => {
    setActiveToast({ variant, message, autoHide, spinner });
    setIsToastOpen(true);
  };
  const closeToast = () => {
    setIsToastOpen(false);
    setActiveToast({
      variant: "",
      message: "",
      autoHide: true,
      spinner: false,
    });
  };
  return (
    <ToastContext.Provider value={{ openToast, closeToast }}>
      <Toast
        variant={activeToast.variant}
        message={activeToast.message}
        autoHide={activeToast.autoHide}
        spinner={activeToast.spinner}
        open={isToastOpen}
        onClose={closeToast}
      />
      {children}
    </ToastContext.Provider>
  );
}

export { ToastProvider, ToastContext };
