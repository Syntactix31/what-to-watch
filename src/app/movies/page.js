"use client";

import { useEffect, useState, useRef } from "react";
import MovieCard from "../components/MovieCard";
import {
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
  searchMovies
} from "../utils/tmdb";

export default function MoviesPage() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    getTrendingMovies().then(d => setTrending(d.results));
    getTopRatedMovies().then(d => setTopRated(d.results));
    getPopularMovies().then(d => setPopular(d.results));
    
  
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
    const data = await searchMovies(value);
    setSuggestions(data.results.slice(0, 8));
    setIsSearching(false);
  }

  function clearSearch() {
    setQuery("");
    setSuggestions([]);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* header with search */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Discover Amazing Movies
          </h1>
          <p className="text-gray-400 mb-8">Find your next favorite film</p>
          
          {/* enchaned search bar*/}
          <div className="relative max-w-2xl mx-auto" ref={searchRef}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              
              <div className="relative flex items-center bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
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

            {/* search suggestions (autofill) */}
            {suggestions.length > 0 && (
              <div className="absolute mt-3 w-full bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 z-50 overflow-hidden animate-fadeIn">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-yellow-400">Search Results</h3>
                    <span className="text-sm text-gray-400">{suggestions.length} found</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestions.map(movie => (
                      <div 
                        key={movie.id} 
                        className="group bg-gray-800/60 hover:bg-gray-700/80 rounded-xl p-3 transition-all duration-200 border border-transparent hover:border-yellow-400/30 cursor-pointer"
                        onClick={() => {
                          window.location.href = `/movie/${movie.id}`;
                        }}
                      >
                        <div className="flex gap-3">
                          {movie.poster_path && (
                            <div className="flex-shrink-0">
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
                  
                  <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                    <button 
                      onClick={() => {
                        // too lazy but could add a page for this
                        console.log('View all results for:', query);
                      }}
                      className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                    >
                      View all results for "{query}"
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

function MovieSection({ title, subtitle, movies }) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-gray-400">{subtitle}</p>}
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {movies.map(movie => (
          <div key={movie.id} className="flex-shrink-0 w-48 md:w-56">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}