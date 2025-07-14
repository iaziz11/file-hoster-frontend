import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase_init";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateParentFolders } from "../firebase/updateParentFolders";

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ meta, file }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileId", newDoc.id);
      await fetch("https://mpower-host.duckdns.org/upload", {
        method: "POST",
        body: formData,
      });

      const newDoc = await addDoc(collection(db, "files"), {
        ...meta,
        dateUploaded: Date.now(),
        type: "file",
        subitems: 0,
      });

      await updateParentFolders(meta.parentFolder, meta.fileSize, 0, true);
    },
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries(["files", variables.parentFolder]);
    },
  });
};
