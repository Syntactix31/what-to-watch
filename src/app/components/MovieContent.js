"use client";

import { useEffect, useState } from "react";
import { MovieCard } from "./MovieCard";
import  MovieSection  from "./MovieSection";
import {
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
} from "../utils/tmdb";

export default function MovieContent({ query = "", suggestions = [] }) {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    getTrendingMovies().then(d => setTrending(d.results));
    getTopRatedMovies().then(d => setTopRated(d.results));
    getPopularMovies().then(d => setPopular(d.results));
  }, []);

  return (
    <div className="w-full">
      {query && suggestions.length > 0 && (
        <div className="mb-16 p-6 bg-gray-900/50 rounded-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">
            Search Results for "{query}"
          </h2>

        </div>
      )}

      
      <div className="space-y-16">
        <MovieSection title="🔥 Trending Now" subtitle="What everyone is watching" movies={trending} />
        
        <MovieSection title="🏆 Top Rated" subtitle="Critically acclaimed masterpieces" movies={topRated} />
        <MovieSection title="📈 Popular" subtitle="Currently trending worldwide" movies={popular} />
      </div>
    </div>
  );
}



