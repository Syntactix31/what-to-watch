"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { db } from "../utils/firebase";
import { useRequireAuth } from "../utils/useRequireAuth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

export default function Page() {
  const { user, loading } = useRequireAuth("/login");
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const playlistsRef = useMemo(() => {
    if (!user?.uid) return null;
    return collection(db, `users/${user.uid}/playlists`);
  }, [user?.uid]);

  async function loadPlaylists() {
    if (!playlistsRef) return;
    setError("");
    try {
      const q = query(playlistsRef, orderBy("updatedAt", "desc"));
      const snap = await getDocs(q);
      setPlaylists(snap.docs.map((d) => ({ id: d.id, ...d.data() })));

      } catch (e) {
        console.error(e);
        setError(e?.code ? `${e.code}: ${e.message}` : (e?.message || "Could not load data."));
        setPlaylists([]);
      }

  }

  useEffect(() => {
    if (!loading && user) loadPlaylists();
  }, [loading, user?.uid]);

  async function createPlaylist(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !playlistsRef) return;

    setBusy(true);
    setError("");
    try {
      await addDoc(playlistsRef, {
        name: trimmed,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setName("");
      await loadPlaylists();
    } catch {
      setError("Failed to create playlist.");
    } finally {
      setBusy(false);
    }
  }

  async function renamePlaylist(playlistId, newName) {
    const trimmed = newName.trim();
    if (!trimmed || !user?.uid) return;

    setBusy(true);
    setError("");
    try {
      await updateDoc(doc(db, `users/${user.uid}/playlists/${playlistId}`), {
        name: trimmed,
        updatedAt: serverTimestamp(),
      });
      await loadPlaylists();
    } catch {
      setError("Failed to rename playlist.");
    } finally {
      setBusy(false);
    }
  }

  async function deletePlaylist(playlistId) {
    if (!user?.uid) return;
    const ok = confirm("Delete this playlist? This cannot be undone.");
    if (!ok) return;

    setBusy(true);
    setError("");
    try {
      const moviesCol = collection(db, `users/${user.uid}/playlists/${playlistId}/movies`);
      const moviesSnap = await getDocs(moviesCol);
      const batch = writeBatch(db);
      moviesSnap.forEach((m) => batch.delete(m.ref));
      await batch.commit();

      await deleteDoc(doc(db, `users/${user.uid}/playlists/${playlistId}`));
      await loadPlaylists();
    } catch {
      setError("Failed to delete playlist.");
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

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-extrabold">
              <span className="text-4xl md:text-5xl font-bold bg-linear-to-r pb-2 from-yellow-400 to-orange-500 bg-clip-text text-transparent">Playlists</span>
            </h1>
            <p className="mt-2 text-zinc-400">
              Create, rename, and delete your lists. Click one to open it.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm hover:bg-zinc-900/60"
          >
            Go to Dashboard
          </Link>
        </header>

        {error && (
          <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
            {error}
          </div>
        )}

        <form onSubmit={createPlaylist} className="mt-8 flex gap-3 flex-wrap">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New playlist name (e.g., Late Night Thrillers)"
            className="flex-1 min-w-[240px] rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
          />
          <button
            disabled={busy}
            className="rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-yellow-400 disabled:opacity-60"
          >
            Create
          </button>
        </form>

        <div className="mt-10 grid gap-4">
          {playlists.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 text-zinc-300">
              No playlists yet. Create your first one above.
            </div>
          ) : (
            playlists.map((p) => (
              <PlaylistRow
                key={p.id}
                playlist={p}
                busy={busy}
                onRename={renamePlaylist}
                onDelete={deletePlaylist}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function PlaylistRow({ playlist, busy, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(playlist?.name || "");

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 flex items-center justify-between gap-4 flex-wrap">
      <div className="min-w-[240px]">
        <div className="text-sm text-zinc-500">Playlist</div>

        {!editing ? (
          <div className="text-xl font-bold text-zinc-100">{playlist?.name || "Untitled"}</div>
        ) : (
          <div className="mt-2 flex gap-2 flex-wrap">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
            />
            <button
              disabled={busy}
              onClick={async () => {
                await onRename(playlist.id, draft);
                setEditing(false);
              }}
              className="rounded-xl bg-yellow-500 px-4 py-2 font-semibold text-zinc-950 hover:bg-yellow-400 disabled:opacity-60"
              type="button"
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
              type="button"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/playlists/${playlist.id}`}
          className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 hover:bg-zinc-900/50"
        >
          Open
        </Link>
        <button
          disabled={busy}
          onClick={() => setEditing(true)}
          className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 hover:bg-zinc-900/50 disabled:opacity-60"
          type="button"
        >
          Rename
        </button>
        <button
          disabled={busy}
          onClick={() => onDelete(playlist.id)}
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-200 hover:bg-red-500/15 disabled:opacity-60"
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
