import { db } from "./firebase";
import {
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

/* -------------------- Recently Viewed -------------------- */
export async function upsertRecentlyViewed(uid, movie) {
  const ref = doc(db, `users/${uid}/recentlyViewed/${movie.id}`);
  await setDoc(
    ref,
    {
      movieId: movie.id,
      title: movie.title || movie.name || "",
      poster_path: movie.poster_path || null,
      release_date: movie.release_date || null,
      viewedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getRecentlyViewed(uid, max = 8) {
  const col = collection(db, `users/${uid}/recentlyViewed`);
  const q = query(col, orderBy("viewedAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* -------------------- Playlists -------------------- */
export async function createPlaylist(uid, name) {
  const col = collection(db, `users/${uid}/playlists`);
  const docRef = await addDoc(col, {
    name: name.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function renamePlaylist(uid, playlistId, name) {
  const ref = doc(db, `users/${uid}/playlists/${playlistId}`);
  await updateDoc(ref, { name: name.trim(), updatedAt: serverTimestamp() });
}

export async function deletePlaylist(uid, playlistId) {
  const moviesCol = collection(db, `users/${uid}/playlists/${playlistId}/movies`);
  const moviesSnap = await getDocs(moviesCol);
  const batch = writeBatch(db);
  moviesSnap.forEach((m) => batch.delete(m.ref));
  await batch.commit();

  await deleteDoc(doc(db, `users/${uid}/playlists/${playlistId}`));
}

export async function getUserPlaylists(uid, max = 6) {
  const col = collection(db, `users/${uid}/playlists`);
  const q = query(col, orderBy("updatedAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addMovieToPlaylist(uid, playlistId, movie) {
  const ref = doc(db, `users/${uid}/playlists/${playlistId}/movies/${movie.id}`);
  await setDoc(
    ref,
    {
      movieId: movie.id,
      title: movie.title || movie.name || "",
      poster_path: movie.poster_path || null,
      release_date: movie.release_date || null,
      addedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await updateDoc(doc(db, `users/${uid}/playlists/${playlistId}`), {
    updatedAt: serverTimestamp(),
  });
}

/* -------------------- Reviews -------------------- */
export async function saveReview(uid, { movieId, movieTitle, rating, text }) {
  const col = collection(db, `users/${uid}/reviews`);
  await addDoc(col, {
    movieId,
    movieTitle,
    rating,
    text,
    createdAt: serverTimestamp(),
  });
}

export async function getRecentReviews(uid, max = 8) {
  const col = collection(db, `users/${uid}/reviews`);
  const q = query(col, orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
