import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export default function Jobs() {
  const [job, setJob] = useState("");
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      setJobs(snapshot.docs.map(doc => doc.data()));
    });
    return unsubscribe;
  }, []);

  const addJob = async () => {
    if (!job) return;
    await addDoc(collection(db, "jobs"), {
      text: job
    });
    setJob("");
  };

  return (
    <div>
      <h2>Jobs 💼</h2>

      {jobs.map((j, i) => (
        <p key={i}>{j.text}</p>
      ))}

      <input 
        value={job}
        onChange={(e) => setJob(e.target.value)}
        placeholder="Paste job link..."
      />
      <button onClick={addJob}>Add</button>
    </div>
  );
}