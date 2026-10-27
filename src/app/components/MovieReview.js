"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";

export default function MovieReview({ movie, onSaved }) {
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  async function save(nextRating) {
    if (!user || !movie?.id || !nextRating) return;

    setBusy(true);
    setMsg("");
    try {
      const idToken = await user.getIdToken();

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          movieId: movie.id,
          movieTitle: movie.title ?? "",
          rating: nextRating,
          text,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not save review.");
      }

      setMsg("Review published!");
      onSaved?.();

      setRating(0);
      setText("");

    } catch (error) {
      setMsg(error.message || "Could not save review.");
    } finally {
      setBusy(false);
    }
  }

  //   try {
  //     await setDoc(
  //       doc(db, `users/${user.uid}/reviews/${movie.id}`),
  //       {
  //         movieId: movie.id,
  //         movieTitle: movie.title || "",
  //         rating: nextRating,
  //         text,
  //         createdAt: serverTimestamp(),
  //       },
  //       { merge: true }
  //     );
  //     setMsg("Saved!🔥");
  //   } catch {
  //     setMsg("Could not save review.");
  //   } finally {
  //     setBusy(false);
  //   }
  // }

  if (!user) {
    return (
      <div className="mt-8 pt-8 border-t border-gray-700">
        <h2 className="text-2xl font-bold mb-2">Your Rating</h2>
        <Link href="/login" className="text-yellow-400 hover:text-yellow-300">
          Log in to rate and review
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-8 border-t border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Your Rating</h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            disabled={busy}
            onClick={() => {
              setRating(n);
              // save(n);
            }}
            className={`text-2xl sm:text-3xl hover:scale-110 hover:cursor-pointer transition ${
              n <= rating ? "text-yellow-400" : "text-gray-600"
            }`}
            type="button"
            title={`Rate ${n}/10`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={text}
        maxLength={1000}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a quick review (optional)…"
        className="w-full rounded-xl border border-gray-700 bg-gray-950/40 px-4 py-3 text-white outline-none"
        rows={3}
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          disabled={busy || rating === 0}
          onClick={() => save(rating)}
          className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black disabled:opacity-60 hover:cursor-pointer active:scale-95"
          type="button"
        >
          {busy ? "Saving…" : "Save review"}
        </button>
        {msg && <span className="text-sm text-gray-300">{msg}</span>}
      </div>
    </div>
  );
}

