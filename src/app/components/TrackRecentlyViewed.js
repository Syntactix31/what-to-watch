"use client";

import { useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../utils/firebase";

export default function TrackRecentlyViewed({ movie }) {
  const wroteRef = useRef(false);

  useEffect(() => {
    if (!movie?.id) return;

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u || wroteRef.current) return;
      wroteRef.current = true;

      await setDoc(
        doc(db, `users/${u.uid}/recentlyViewed/${movie.id}`),
        {
          movieId: movie.id,
          title: movie.title || "",
          poster_path: movie.poster_path || null,
          release_date: movie.release_date || null,
          viewedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });

    return () => unsub();
  }, [movie?.id, movie?.title, movie?.poster_path, movie?.release_date]);

  return null;
}
