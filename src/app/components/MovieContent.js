"use client";

import { useEffect, useState, useRef } from "react";
import { MovieCard } from "./MovieCard";
import { MovieSection } from "./MovieSection";
import {
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
  searchMovies
} from "../utils/tmdb";

export default function MovieContent() {
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
    <div className="min-h-screen bg-transparent text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Discover Amazing Movies
          </h1>
          <p className="text-gray-400 mb-8">Find your next favorite film</p>

          {/* same search bar logic */}
          {/* you can keep all the JSX from before here unchanged */}
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
    </div>
  );
}



