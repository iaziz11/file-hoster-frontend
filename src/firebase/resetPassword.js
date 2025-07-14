import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase_init";

export async function resetPassword(email) {
  try {
    const actionCodeSettings = {
      url: "https://d2oci8gd63g7dj.cloudfront.net/",
      handleCodeInApp: false,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    return true;
  } catch (e) {
    console.error("Problem sending reset email: ", e.message);
    return false;
  }
}
