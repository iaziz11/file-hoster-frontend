import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFJqCUbA9gjAzmQYP_9nYmI5vO8KQSjjo",
  authDomain: "file-server-b5f42.firebaseapp.com",
  projectId: "file-server-b5f42",
  storageBucket: "file-server-b5f42.firebasestorage.app",
  messagingSenderId: "619294909687",
  appId: "1:619294909687:web:0de065d2f80ca74fcd1ff2",
};

// initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export { auth, db };
