import { BrowserRouter, Routes, Route } from "react-router-dom";
import FileStorage from "./pages/FileStoragePage";
import AdminPage from "./pages/AdminPage";
import { AuthProvider } from "./contexts/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import LoginPage from "./pages/LoginPage";
import RequireAuth from "./auth/RequireAuth";
import EmailSentPage from "./pages/EmailSentPage";
import ResetPasswordEmail from "./pages/ResetPasswordEmail";
import { ToastProvider } from "./contexts/ToastContext";
import ForbiddenPage from "./pages/ForbiddenPage";
import MissingPage from "./pages/MissingPage";
import TestEditPage from "./pages/TestEditPage";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <FileStorage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAuth needAdmin>
                  <AdminPage />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/pending"
              element={
                <RequireAuth needPending>
                  <PendingApprovalPage />
                </RequireAuth>
              }
            />
            <Route path="/emailSent" element={<EmailSentPage />} />
            <Route path="/resetPassword" element={<ResetPasswordEmail />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="/test" element={<TestEditPage />} />
            <Route path="/*" element={<MissingPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
