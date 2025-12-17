"use client";

import { useEffect, useState } from "react";
import { MovieCard } from "./MovieCard";
import  MovieSection  from "./MovieSection";
import {
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
} from "../utils/tmdb";

export default function MovieContent({ query = "", suggestions = [], className }) {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    getTrendingMovies().then(d => setTrending(d.results));
    getTopRatedMovies().then(d => setTopRated(d.results));
    getPopularMovies().then(d => setPopular(d.results));
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-16">
        <MovieSection title="🔥 Trending Now" subtitle="What everyone is watching" movies={trending}
        className="bg-black/30 rounded-lg p-4 backdrop-blur-sm" />

        <MovieSection title="🏆 Top Rated" subtitle="Critically acclaimed masterpieces" movies={topRated}
        className="bg-black/30 rounded-lg p-4 backdrop-blur-sm" />
        <MovieSection title="📈 Popular" subtitle="Currently trending worldwide" movies={popular}
        className="bg-black/30 rounded-lg p-4 backdrop-blur-sm" />
      </div>
    </div>
  );
}



