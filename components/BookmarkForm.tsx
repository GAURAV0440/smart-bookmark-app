"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BookmarkForm({ user }: any) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!title || !url) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setErrorMessage("");

      const { error } = await supabase.from("bookmarks").insert([
        {
          title,
          url,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      setTitle("");
      setUrl("");
      setMessage("✅ Bookmark saved successfully!");

      // Auto hide success message
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error: any) {
      setErrorMessage("❌ Failed to save bookmark. Try again.");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 max-w-xl">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Saving..." : "Add Bookmark"}
      </button>

      {message && (
        <p className="text-green-600 font-medium">{message}</p>
      )}

      {errorMessage && (
        <p className="text-red-600 font-medium">{errorMessage}</p>
      )}
    </form>
  );
}
