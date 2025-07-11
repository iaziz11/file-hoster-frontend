import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";

export default function RequireAuth({ children, needAdmin, needPending }) {
  const { user: loggedInUser, loading: isLoadingLoggedInUser } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoadingLoggedInUser) return;

    // check if user is allowed to view the current page
    if (!loggedInUser) {
      navigate("/login");
    } else if (loggedInUser.status === "pending_authorization") {
      navigate("/pending");
    } else if (needAdmin && loggedInUser.role !== "admin") {
      navigate("/forbidden");
    } else if (needPending && loggedInUser.status !== "pending_authorization") {
      navigate("/forbidden");
    }
  }, [isLoadingLoggedInUser, loggedInUser, navigate, needAdmin, needPending]);

  const shouldBlockRender =
    isLoadingLoggedInUser ||
    !loggedInUser ||
    (loggedInUser.status === "pending_authorization" && !needPending) ||
    (needAdmin && loggedInUser.role !== "admin") ||
    (needPending && loggedInUser.status !== "pending_authorization");

  if (shouldBlockRender) return null;

  return children;
}
