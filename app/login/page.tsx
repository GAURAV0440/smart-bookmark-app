"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        window.location.href = "/dashboard";
      } else {
        setChecking(false);
      }
    };

    checkUser();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });
  };

  // Prevent flashing login button while checking session
  if (checking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Sign in with Google
      </button>
    </div>
  );
}