"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../utils/firebase";

export default function AddToPlaylist({ movie }) {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    (async () => {
      const col = collection(db, `users/${user.uid}/playlists`);
      const q = query(col, orderBy("updatedAt", "desc"));
      const snap = await getDocs(q);
      setPlaylists(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, [user?.uid]);

  async function add() {
    if (!user?.uid || !selected || !movie?.id) return;
    setBusy(true);
    setMsg("");

    try {
      await setDoc(
        doc(db, `users/${user.uid}/playlists/${selected}/movies/${movie.id}`),
        {
          movieId: movie.id,
          title: movie.title || "",
          poster_path: movie.poster_path || null,
          release_date: movie.release_date || null,
          addedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await updateDoc(doc(db, `users/${user.uid}/playlists/${selected}`), {
        updatedAt: serverTimestamp(),
      });

      setMsg("Added to playlist ✅");
    } catch {
      setMsg("Could not add to playlist.");
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <div className="mt-6 rounded-xl border border-gray-700 bg-gray-900/40 p-4 text-gray-200">
        <div className="font-semibold">Want to save this movie?</div>
        <Link href="/login" className="text-yellow-400 hover:text-yellow-300">
          Log in to add to playlists
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-700 bg-gray-900/40 p-4">
      <div className="font-semibold mb-3">Add to playlist</div>

      <div className="flex gap-2 flex-wrap items-center">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-950/40 px-3 py-2"
        >
          <option value="">Select a playlist…</option>
          {playlists.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name || "Untitled"}
            </option>
          ))}
        </select>

        <button
          disabled={busy || !selected}
          onClick={add}
          className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black disabled:opacity-60"
          type="button"
        >
          {busy ? "Adding…" : "Add"}
        </button>

        <Link href="/playlists" className="text-yellow-400 hover:text-yellow-300">
          Manage playlists
        </Link>
      </div>

      {msg && <div className="mt-2 text-sm text-gray-300">{msg}</div>}
    </div>
  );
}
