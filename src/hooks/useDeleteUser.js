import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase_init";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      if (userId) {
        const res = await fetch(
          `https://mpower-host.duckdns.org/deleteUser/${userId}`,
          {
            method: "DELETE",
          }
        );
        if (res.status === 500) {
          throw { message: "Problem deleting user" };
        }
        const userRef = doc(db, "users", userId);
        await deleteDoc(userRef);
      } else {
        return;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};
