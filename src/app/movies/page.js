"use client";

import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useEffect, useState, useRef } from "react";
import MovieCard from "../components/MovieCard";
import MovieSection from "../components/MovieSection";
import { useRouter } from "next/navigation";
import {
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
  searchMovies,
  searchAllMovies
} from "../utils/tmdb.js";

export default function MoviesPage() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }


  useEffect(() => {
    getTrendingMovies().then(d => setTrending(d.results || []));
    getTopRatedMovies().then(d => setTopRated(d.results || []));
    getPopularMovies().then(d => setPopular(d.results || []));
    
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSearchChange(value) {
    setQuery(value);
    
    if (value.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchMovies(value);
      setSuggestions(data.results?.slice(0, 16) || []);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }

  async function handleViewAllResults() {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      const allData = await searchAllMovies(query, 20);
      sessionStorage.setItem('searchQuery', query);
      sessionStorage.setItem('searchResults', JSON.stringify(allData.results));
      sessionStorage.setItem('totalResults', allData.total_results.toString());
      
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Error fetching all results:', error);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSuggestionClick(movieId) {
    router.push(`/movie/${movieId}`);
  }

  function clearSearch() {
    setQuery("");
    setSuggestions([]);
  }

  return (
    <main className="min-h-screen bg-transparent text-white p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
      <Link href="/" className="text-lg font-bold">
        <span className="text-red-500">What</span> To Watch
      </Link>

      {authReady && user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300 max-w-[220px] truncate">
            {user.displayName || user.email}
          </span>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-400 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/playlists"
            className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-400 transition"
          >
            Playlists
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-400 transition whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-400 transition"
        >
          Log In / Sign Up
        </Link>
      )}
    </header>

      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Discover Amazing Movies
          </h1>
          <p className="text-gray-400 mb-8">Find your next favorite film</p>
          
          <div className="relative max-w-2xl mx-auto" ref={searchRef}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full blur opacity-0 group-hover:opacity-70 transition-all duration-500"></div>
              
              <div className="relative flex items-center bg-black backdrop-blur-sm rounded-full border-2 border-white hover:border-orange-400 transition-all duration-300 shadow-lg hover:shadow-orange-500/25">
                {/* search icon */}
                <div className="pl-5 pr-3">
                  <svg 
                    className="w-6 h-6 text-gray-400 group-hover:text-yellow-400 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                
                {/* input */}
                <input
                  value={query}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Search for movies"
                  className="w-full py-4 pr-5 bg-transparent outline-none text-white placeholder-gray-500 text-lg"
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && query.trim()) {
                      e.preventDefault();
                      handleViewAllResults();
                    }
                  }}
                />
                
                {/* loading */}
                <div className="pr-4 flex items-center">
                  {isSearching && (
                    <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                  )}
                  
                  {query && (
                    <button 
                      onClick={clearSearch}
                      className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
                      aria-label="Clear search"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* search suggestions (autofill) with 16 now */}
            {suggestions.length > 0 && (
              <div className="absolute mt-3 w-full bg-black border border-gray-800 z-50 max-h-96 overflow-y-auto scrollbar-hide rounded-2xl shadow-2xl animate-fadeIn">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-500">Search Results</h3>
                    <span className="text-sm text-gray-400">{suggestions.length} found</span>
                  </div>
                  
                  <div className="max-h-128 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestions.map(movie => (
                        <div 
                          key={movie.id} 
                          className="group bg-gray-800/60 hover:bg-gray-700/80 rounded-xl p-3 transition-all duration-200 border border-transparent hover:border-white cursor-pointer"
                          onClick={() => handleSuggestionClick(movie.id)}
                        >
                          <div className="flex gap-3">
                            {movie.poster_path && (
                              <div className="shrink-0">
                                <img 
                                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                                  alt={movie.title}
                                  className="w-16 h-24 object-cover rounded-lg"
                                />
                              </div>
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate group-hover:text-yellow-300 transition-colors">
                                {movie.title}
                              </h4>
                              
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-yellow-400">⭐ {movie.vote_average?.toFixed(1)}</span>
                                <span className="text-gray-400 text-sm">•</span>
                                <span className="text-gray-400 text-sm">
                                  {movie.release_date?.split('-')[0] || 'N/A'}
                                </span>
                              </div>
                              
                              {movie.overview && (
                                <p className="text-gray-400 text-sm line-clamp-2 mt-2">
                                  {movie.overview}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Added the view all */}
                  <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                    <button 
                      onClick={handleViewAllResults}
                      className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors inline-flex items-center gap-1 group"
                    >
                      <span>View all results for "{query}"</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* movie sections */}
        <div className="space-y-16">
          <MovieSection 
            title="🔥 Trending Now" 
            subtitle="What everyone is watching"
            movies={trending} 
          />
          
          <MovieSection 
            title="🏆 Top Rated" 
            subtitle="Critically acclaimed masterpieces"
            movies={topRated} 
          />
          
          <MovieSection 
            title="📈 Popular" 
            subtitle="Currently trending worldwide"
            movies={popular} 
          />
        </div>
      </div>
    </main>
  );
}