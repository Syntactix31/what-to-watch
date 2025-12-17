"use client";

import { useEffect, useState, useRef } from "react";
import MovieCard from "../components/MovieCard";
import MovieSection from "../components/MovieSection";
import { SearchBar } from "../components/SearchBar";

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

  if (value.trim().length < 2) {
    setSuggestions([]);
    setIsSearching(false);
    return;
  }

  setIsSearching(true);

  try {
    const data = await searchMovies(value);

    const results =
      Array.isArray(data?.results) ? data.results :
      Array.isArray(data) ? data :
      [];

    setSuggestions(results.slice(0, 8));
  } catch (err) {
    console.error("searchMovies failed:", err);
    setSuggestions([]);
  } finally {
    setIsSearching(false);
  }
}


  function clearSearch() {
    setQuery("");
    setSuggestions([]);
  }

  return (
    // For a cooler style mb use backdrop-blur-sm or md for a glass effect ( but not on main page )
    <main className="min-h-screen bg-transparent text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Discover Amazing Movies
          </h1>
          <p className="text-gray-400 mb-8">Find your next favorite film</p>
          
          <div className="max-w-2xl mx-auto">
            <SearchBar
              query={query}
              onSearchChange={handleSearchChange}
              isSearching={isSearching}
              onClearSearch={clearSearch}
              suggestions={suggestions}
              searchRef={searchRef}
              onSuggestionClick={(id) => (window.location.href = `/movie/${id}`)}
            />
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



