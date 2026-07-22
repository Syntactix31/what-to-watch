"use client"

export default function PlaylistSearchBar({ 
  query,
  onSearchChange,
  isSearching,
  onClearSearch,
  searchRef
 }) {
  // Stale props: searchQuery, setSearchQuery,


  return(
    <div className="relative" ref={searchRef}>
      <div className="relative group">

        <div className="absolute -inset-1 bg-linear-to-r from-white to-white rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
        

        <div className="relative flex items-center bg-black backdrop-blur-sm rounded-full border border-zinc-200 hover:border-gray-400 transition-all duration-300">
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
            maxLength={100}
            id="search-home"
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search for a movie"   
            className="bg-transparent outline-none text-white placeholder-gray-500 w-40 sm:w-40 focus:w-54 transition-all duration-300 py-2"
            autoComplete="off"
          />
          
          <div className="pr-4 flex items-center">
            {isSearching && (
              <div className="w-5 h-5 border-2 border-zinc-200 border-t-transparent rounded-full animate-spin mr-3"></div>
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

    </div>



  );
}



