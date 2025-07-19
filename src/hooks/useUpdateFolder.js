import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase_init";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEditFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const docRef = doc(db, "files", data.folderId);
      const newData = { fileName: data.folderName };
      if (data.permission) {
        newData.permission = data.permission;
      }
      await updateDoc(docRef, {
        ...newData,
      });
    },
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries(["files", variables.parentFolder]);
    },
  });
};
