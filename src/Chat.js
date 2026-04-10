import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

export default function Chat({ user }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: message,
      senderId: user.uid,
      senderEmail: user.email,
      createdAt: serverTimestamp()
    });

    setMessage("");
  };

  return (
    <div className="h-[75vh] flex flex-col bg-white/5 rounded-xl p-3">

      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === user.uid ? "justify-end" : "justify-start"}`}
          >
            <div className="bg-purple-600/80 px-3 py-2 rounded-xl max-w-[70%] text-sm">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 rounded bg-white/10"
          placeholder="Type..."
        />

        <button
          onClick={sendMessage}
          className="bg-purple-600 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}