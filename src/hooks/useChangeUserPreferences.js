import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase_init";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useChangeUserPrefs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid, newPrefs }) => {
      await updateDoc(doc(db, "users", uid), {
        preferences: newPrefs,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};
