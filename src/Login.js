import { useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black text-white">

      <div className="bg-white/10 p-6 rounded-2xl w-80 space-y-3 backdrop-blur">

        <h1 className="text-center text-xl font-bold">
          💖 Our Space
        </h1>

        <input
          className="w-full p-2 rounded bg-white/10"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 rounded bg-white/10"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          className="w-full bg-purple-600 p-2 rounded"
        >
          {isSignup ? "Sign Up 💖" : "Login 🔐"}
        </button>

        <p
          className="text-center text-xs cursor-pointer text-white/70"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Switch to Login" : "Create account"}
        </p>

      </div>
    </div>
  );
}