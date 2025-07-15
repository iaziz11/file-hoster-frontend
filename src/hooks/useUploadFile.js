import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase_init";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateParentFolders } from "../firebase/updateParentFolders";

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ meta, file }) => {
      const newDoc = await addDoc(collection(db, "files"), {
        ...meta,
        dateUploaded: Date.now(),
        type: "file",
        subitems: 0,
      });

      try {
        await updateParentFolders(meta.parentFolder, meta.fileSize, 0, true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileId", newDoc.id);
        const res = await fetch("https://mpower-host.duckdns.org/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          throw new Error(`Upload failed with status ${res.status}`);
        }
      } catch (err) {
        await deleteDoc(doc(db, "files", newDoc.id));
        throw err;
      }
    },
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries(["files", variables.parentFolder]);
    },
  });
};
