const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

async function tmdbFetch(url, label) {
  if (!API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_TMDB_API_KEY. Add it to .env.local and restart dev server.");
  }

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${label} (TMDB ${res.status}): ${body}`);
  }

  return res.json();
}

export function getTrendingMovies() {
  return tmdbFetch(`${BASE}/trending/movie/week?api_key=${API_KEY}`, "Failed to fetch trending movies");
}

export function getTopRatedMovies() {
  return tmdbFetch(`${BASE}/movie/top_rated?api_key=${API_KEY}`, "Failed to fetch top rated movies");
}

export function getPopularMovies() {
  return tmdbFetch(`${BASE}/movie/popular?api_key=${API_KEY}`, "Failed to fetch popular movies");
}

export function searchMovies(query, page = 1) {
  return tmdbFetch(
    `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
    "Search failed"
  );
}

export async function searchAllMovies(query, maxPages = 20) {
  if (!query || query.trim().length < 2) {
    return { results: [], total_results: 0, total_pages: 0 };
  }

  const firstPage = await searchMovies(query, 1);
  const totalPages = Math.min(firstPage.total_pages || 1, maxPages);
  const allResults = [...(firstPage.results || [])];

  if (totalPages > 1) {
    const pagePromises = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(searchMovies(query, page));
    }

    const remainingPages = await Promise.all(pagePromises);
    remainingPages.forEach((p) => allResults.push(...(p.results || [])));
  }

  return {
    results: allResults,
    total_results: allResults.length,
    total_pages: totalPages,
  };
}
