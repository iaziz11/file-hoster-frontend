import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "./firebase_init";

export const updateParentFolders = async (
  root,
  newFileSize,
  depth,
  isAdding
) => {
  if (root === "null") return true;
  // increase or decrease parent folders item count and size
  try {
    const folderRef = doc(db, "files", root);
    const subItemIncrement =
      depth === 0
        ? isAdding
          ? { subitems: increment(1) }
          : { subitems: increment(-1) }
        : {};
    await updateDoc(folderRef, {
      ...subItemIncrement,
      fileSize: isAdding ? increment(newFileSize) : increment(-newFileSize),
    });

    // call recursively
    const parentDoc = await getDoc(folderRef);
    const parentData = parentDoc.data();
    const res = await updateParentFolders(
      parentData.parentFolder,
      newFileSize,
      depth + 1,
      isAdding
    );
    return res;
  } catch (e) {
    console.error("There was an error updating parent folders: ", e.message);
    return false;
  }
};
