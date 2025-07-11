import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase_init";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase_init";
import { logout } from "./logout";

export async function login(email, password) {
  try {
    // log user in
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // check if user exists and/or password is correct and if not, send error
    const user = userCredential.user;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      logout();
      throw { code: "auth/invalid-credential" };
    }

    return {
      success: true,
      uid: user.uid,
      email: user.email,
    };
  } catch (error) {
    const errorMessage =
      error.code === "auth/invalid-credential"
        ? "Username or password is incorrect. Please try again or click the 'Forgot password' button"
        : "Something went wrong, please try again.";
    return {
      success: false,
      error: errorMessage,
      code: error.code,
    };
  }
}
