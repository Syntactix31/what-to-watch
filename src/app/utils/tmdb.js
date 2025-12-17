const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

export async function getTrendingMovies() {
  const res = await fetch(`${BASE}/trending/movie/week?api_key=${API_KEY}`);
  return res.json();
}

export async function getTopRatedMovies() {
  const res = await fetch(`${BASE}/movie/top_rated?api_key=${API_KEY}`);
  return res.json();
}

export async function getPopularMovies() {
  const res = await fetch(`${BASE}/movie/popular?api_key=${API_KEY}`);
  return res.json();
}

export async function searchMovies(query) {
  const res = await fetch(
    `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  return res.json();
}
