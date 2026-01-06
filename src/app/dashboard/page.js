"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { db } from "../utils/firebase";
import { useRequireAuth } from "../utils/useRequireAuth";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

export default function Page() {
  const { user, loading } = useRequireAuth("/login");
  const [recent, setRecent] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  const uid = user?.uid;

  const refs = useMemo(() => {
    if (!uid) return null;
    return {
      recentlyViewed: collection(db, `users/${uid}/recentlyViewed`),
      playlists: collection(db, `users/${uid}/playlists`),
      reviews: collection(db, `users/${uid}/reviews`),
    };
  }, [uid]);

  useEffect(() => {
    if (loading || !user || !refs) return;

    (async () => {
      setError("");
      try {
        const recentQ = query(refs.recentlyViewed, orderBy("viewedAt", "desc"), limit(8));
        const playlistsQ = query(refs.playlists, orderBy("updatedAt", "desc"), limit(6));
        const reviewsQ = query(refs.reviews, orderBy("createdAt", "desc"), limit(8));

        const [r1, r2, r3] = await Promise.all([
          getDocs(recentQ),
          getDocs(playlistsQ),
          getDocs(reviewsQ),
        ]);

        setRecent(r1.docs.map((d) => ({ id: d.id, ...d.data() })));
        setPlaylists(r2.docs.map((d) => ({ id: d.id, ...d.data() })));
        setReviews(r3.docs.map((d) => ({ id: d.id, ...d.data() })));

        } catch (e) {
          console.error(e);
          setError(e?.code ? `${e.code}: ${e.message}` : (e?.message || "Could not load data."));
          setPlaylists([]);
        }

    })();
  }, [loading, user, refs]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16">
        <div className="max-w-6xl mx-auto">Loading…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-extrabold">
              <span className="text-4xl md:text-5xl font-bold bg-linear-to-r pb-2 from-yellow-400 to-orange-500 bg-clip-text text-transparent">User Dashboard</span>
            </h1>
            <p className="mt-2 text-zinc-400">
              Your activity overview — recently viewed, playlists, and reviews.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/playlists"
              className="rounded-xl bg-yellow-500 px-4 py-2 font-semibold text-zinc-950 hover:bg-yellow-400"
            >
              Edit Playlists
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 hover:bg-zinc-900/60"
            >
              Main Page
            </Link>
          </div>
        </header>

        {error && (
          <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
            {error}
          </div>
        )}

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card title="Recently Viewed" subtitle="Your latest movie clicks">
            {recent.length === 0 ? (
              <Empty text="No recent activity yet." />
            ) : (
              <div className="grid gap-3">
                {recent.map((m) => (
                  <MiniRow key={m.id} title={m.title} meta={m.release_date} />
                ))}
              </div>
            )}
          </Card>

          <Card
            title="Your Playlists"
            subtitle="Quick access to your lists"
            action={<Link href="/playlists" className="text-sm text-yellow-400 hover:text-yellow-300">Manage</Link>}
          >
            {playlists.length === 0 ? (
              <Empty text="No playlists yet." />
            ) : (
              <div className="grid gap-2">
                {playlists.map((p) => (
                  <Link
                    key={p.id}
                    href={`/playlists/${p.id}`}
                    className="rounded-xl border border-zinc-800 bg-zinc-950/30 px-3 py-2 hover:bg-zinc-900/50"
                  >
                    <div className="font-semibold">{p.name || "Untitled"}</div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card title="Review History" subtitle="Recent reviews (if you store them)">
            {reviews.length === 0 ? (
              <Empty text="No reviews yet." />
            ) : (
              <div className="grid gap-3">
                {reviews.map((r) => (
                  <MiniRow
                    key={r.id}
                    title={r.movieTitle || "Movie review"}
                    meta={typeof r.rating === "number" ? `Rating: ${r.rating}/10` : ""}
                    extra={r.text ? r.text : ""}
                  />
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}

function Card({ title, subtitle, action, children }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xl font-bold">{title}</div>
          <div className="text-sm text-zinc-500">{subtitle}</div>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-4 text-zinc-300">
      {text}
    </div>
  );
}

function MiniRow({ title, meta, extra }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-3">
      <div className="font-semibold">{title || "Untitled"}</div>
      {meta && <div className="text-sm text-zinc-500">{meta}</div>}
      {extra && <div className="mt-1 text-sm text-zinc-400 line-clamp-2">{extra}</div>}
    </div>
  );
}
