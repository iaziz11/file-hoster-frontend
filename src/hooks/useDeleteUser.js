import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase_init";
import { getAuth } from "firebase/auth";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      if (userId) {
        const firebaseUser = getAuth().currentUser;
        const firebaseToken = await firebaseUser.getIdToken();
        const res = await fetch(
          `https://mpower-host.duckdns.org/deleteUser/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${firebaseToken}`,
            },
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
