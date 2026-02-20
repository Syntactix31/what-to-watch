"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MovieCard from "../components/MovieCard";
import Link from "next/link";
import { searchAllMovies } from "../utils/tmdb.js";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [originalResults, setOriginalResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSort, setActiveSort] = useState("relevance");

  useEffect(() => {
    async function fetchAllResults() {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const cachedQuery = sessionStorage.getItem('searchQuery');
        const cachedResults = sessionStorage.getItem('searchResults');
        
        if (cachedQuery === query && cachedResults) {
          const parsedResults = JSON.parse(cachedResults);
          setResults(parsedResults);
          setOriginalResults(parsedResults);
        } else {
          const data = await searchAllMovies(query, 20);
          setResults(data.results || []);
          setOriginalResults(data.results || []);
          sessionStorage.setItem('searchQuery', query);
          sessionStorage.setItem('searchResults', JSON.stringify(data.results || []));
        }
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchAllResults();
  }, [query]);

  // Sorting functions
  const handleSort = (sortType) => {
    setActiveSort(sortType);
    
    if (sortType === "relevance") {
      setResults([...originalResults]);
      return;
    }

    const sorted = [...results];
    
    switch (sortType) {
      case "popularity":
        sorted.sort((a, b) => b.popularity - a.popularity);
        break;
      case "rating":
        sorted.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case "date":
        sorted.sort((a, b) => {
          const dateA = new Date(a.release_date || 0);
          const dateB = new Date(b.release_date || 0);
          return dateB - dateA;
        });
        break;
      default:
        return;
    }
    
    setResults(sorted);
  };

  // Button styling function
  const getSortButtonClass = (sortType) => {
    const baseClass = "px-4 py-2 rounded-lg font-medium transition-all duration-200";
    return activeSort === sortType
      ? `${baseClass} bg-yellow-400 text-black hover:bg-yellow-300`
      : `${baseClass} bg-gray-800 text-white hover:bg-gray-700`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link href="/movies" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-4">
              ← Back to Browse
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Searching...</h1>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400">Finding movies for "{query}"</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/movies" 
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Movies
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Results for "<span className="text-yellow-400">{query}</span>"
              </h1>
              <p className="text-gray-400">
                Found <span className="font-semibold text-white">{results.length.toLocaleString()}</span> movie{results.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2">
              <span className="text-sm text-gray-400">Showing all results</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {results.length > 0 ? (
          <>
            {/* Sort Controls */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">Sort by:</h3>
                <div className="text-sm text-gray-500">
                  {activeSort === "relevance" ? "Default order" : `Sorted by ${activeSort}`}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleSort("relevance")}
                  className={getSortButtonClass("relevance")}
                >
                  <div className="flex items-center gap-2 cursor-pointer">
                    {activeSort === "relevance" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Relevance
                  </div>
                </button>
                
                <button
                  onClick={() => handleSort("popularity")}
                  className={getSortButtonClass("popularity")}
                >
                  <div className="flex items-center gap-2 cursor-pointer">
                    {activeSort === "popularity" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Popularity
                  </div>
                </button>
                
                <button
                  onClick={() => handleSort("rating")}
                  className={getSortButtonClass("rating")}
                >
                  <div className="flex items-center gap-2 cursor-pointer">
                    {activeSort === "rating" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Rating
                  </div>
                </button>
                
                <button
                  onClick={() => handleSort("date")}
                  className={getSortButtonClass("date")}
                >
                  <div className="flex items-center gap-2 cursor-pointer">
                    {activeSort === "date" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Release Date
                  </div>
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {results.map((movie, index) => (
                <div key={`${movie.id}-${index}`} className="relative">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {/* End of Results */}
            <div className="mt-12 pt-8 border-t border-gray-800 text-center">
              <p className="text-gray-400 mb-6">End of results • {results.length.toLocaleString()} movies found</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/movies"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  New Search
                </Link>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-300 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Back to Top
                </button>
              </div>
            </div>
          </>
        ) : query ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg className="w-20 h-20 text-gray-700 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">No results found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              No movies match "<span className="text-white">{query}</span>". Try a different search term.
            </p>
            <Link 
              href="/movies"
              className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-300 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Try Another Search
            </Link>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg className="w-20 h-20 text-gray-700 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">What are you looking for?</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Search for movies.
            </p>
            <Link 
              href="/movies"
              className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-300 transition"
            >
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}