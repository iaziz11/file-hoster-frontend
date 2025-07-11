import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase_init"; // your Firebase config

const fetchFiles = async (root, loggedInUser) => {
  if (!loggedInUser) return;
  let q = query(collection(db, "files"), where("parentFolder", "==", root));
  if (
    loggedInUser?.role === "field" ||
    loggedInUser?.role === "Project Manager"
  ) {
    q = query(
      collection(db, "files"),
      where("parentFolder", "==", root),
      where("permission", "==", "field")
    );
  }
  const snapshot = await getDocs(q);
  const unsortedFiles = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return unsortedFiles.sort((a, b) => {
    // prioritize folders
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;

    // sort alphabetically (case-insensitive)
    return a.fileName.localeCompare(b.fileName, undefined, {
      sensitivity: "base",
    });
  });
};

export function useFetchFiles(root, loggedInUser) {
  return useQuery({
    queryKey: ["files", root, loggedInUser.uid, loggedInUser.role],
    queryFn: () => fetchFiles(root, loggedInUser),
  });
}
