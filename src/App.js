import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import Login from "./Login";
import Chat from "./Chat";
import Feed from "./Feed";
import Upload from "./upload";

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("chat");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white p-3">

      <div className="flex justify-around mb-3">
        <button onClick={() => setTab("chat")}>💬</button>
        <button onClick={() => setTab("feed")}>💖</button>
        <button onClick={() => setTab("upload")}>📸</button>
      </div>

      {tab === "chat" && <Chat user={user} />}
      {tab === "feed" && <Feed />}
      {tab === "upload" && <Upload user={user} />}

    </div>
  );
}