import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase_init";

export async function signUp(email, password, fullName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // create user metadata in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      fullName,
      status: "pending_authorization",
      role: "null", // default or empty
      preferences: {
        displayMode: "grid",
      },
    });

    return {
      success: true,
      uid: user.uid,
      email: user.email,
    };
  } catch (error) {
    console.log(error.code);
    const errorMessage =
      error.code === "auth/weak-password"
        ? "Please make sure password is at least 6 characters"
        : error.code === "auth/email-already-in-use"
        ? "This email is already in use, please try another one or reset your password"
        : "Something went wrong, please try again.";
    return {
      success: false,
      error: errorMessage,
      code: error.code,
    };
  }
}
