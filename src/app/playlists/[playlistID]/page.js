"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { db } from "../../utils/firebase";
import { useRequireAuth } from "../../utils/useRequireAuth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

export default function Page() {
  const { user, loading } = useRequireAuth("/login");
  const params = useParams();

  // Works even if your folder is [id] or [playlistID], etc.
  const playlistId = useMemo(() => {
    if (!params) return null;
    const raw =
      params.playlistId ??
      params.id ??
      params.playlistID ??
      params.playlistid ??
      Object.values(params)[0];

    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [playlist, setPlaylist] = useState(null);
  const [movies, setMovies] = useState([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const playlistDocRef = useMemo(() => {
    if (!user?.uid || !playlistId) return null;
    return doc(db, `users/${user.uid}/playlists/${playlistId}`);
  }, [user?.uid, playlistId]);

  const load = useCallback(async () => {
    if (!playlistDocRef || !user?.uid || !playlistId) return;

    setError("");
    try {
      const pSnap = await getDoc(playlistDocRef);

      if (!pSnap.exists()) {
        setPlaylist(null);
        setMovies([]);
        setDraft("");
        setError("Playlist not found (doc does not exist).");
        return;
      }

      const p = { id: pSnap.id, ...pSnap.data() };
      setPlaylist(p);
      setDraft(p?.name || "");

      const moviesCol = collection(db, `users/${user.uid}/playlists/${playlistId}/movies`);
      const q = query(moviesCol, orderBy("addedAt", "desc"));
      const mSnap = await getDocs(q);
      setMovies(mSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
      setPlaylist(null);
      setMovies([]);
      setDraft("");
      setError(e?.message || "Could not load playlist.");
    }
  }, [playlistDocRef, user?.uid, playlistId]);

  useEffect(() => {
    if (!loading && user && playlistId) load();
  }, [loading, user?.uid, playlistId, load]);

  async function rename() {
    const trimmed = draft.trim();
    if (!trimmed || !playlistDocRef) return;

    setBusy(true);
    setError("");
    try {
      await updateDoc(playlistDocRef, { name: trimmed, updatedAt: serverTimestamp() });
      setEditing(false);
      await load();
    } catch (e) {
      console.error(e);
      setError(e?.message || "Rename failed.");
    } finally {
      setBusy(false);
    }
  }

  async function removeMovie(movieDocId) {
    if (!user?.uid || !playlistId) return;

    setBusy(true);
    setError("");
    try {
      await deleteDoc(doc(db, `users/${user.uid}/playlists/${playlistId}/movies/${movieDocId}`));
      await updateDoc(playlistDocRef, { updatedAt: serverTimestamp() });
      await load();
    } catch (e) {
      console.error(e);
      setError(e?.message || "Could not remove movie.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16">
        <div className="max-w-5xl mx-auto">Loading…</div>
      </main>
    );
  }

  if (!playlistId) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
            <div className="text-red-300 font-semibold">Missing playlist id in the URL.</div>
            <div className="text-zinc-400 mt-2">Go back and open the playlist again.</div>
            <Link href="/playlists" className="inline-block mt-4 text-red-400 hover:text-red-300">
              ← Back to Playlists
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link href="/playlists" className="text-zinc-300 hover:text-red-400">
            ← Back to Playlists
          </Link>

          <Link
            href="/movies"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm hover:bg-zinc-900/60"
          >
            Browse Movies
          </Link>
        </div>

        <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6">
          <div className="text-sm text-zinc-500">Playlist</div>

          {!editing ? (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-3xl font-extrabold">
                <span className="text-red-500">{playlist?.name || "Untitled"}</span>
              </h1>

              <button
                disabled={busy}
                onClick={() => setEditing(true)}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 hover:bg-zinc-900/50 disabled:opacity-60"
              >
                Rename
              </button>
            </div>
          ) : (
            <div className="mt-3 flex gap-2 flex-wrap">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") rename();
                  if (e.key === "Escape") {
                    setDraft(playlist?.name || "");
                    setEditing(false);
                  }
                }}
                className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
              />
              <button
                disabled={busy}
                onClick={rename}
                className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-zinc-950 hover:bg-red-400 disabled:opacity-60"
              >
                Save
              </button>
              <button
                disabled={busy}
                onClick={() => {
                  setDraft(playlist?.name || "");
                  setEditing(false);
                }}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 hover:bg-zinc-900/50 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>

        <h2 className="mt-10 text-xl font-bold">Movies in this playlist</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 text-zinc-300">
              No movies yet. Add some from the Movies page.
            </div>
          ) : (
            movies.map((m) => (
              <div key={m.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/20 overflow-hidden">
                <div className="aspect-[2/3] bg-zinc-950/40">
                  {m.poster_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                      alt={m.title || "Movie poster"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-zinc-500 text-sm">
                      No poster
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="font-semibold">{m.title || "Untitled movie"}</div>
                  {m.release_date && <div className="text-sm text-zinc-500">{m.release_date}</div>}

                  <button
                    disabled={busy}
                    onClick={() => removeMovie(m.id)}
                    className="mt-3 w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-200 hover:bg-red-500/15 disabled:opacity-60"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
