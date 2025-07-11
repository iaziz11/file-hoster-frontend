import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase_init"; // your Firebase config

const fetchUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  const unsortedUsers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // sort users by name
  return unsortedUsers.sort((a, b) => {
    return a.fullName.localeCompare(b.fullName, undefined, {
      sensitivity: "base",
    });
  });
};

export function useFetchUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });
}
