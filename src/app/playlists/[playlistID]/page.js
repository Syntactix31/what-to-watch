"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { db } from "../../utils/firebase";
import { useRequireAuth } from "../../utils/useRequireAuth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query as firestoreQuery,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import MovieDeleteModal from "../../components/MovieDeleteModal";
import PlaylistSearchBar from "../../components/PlaylistSearchBar";

export default function Page() {
  const { user, loading } = useRequireAuth("/login");
  const params = useParams();
  const router = useRouter();

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

  // Testing delete movie delete modal
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Playlist display formatting
  const [gridView, setGridView] = useState(false);
  const [listView, setListView] = useState(false);
  // Was going to use the hover state of the delete button to mitigate overflow of requests
  // const [deleteHover, setDeleteHover] = useState(false);

  // Sorting Options


  // Search Filter results
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Search results match
  const normalize = (s) =>
  (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const filteredMovies = useMemo(() => {
    const q = normalize(query);
    if (!q) return movies;

    return movies.filter((m) => {
      const title = normalize(m.title);
      const releaseDate = normalize(m.release_date);

      // const releaseDate = (m.release_date || "").toLowerCase(); // not used but ppl can search for a movie from when it was released

      return title.includes(q) || releaseDate.includes(q);
    });
  }, [movies, query]);

  // Optional but good to stack requests and hide fetch wait times
  const handleSearchChange = (value) => {
    setQuery(value);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 150);

  };

  const clearSearch = () => {
    setQuery("");
  };


  // Check for guard against congesting requests with busy state, and also check for user and playlistId before making requests
  function askDeleteMovie(movie) {
    if (busy) return;
    setMovieToDelete(movie);
    setDeleteOpen(true);
  }

  function closeDeleteModal() {
    setDeleteOpen(false);
    setMovieToDelete(null);
  }

  async function confirmDeleteMovie() {
    if (!movieToDelete) return;
    await removeMovie(movieToDelete.id);
    closeDeleteModal();
  }



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
      const q = firestoreQuery(moviesCol, orderBy("addedAt", "desc"));
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
      <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 pt-12 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
            <div className="text-yellow-300 font-semibold">Missing playlist id in the URL.</div>
            <div className="text-zinc-400 mt-2">Go back and open the playlist again.</div>
            <Link href="/playlists" className="inline-block mt-4 text-yellow-400 hover:text-yellow-300">
              ← Back to Playlist
            </Link>
          </div>
        </div>
      </main>
    );
  }

  function handlePlaylistMovieClick(movieId) {
    router.push(`/movie/${movieId}?from=playlist&playlistId=${playlistId}`);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 pt-7 pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">

          {/* Removed previous back button link to playlists page to keep everything relatively consistent */}
          {/* <Link href="/playlists" className="text-zinc-300 hover:text-yellow-400">
            ← Back to Playlists
          </Link> */}

          <Link href="/playlists" className="inline-flex items-center gap-2 text-zinc-300 hover:text-yellow-400 group">
            <svg className="w-3 h-3 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Playlists
          </Link>



          <Link
            href="/movies"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm hover:cursor-pointer hover:border-zinc-500 hover:bg-zinc-900/60"
          >
            Browse Movies
          </Link>
        </div>

        <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6">
          <div className="text-sm text-zinc-500">Playlist</div>

          {!editing ? (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-3xl font-extrabold">
                <span className="bg-linear-to-r pb-2 from-yellow-400 to-orange-500 bg-clip-text text-transparent">{playlist?.name || "Untitled"}</span>
              </h1>

              <button
                disabled={busy}
                onClick={() => setEditing(true)}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 hover:cursor-pointer active:scale-95 hover:bg-zinc-900/50 disabled:opacity-60"
              >
                Rename
              </button>
            </div>
          ) : (
            <div className="mt-3 flex gap-2 flex-wrap">
              <input
                value={draft}
                maxLength={50}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") rename();
                  if (e.key === "Escape") {
                    setDraft(playlist?.name || "");
                    setEditing(false);
                  }
                }}
                className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
              />
              <button
                disabled={busy}
                onClick={rename}
                className="rounded-xl bg-yellow-500 px-4 py-2 font-semibold text-zinc-950 hover:cursor-pointer active:scale-95 hover:bg-yellow-400 disabled:opacity-60"
              >
                Save
              </button>
              <button
                disabled={busy}
                onClick={() => {
                  setDraft(playlist?.name || "");
                  setEditing(false);
                }}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-2 hover:cursor-pointer active:scale-95 hover:bg-zinc-900/50 disabled:opacity-60"
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

        <div className="mt-10">
          <h2 className="text-xl font-bold">Movies in this playlist</h2>
          <h3 className="mt-1 text-sm text-zinc-500">
            Sort By
          </h3>

          {/* Having the sort buttons and search bar centered looks good as well */}
          <div className="mt-2 gap-5 flex items-start flex-col mb-10 sm:mb-0 sm:items-center sm:flex-row sm:flex-wrap sm:justify-between">
            <div className="flex gap-2 items-center">
            <button
              disabled={busy}
              className={`rounded-xl border  ${gridView ? 'border-zinc-200' : 'border-zinc-700'} bg-zinc-950/40 w-12 h-12 hover:cursor-pointer active:scale-95 hover:bg-zinc-900/50 disabled:opacity-60`}
              onClick={() => {
                if (listView) { setListView(false); }
                setGridView(!gridView);
                }
              }
              >
              <div className="flex justify-center items-center"> 
                <div className={`grid grid-cols-2 gap-1 ${gridView ? '[&>div]:border-zinc-200' : ''}`}>             
                  <div className="border-2 border-zinc-400 w-2 h-2"></div>
                  <div className="border-2 border-zinc-400 w-2 h-2"></div>
                  <div className="border-2 border-zinc-400 w-2 h-2"></div>
                  <div className="border-2 border-zinc-400 w-2 h-2"></div>
                </div>  
              </div>
            </button>

            <button
              disabled={busy}
              className={`rounded-xl border  ${listView ? 'border-zinc-200' : 'border-zinc-700'} bg-zinc-950/40 w-12 h-12 hover:cursor-pointer active:scale-95 hover:bg-zinc-900/50 disabled:opacity-60`} 
              onClick={() => {
                if (gridView) { setGridView(false); }
                setListView(!listView);
                }               
              }
              >
              <div className="flex flex-col gap-1 justify-center items-center"> 
                  <div className={`flex gap-1 justify-center items-center ${listView ? '[&>div]:bg-zinc-200' : ''}`}>
                    <div className="bg-zinc-400 w-1 h-1"></div>
                    <div className=" bg-zinc-400 w-5 h-0.5"></div>                  
                  </div>
                  <div className={`flex gap-1 justify-center items-center ${listView ? '[&>div]:bg-zinc-200' : ''}`}>
                    <div className="bg-zinc-400 w-1 h-1"></div>
                    <div className=" bg-zinc-400 w-5 h-0.5"></div>                  
                  </div>
                  <div className={`flex gap-1 justify-center items-center ${listView ? '[&>div]:bg-zinc-200' : ''}`}>
                    <div className="bg-zinc-400 w-1 h-1"></div>
                    <div className=" bg-zinc-400 w-5 h-0.5"></div>                  
                  </div>
                </div>  

            </button>
            </div>

            <div className="">
              <PlaylistSearchBar 
                query={query}
                onSearchChange={handleSearchChange}
                isSearching={isSearching}
                onClearSearch={clearSearch}
                searchRef={searchRef}
              />      
            </div>        


          </div>


        </div>
        <div className={`mt-4 grid ${gridView ? 'sm:grid-cols-4 grid-cols-2 lg:grid-cols-6 gap-2' : `${listView ? 'gap-2' : 'gap-4 sm:grid-cols-2 lg:grid-cols-3'}` }`}>
          {filteredMovies.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 text-zinc-300">
              No movies yet. Add some from the Movies page.
            </div>
          ) : (
            filteredMovies.map((m) => (
              // hover:scale-101 active:scale-100 hover:cursor-pointer

              <div key={m.id} className={`flex ${listView ? 'flex-row justify-between hover:scale-101 hover:border-zinc-600 border-zinc-800' : 'border-zinc-800 bg-zinc-900/20'}  rounded-2xl border overflow-hidden`}>
                <div className={` ${listView ? 'flex flex-row gap-4' : 'flex flex-col'}`}>
                <div className={`bg-zinc-950/40 ${listView ? 'h-30 w-20 flex-shrink-0' : 'aspect-[2/3]'}`}>
                  {m.poster_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                      alt={m.title || "Movie poster"}
                      className="h-full w-full object-cover hover:cursor-pointer transition-all hover:brightness-110 hover:scale-105 active:scale-100"
                      // onClick={() => window.open(`https://www.themoviedb.org/movie/${m.movieId}`, "_blank")}
                      onClick={() => handlePlaylistMovieClick(m.movieId)}
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-zinc-500 text-sm">
                      No poster
                    </div>
                  )}
                </div>

              {/* ml-4 */}
                <div className={` ${listView ? ' mt-4' : 'p-4 flex flex-col flex-1'}`}>
                  <div className={`font-semibold hover:cursor-pointer active:scale-98`} onClick={() => handlePlaylistMovieClick(m.movieId)}>{m.title || "Untitled movie"}</div>
                  {m.release_date && <div className="text-sm text-zinc-500 mb-3">{m.release_date}</div>}

  
                  <button
                    disabled={busy}
                    // Replace with delete modal flow
                    // onClick={() => removeMovie(m.id)}

                    onClick={() => askDeleteMovie(m)}
                    className={`${listView ? 'hidden': 'mt-auto w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-200 hover:cursor-pointer hover:scale-105 hover:bg-red-500/15 disabled:opacity-60 active:scale-95'}`}
                  >
                    Remove
                  </button>

                </div>
                </div>


                {listView && (
                    <div className="my-auto mr-4">
                    <button disabled={busy} onClick={() => askDeleteMovie(m)} className="hover:text-red-600 active:scale-98 hover:cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 40 40">
                        <path fill="currentColor" d="M32.937 7.304H27.19v-.956c0-1.345-.423-2.32-1.278-2.915c-.604-.39-1.353-.588-2.224-.588h-6.441l-.014.003l-.014-.003h-.909c-2.259 0-3.503 1.244-3.503 3.503v.956H7.063a.75.75 0 0 0 0 1.5h.647l1.946 25.785c0 1.631.945 2.566 2.594 2.566h15.461c1.611 0 2.557-.93 2.592-2.51L32.25 8.804h.686a.75.75 0 0 0 .001-1.5m-2.302 2.976H9.326l-.111-1.476h21.531zM14.308 6.348c0-1.423.58-2.003 2.003-2.003h7.378c.578 0 1.053.117 1.389.333c.413.287.613.833.613 1.67v.956H14.308zm14.498 28.224c-.019.81-.295 1.083-1.095 1.083H12.25c-.818 0-1.094-.269-1.096-1.123L9.439 11.779h21.082z"></path>
                        <path fill="currentColor" d="M17.401 12.969a.75.75 0 0 0-.722.776l.704 19.354a.75.75 0 0 0 .748.723l.028-.001a.75.75 0 0 0 .722-.776l-.703-19.355c-.015-.414-.353-.757-.777-.721m-4.649.001a.75.75 0 0 0-.696.8l1.329 19.354a.75.75 0 0 0 .747.698l.053-.002a.75.75 0 0 0 .696-.8l-1.329-19.354a.756.756 0 0 0-.8-.696m9.784-.001c-.419-.04-.762.308-.776.722l-.705 19.354a.75.75 0 0 0 .722.776l.028.001a.75.75 0 0 0 .748-.723l.705-19.354a.75.75 0 0 0-.722-.776m4.649.001a.757.757 0 0 0-.8.696L25.056 33.02a.75.75 0 0 0 .696.8l.053.002a.75.75 0 0 0 .747-.698l1.329-19.354a.75.75 0 0 0-.696-.8"></path>
                      </svg>

                    </button>
                    </div>
                  
                  )}



              </div>
            ))
          )}
        </div>
      </div>

    {deleteOpen && movieToDelete && (
      <MovieDeleteModal
        movie={movieToDelete}
        onClose={closeDeleteModal}
        onDelete={confirmDeleteMovie}
        loading={busy}
      />
    )}

    </main>
  );
}




