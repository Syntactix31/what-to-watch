const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

export async function getTrendingMovies() {
  const res = await fetch(`${BASE}/trending/movie/week?api_key=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch trending movies');
  return res.json();
}

export async function getTopRatedMovies() {
  const res = await fetch(`${BASE}/movie/top_rated?api_key=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch top rated movies');
  return res.json();
}

export async function getPopularMovies() {
  const res = await fetch(`${BASE}/movie/popular?api_key=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch popular movies');
  return res.json();
}

// Single page search for a couple of movies
export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

// Fetch ALL pages if there are a bunch of movies
export async function searchAllMovies(query, maxPages = 20) {
  if (!query || query.trim().length < 2) {
    return { results: [], total_results: 0, total_pages: 0 };
  }

  try {
    const firstPage = await fetch(
      `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`
    ).then(res => {
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    });

    const totalPages = Math.min(firstPage.total_pages || 1, maxPages);
    const allResults = [...(firstPage.results || [])];

    // For more than one page
    if (totalPages > 1) {
      const pagePromises = [];
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(
          fetch(
            `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
          ).then(res => {
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            return res.json();
          })
        );
      }

      const remainingPages = await Promise.all(pagePromises);
      remainingPages.forEach(pageData => {
        allResults.push(...(pageData.results || []));
      });
    }

    return {
      results: allResults,
      total_results: allResults.length,
      total_pages: totalPages
    };
  } catch (error) {
    console.error('Error fetching all movies:', error);
    return { results: [], total_results: 0, total_pages: 0 };
  }
}