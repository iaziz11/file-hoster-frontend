import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase_init";

export async function fetchFile(fileId) {
  if (!fileId) return;
  try {
    const docRef = doc(db, "files", fileId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      console.warn(`File with ID ${fileId} not found.`);
      return { success: false, error: "not-found" };
    }
    const data = snapshot.data();
    return {
      success: true,
      file: data,
    };
  } catch (e) {
    console.error(e.message);
    return {
      success: false,
    };
  }
}
