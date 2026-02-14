"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BookmarkForm from "@/components/BookmarkForm";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Check Auth
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
      } else {
        setUser(data.user);
      }
    };

    checkUser();
  }, []);

  // 📥 Initial Fetch
  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setBookmarks(data || []);
    setLoading(false);
  };

  // 🔥 Realtime Updates (Correct Implementation)
  useEffect(() => {
    if (!user) return;

    fetchBookmarks(user.id);

    const channel = supabase
      .channel("realtime-bookmarks")

      // INSERT
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) => [payload.new, ...prev]);
        }
      )

      // DELETE
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== payload.old.id)
          );
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // 🗑 Delete Bookmark
  const handleDelete = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

 // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: "local" });
    window.location.href = "/login";
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      {user && (
        <>
          <p className="mb-4">Welcome, {user.email}</p>

          <BookmarkForm user={user} />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Your Bookmarks
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : bookmarks.length === 0 ? (
              <p className="text-gray-500">
                No bookmarks yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {bookmarks.map((bookmark) => (
                  <li
                    key={bookmark.id}
                    className="flex justify-between items-center border p-3 rounded"
                  >
                    <div>
                      <p className="font-medium">
                        {bookmark.title}
                      </p>
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm"
                      >
                        {bookmark.url}
                      </a>
                    </div>

                    <button
                      onClick={() => handleDelete(bookmark.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
