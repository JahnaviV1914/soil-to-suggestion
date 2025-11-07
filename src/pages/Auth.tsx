import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");
  const [isSignUp, setIsSignUp] = useState(mode === "signup");

  const [name, setName] = useState(""); // 👈 Added name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    setMessage("");

    try {
      if (isSignUp) {
        // ✅ Sign Up logic with name metadata
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }, // save name in user_metadata
          },
        });

        if (error) throw error;

        setMessage("✅ Signup successful! You can now sign in.");
        setIsSignUp(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        // ✅ Sign In logic
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage("✅ Login successful! Redirecting...");
        navigate("/chat"); // redirect to chat
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-4">
          {isSignUp ? "🌱 Create an Account" : "🌾 Sign In to CropBot"}
        </h1>

        {/* 👇 Name field (only for Sign Up) */}
        {isSignUp && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          onClick={handleAuth}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>

        <p
          className="text-center text-sm text-blue-600 mt-3 cursor-pointer"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </p>

        {message && (
          <p className="text-center text-sm mt-3 text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
