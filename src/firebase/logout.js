import { signOut } from "firebase/auth";
import { auth } from "./firebase_init";

export async function logout() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    return false;
  }
}
