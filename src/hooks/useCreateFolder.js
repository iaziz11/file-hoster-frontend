import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase_init";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateParentFolders } from "../firebase/updateParentFolders";

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const docRef = await addDoc(collection(db, "files"), {
        ...data,
        dateUploaded: Date.now(),
        type: "folder",
        subitems: 0,
        fileSize: 0,
      });
      await updateParentFolders(data.parentFolder, 0, 0, true);
      return docRef.id;
    },
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries(["files", variables.parentFolder]);
    },
  });
};
