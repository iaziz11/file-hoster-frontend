import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase_init"; // your Firebase config

const fetchData = async (root) => {
  if (root === "null") return { permission: "field", path: "Home", idPath: [] };
  const snapshot = await getDoc(doc(db, "files", root));
  const { permission, path, idPath } = snapshot.data();
  return { permission, path, idPath };
};

export function useFetchRootData(root) {
  return useQuery({
    queryKey: ["data", root],
    queryFn: () => fetchData(root),
  });
}
