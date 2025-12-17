"use client";
import { forwardRef } from "react";

const SearchBar = forwardRef(({ 
  query, 
  onSearchChange, 
  isSearching, 
  onClearSearch, 
  suggestions, 
  searchRef, 
  hideHeader = false,
}, ref) => {
  return (
    <div className="relative" ref={searchRef}>
      <div className="relative group">

        <div className="absolute -inset-1 bg-linear-to-r from-white to-white rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
        

        <div className="relative flex items-center bg-black backdrop-blur-sm rounded-full border border-white hover:border-gray-400 transition-all duration-300">
          <div className="pl-5 pr-3">
            <svg 
              className="w-6 h-6 text-gray-400 group-hover:text-gray-200 transition-colors" 
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
          
          <input
            value={query}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search for movies, shows..."
            className="bg-transparent outline-none text-white placeholder-gray-500 w-32 sm:w-40 focus:w-64 transition-all duration-300 px-4 py-2"
            autoComplete="off"
          />
          
          <div className="pr-4 flex items-center">
            {isSearching && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
            )}
            {query && (
              <button 
                onClick={onClearSearch}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
                aria-label="Clear search"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute mt-2 w-full bg-black border border-gray-800 z-50 overflow-hidden animate-fadeIn max-h-96 overflow-y-auto rounded-2xl scrollbar-hide">
          <div className="p-4">
            {!hideHeader && (
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white">Search Results</h3>
                <span className="text-sm text-gray-400">{suggestions.length} found</span>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-white">Search Results</h3>
              <span className="text-sm text-gray-400">{suggestions.length} found</span>
            </div>
            
            <div className="space-y-2">
              {suggestions.map(movie => (
                <div 
                  key={movie.id} 
                  className="group bg-gray-800/60 hover:bg-gray-700/80 rounded-xl p-3 transition-all duration-200 border border-transparent hover:border-gray-400/50 cursor-pointer"
                  onClick={() => onSuggestionClick?.(movie.id)}
                >
                  <div className="flex gap-3 items-center">
                    {movie.poster_path && (
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                        alt={movie.title}
                        className="w-12 h-18 object-cover rounded-lg shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold truncate group-hover:text-gray-200">{movie.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                        <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                        <span>{movie.release_date?.split('-')[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
export { SearchBar };
