import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase_init";

export async function fetchFolder(folderId, loggedInUser) {
  if (!loggedInUser || !folderId) return;
  try {
    // query for office and admin users
    let q = query(
      collection(db, "files"),
      where("idPath", "array-contains", folderId),
      where("type", "==", "file")
    );
    if (
      loggedInUser?.role === "field" ||
      loggedInUser?.role === "Project Manager"
    ) {
      // query for field and project manager users
      q = query(
        collection(db, "files"),
        where("idPath", "array-contains", folderId),
        where("permission", "==", "field"),
        where("type", "==", "file")
      );
    }

    // strip unecessary parts out of path and get the id
    const snapshot = await getDocs(q);
    const files = snapshot.docs.map((doc) => {
      const data = doc.data();
      const idx = data.idPath.indexOf(folderId);
      const relPath = data.path.split("/").slice(idx).join("/");
      return {
        success: true,
        id: doc.id,
        path: relPath,
      };
    });
    return files;
  } catch (e) {
    console.error(e.message);
    return {
      success: false,
    };
  }
}
