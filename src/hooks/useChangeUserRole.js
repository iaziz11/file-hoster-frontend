import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase_init";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid, role }) => {
      await updateDoc(doc(db, "users", uid), {
        role: role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};
