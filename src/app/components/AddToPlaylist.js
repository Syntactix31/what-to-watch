"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
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

  const [containingPlaylists, setContainingPlaylists] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    (async () => {
      try {

        const col = collection(db, `users/${user.uid}/playlists`);
        const q = query(col, orderBy("updatedAt", "desc"));
        const snap = await getDocs(q);

        const allPlaylists = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        setPlaylists(allPlaylists);

        // The following is where the code checks all the playlist collections for a playlist that contains the matching movie id and returns the playlist name
        const memberships = await Promise.all(allPlaylists.map(async (p) => {
          const movieRef = doc(db, `users/${user.uid}/playlists/${p.id}/movies/${movie.id}`);
          const movieSnap = await getDoc(movieRef);

          return movieSnap.exists() ? p : null;


        })  
      );
      
      setContainingPlaylists(memberships.filter(Boolean));    // Interesting way to filter out nulls in an array list - will take note for this later



      } catch (error) {
        console.error("Failed to load playlists cuz:", error)

      }
    })();
  }, [user?.uid, movie?.id]);

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
      
      async function loadContainingPlaylists() {
        if (!user?.uid || !movie?.id) return;

        const memberships = await Promise.all(
          playlists.map(async (p) => {
            const movieRef = doc(
              db,
              `users/${user.uid}/playlists/${p.id}/movies/${movie.id}`
            );
            const movieSnap = await getDoc(movieRef);

            return movieSnap.exists() ? p : null;
          })
        );

        setContainingPlaylists(memberships.filter(Boolean));
      }


      setMsg("Added to playlist ✔");
      await loadContainingPlaylists();

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
          className="rounded-lg border border-gray-700 bg-black px-3 py-2 hover:cursor-pointer"
        >
          <option value="">Select a playlist…</option>
          {playlists.map((p) => (
            <option key={p.id} value={p.id} className="bg-black text-zinc-300">
              {p.name || "Untitled"}
            </option>
          ))}
        </select>

        <button
          disabled={busy || !selected}
          onClick={add}
          className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black disabled:opacity-60 hover:cursor-pointer active:scale-95"
          type="button"
        >
          {busy ? "Adding…" : "Add"}
        </button>

        <Link href="/playlists" className="text-yellow-400 hover:text-yellow-300">
          Manage playlists
        </Link>
      </div>

      {msg && <div className="mt-2 text-sm text-gray-300 pl-4">{msg}</div>}


      {/* Section for information about which playlists contains the movie  */}
      {/* <div className="mt-6 text-sm text-gray-300">

        <span className="font-semibold">{movie.title}</span> is in the {containingPlaylists.length} playlist(s):


      </div> */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-sm text-gray-300">
        <span className="font-semibold">{movie.title}</span> is in{" "}
        {containingPlaylists.length === 1
          ? "1 playlist"
          : `${containingPlaylists.length} playlists`}
        :

        {containingPlaylists.length === 0 ? (
          <div className="mt-2 text-gray-400">
            This movie is not in any of your playlists yet.
          </div>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {containingPlaylists.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/playlists/${p.id}`}
                  className="inline-block rounded-full border border-gray-700 bg-gray-800 px-3 py-1 hover:bg-gray-700 hover:scale-103 hover:border hover:border-zinc-300 active:scale-100 transition"
                >
                  {p.name || "Untitled"}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>


    </div>
  );
}

