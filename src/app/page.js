"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { SearchBar } from "./components/SearchBar";
import MovieContent from "./components/MovieContent";


export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [featureStyle, setFeatureStyle] = useState({});
  const [opaqueStyle, setOpaqueStyle] = useState({ opacity: 0 });

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const logoImages = [
    "regular",
    "golden",
    "silver",
    "bronze",
    "extrabuttery",
    "candycane",
    "charcoal",
    "key",
    "oreo",
    "pink",
    "monster",
    "cheesepowder",
    "caramel",
    "cottoncandy",
    "chocolate",
    "whiteout",
    "empty",
    "blackout",
  ];

  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  const handleSearchChange = async (value) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const { searchMovies } = await import("./utils/tmdb");
      const data = await searchMovies(value);
      const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setSuggestions(results.slice(0, 8));
    } catch (err) {
      console.error("searchMovies failed:", err);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };


  const cycleLogo = () => {
    setCurrentLogoIndex((prevIndex) => 
      prevIndex === logoImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleScroll = useCallback(() => {
    const fromTop = window.scrollY;
    setScrollY(fromTop);

    const featureEl = document.querySelector('.feature');
    if (featureEl) {
      const size = 1.5 * featureEl.offsetWidth;
      const newSize = Math.max(size - (fromTop / 3), featureEl.offsetWidth);
      const blur = Math.min(0 + (fromTop / 100), 5);
      const opacity = Math.max(1 - ((fromTop / document.documentElement.scrollHeight) * 1.3), 0);
      
      setFeatureStyle({
        backgroundSize: `${newSize}px`,
        filter: `blur(${blur}px)`,
        opacity: opacity
      });
    }
    
    if (!/Chrome|Safari/.test(navigator.userAgent)) {
      setOpaqueStyle({ opacity: Math.min(fromTop / 5000, 1) });
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <main className="pt-20 relative">
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 px-8 py-4 flex items-center justify-between">

      <div className="flex items-center space-x-4">
        <div onClick={cycleLogo} className="cursor-pointer">
          <img
            src={`/img/${logoImages[currentLogoIndex]}.png`}
            width={48}
            height={48}
            alt="PopCorn Logo"
            className="w-12 h-12 object-contain rounded-full hover:scale-110 transition-transform"
            loading="eager" 
          />
        </div>

        <div className="hover-container">
          <h1 className="text-shimmer normal-case">WhatToWatch</h1>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <SearchBar 
          query={query}
          onSearchChange={handleSearchChange}
          isSearching={isSearching}
          onClearSearch={clearSearch}
          suggestions={suggestions}
          searchRef={searchRef}
          hideHeader={true}
        />

        {/* <div className="search-container flex items-center border-2 border-white rounded-full px-4 py-2 text-[#6e6d6d] bg-transparent transition-colors focus-within:border-yellow-200">
          <span className="line-md--search mr-2"></span>
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-white placeholder-[#6e6d6d] w-32 sm:w-40 focus:w-64 transition-all duration-300"
          />
        </div> */}


        {/* <Link
          href="/movies"
          className="bg-yellow-400 text-black p-2 rounded-lg font-medium hover:bg-yellow-300 transition mx-10 w-40"
        >
          Browse Movies
        </Link> */}
        <Link
          href="/login"
          className="hover:border-yellow-200 text-[#FFD700] px-6 py-2 rounded-lg font-medium transition-colors border border-transparent hover:border-yellow-200 mr-5"
        >
          Log In / Sign Up
        </Link>
      </div>
    </nav>

    <div className="content relative z-20 pt-48 pb-20"></div>
      {/* <header className="mt-40">
        <div className="container-text">
          <h1>What to</h1>
          <h1>Watch?</h1>
        </div>
      </header>   */}


      <div>
        <div 
          className="feature fixed top-0 left-0 w-full h-screen bg-cover bg-center bg-[url('/movietheatre1.jpg')] z-10"
          style={featureStyle}
        >

        <header className="mt-40 flex flex-col items-center">
          <div className="container-text text-center">
            <h1>Don't know what to</h1>
            <h1>Watch?</h1>
          </div>
          <Link
            href="/movies"
            className="text-white ml-60 font-bold text-lg hover:scale-110 transition-all duration-300 shadow-2xl hover:underline white"
          >
            Browse Movies
          </Link>         
        </header>  
          <div className="opaque absolute inset-0" style={opaqueStyle}></div>
        </div>
        <div className="content relative z-20 p-12 text-white max-w-7xl mx-auto w-full">
          <MovieContent 
            query={query}
            suggestions={suggestions}
            onSuggestionClick={(movieId) => {
              window.location.href = `/movie/${movieId}`;
            }}
          />
        </div>

      </div>
    </main>
  );
}
