import { createContext, useState } from "react";
import Toast from "../ui/Toast";

const ToastContext = createContext();
function ToastProvider({ children }) {
  const [activeToast, setActiveToast] = useState({
    variant: "",
    message: "",
  });

  const [isToastOpen, setIsToastOpen] = useState(false);

  const openToast = (variant, message, autoHide = true) => {
    setActiveToast({ variant, message, autoHide });
    setIsToastOpen(true);
  };
  const closeToast = () => {
    setIsToastOpen(false);
    setActiveToast({ variant: "", message: "", autoHide: true });
  };
  return (
    <ToastContext.Provider value={{ openToast, closeToast }}>
      <Toast
        variant={activeToast.variant}
        message={activeToast.message}
        autoHide={activeToast.autoHide}
        open={isToastOpen}
        onClose={closeToast}
      />
      {children}
    </ToastContext.Provider>
  );
}

export { ToastProvider, ToastContext };
