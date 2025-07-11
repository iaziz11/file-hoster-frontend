import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useAuthUser() {
  return useContext(AuthContext);
}
