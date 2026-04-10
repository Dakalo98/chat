import { useState } from "react";
import { storage, db } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Upload({ user }) {
  const [file, setFile] = useState(null);

  const upload = async () => {
    if (!file) return;

    const fileRef = ref(storage, file.name);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    await addDoc(collection(db, "posts"), {
      type: "image",
      url,
      createdAt: serverTimestamp(),
      userId: user.uid,
      userEmail: user.email
    });

    alert("Uploaded 💖");
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Upload 📸</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button
        onClick={upload}
        className="bg-purple-600 px-4 py-2 rounded"
      >
        Upload
      </button>
    </div>
  );
}