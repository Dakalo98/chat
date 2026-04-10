import { useEffect, useState, useRef } from "react";
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
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const last = data[data.length - 1];

      if (last?.senderId !== user.uid) {
        console.log("💌 New message received");
      }

      setMessages(data);
    });

    return () => unsub();
  }, [user.uid]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: message,
      createdAt: serverTimestamp(),
      senderId: user.uid,
      senderEmail: user.email,
      seen: false
    });

    setMessage("");
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setTyping(true);

    setTimeout(() => setTyping(false), 1000);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[75vh] bg-white/5 rounded-xl p-3">

      {typing && (
        <p className="text-green-400 text-xs mb-2">
          💬 partner is typing...
        </p>
      )}

      <div className="flex-1 overflow-y-auto space-y-2">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === user.uid
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-2xl max-w-[70%]
              ${
                msg.senderId === user.uid
                  ? "bg-purple-600"
                  : "bg-white/10"
              }`}
            >
              <p className="text-[10px] opacity-60">
                {msg.senderEmail}
              </p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-2">
        <input
          value={message}
          onChange={handleTyping}
          placeholder="Type message ❤️"
          className="flex-1 p-2 rounded bg-white/10"
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