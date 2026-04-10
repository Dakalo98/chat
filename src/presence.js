import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const setOnline = (user) => {
  const ref = doc(db, "status", user.uid);

  setDoc(ref, {
    email: user.email,
    online: true,
    lastSeen: serverTimestamp()
  }, { merge: true });
};

export const setOffline = (user) => {
  const ref = doc(db, "status", user.uid);

  setDoc(ref, {
    email: user.email,
    online: false,
    lastSeen: serverTimestamp()
  }, { merge: true });
};