import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  doc,
  deleteDoc,
  query,
  collection,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase_init";
import { updateParentFolders } from "../firebase/updateParentFolders";

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // input: {deleteAll: boolean, fileId: number, parentFolder: folderId}
    mutationFn: async (data) => {
      // delete all files
      if (data.deleteAll) {
        const q = query(collection(db, "files"));

        const querySnapshot = await getDocs(q);

        const batchDeletions = querySnapshot.docs.map((docSnap) => {
          const deleteS3Promise = fetch(
            `https://mpower-host.duckdns.org/delete/${docSnap.id}`,
            {
              method: "DELETE",
            }
          );
          const deletePromise = deleteDoc(doc(db, "files", docSnap.id));
          return Promise.all([deletePromise, deleteS3Promise]);
        });
        await Promise.all(batchDeletions);
      } else if (data.fileId) {
        // delete file or folder
        const fileRef = doc(db, "files", data.fileId);
        await deleteDoc(fileRef);
        await updateParentFolders(data.parentFolder, data.fileSize, 0, false);

        // if deleting a folder, need to delete all files and folders contained in folder
        if (data.type === "folder") {
          const filesRef = collection(db, "files");
          const q = query(
            filesRef,
            where("idPath", "array-contains", data.fileId)
          );

          const querySnapshot = await getDocs(q);

          const batchDeletions = querySnapshot.docs.map((docSnap) => {
            const deleteS3Promise = fetch(
              `https://mpower-host.duckdns.org/delete/${docSnap.id}`,
              {
                method: "DELETE",
              }
            );
            const deletePromise = deleteDoc(doc(db, "files", docSnap.id));
            return Promise.all([deletePromise, deleteS3Promise]);
          });

          await Promise.all(batchDeletions);
        } else {
          // if just deleting a file, dont worry about anything else
          await fetch(`https://mpower-host.duckdns.org/delete/${data.fileId}`, {
            method: "DELETE",
          });
        }
      } else {
        return;
      }
    },
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries(["files", variables.parentFolder]);
    },
  });
};
