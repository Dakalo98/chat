import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  return (
    <div className="space-y-3">

      <h2 className="text-center font-bold text-xl">💖 Memories</h2>

      {posts.map((post) => (
        <div key={post.id} className="bg-white/10 rounded-xl overflow-hidden">

          {post.type === "image" && (
            <img src={post.url} className="w-full h-60 object-cover" />
          )}

          <div className="p-2 text-xs text-white/60">
            ❤️ {post.userEmail}
          </div>

        </div>
      ))}
    </div>
  );
}