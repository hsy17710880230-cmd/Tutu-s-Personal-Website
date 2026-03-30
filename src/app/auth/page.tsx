"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import TitleWithNav from "@/src/components/Title";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const login = async () => {
    setErrorMsg("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Redirect to admin page on success
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <TitleWithNav project="Admin Login" />
      <div className="w-[360px] space-y-4 p-6 ">
        {/* <h1 className="text-2xl font-bold text-center">Admin Login</h1> */}

        {errorMsg && (
          <div className="text-red-600 text-sm text-center">{errorMsg}</div>
        )}

        <input
          type="email"
          className="border p-2 w-full rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={login}
          className="bg-black text-white w-full py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
