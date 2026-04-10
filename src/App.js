import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import Login from "./Login";
import Chat from "./Chat";
import Jobs from "./Jobs";
import Upload from "./Upload";
import Feed from "./Feed";

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("feed");

  // 🔐 Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  // 🟢 Online / Offline status
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "status", user.uid);

    setDoc(userRef, {
      email: user.email,
      online: true,
      lastSeen: serverTimestamp()
    });

    return () => {
      setDoc(userRef, {
        email: user.email,
        online: false,
        lastSeen: serverTimestamp()
      });
    };
  }, [user]);

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center p-3 border-b border-white/10">
        <h1 className="text-lg font-bold">Our Space ❤️</h1>

        <button
          onClick={() => signOut(auth)}
          className="bg-red-500 px-3 py-1 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>

      {/* TABS */}
      <div className="flex justify-around bg-black/30 p-2 text-xl">
        <button onClick={() => setTab("feed")}>💕</button>
        <button onClick={() => setTab("chat")}>💬</button>
        <button onClick={() => setTab("jobs")}>💼</button>
        <button onClick={() => setTab("upload")}>📸</button>
      </div>

      {/* CONTENT */}
      <div className="p-3">
        {tab === "feed" && <Feed user={user} />}
        {tab === "chat" && <Chat user={user} />}
        {tab === "jobs" && <Jobs user={user} />}
        {tab === "upload" && <Upload user={user} />}
      </div>

    </div>
  );
}