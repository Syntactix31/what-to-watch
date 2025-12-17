"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { SearchBar } from "./components/SearchBar";
import MovieContent from "./components/MovieContent";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./utils/firebase";



export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [featureStyle, setFeatureStyle] = useState({});
  const [opaqueStyle, setOpaqueStyle] = useState({ opacity: 0 });

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  

  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

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

  const [showButton, setShowButton] = useState(false);


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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, (u) => {
    setUser(u);
    setAuthReady(true);
  });
  return () => unsub();
  }, []);

  async function handleLogout() {
  await signOut(auth);
  }


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
        <div className="p-2.5">
          <SearchBar 
            query={query}
            onSearchChange={handleSearchChange}
            isSearching={isSearching}
            onClearSearch={clearSearch}
            suggestions={suggestions}
            searchRef={searchRef}
            hideHeader={true}
          />
        </div>

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
        {authReady && user ? (
  <div className="flex items-center gap-4">
    <span className="text-[#FFD700] text-sm max-w-[220px] truncate">
      {user.displayName || user.email}
    </span>

      <Link
        href="/dashboard"
        className="hover:border-yellow-200 text-[#FFD700] px-4 py-2 rounded-lg font-medium transition-colors border border-transparent"
      >
        Dashboard
      </Link>

      <Link
        href="/playlists"
        className="hover:border-yellow-200 text-[#FFD700] px-4 py-2 rounded-lg font-medium transition-colors border border-transparent"
      >
        Playlists
      </Link>

      <button
        onClick={handleLogout}
        className="hover:border-yellow-200 text-[#FFD700] px-6 py-2 rounded-lg font-medium transition-colors border border-transparent whitespace-nowrap"
      >
        Logout
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className="hover:border-yellow-200 text-[#FFD700] px-6 py-2 rounded-lg font-medium transition-colors border border-transparent mr-10"
    >
      Log In / Sign Up
    </Link>
  )}

      </div>
    </nav>

    <div className="content relative z-20 pt-48 pb-20"></div>
      {/* <header className="mt-40">
        <div className="container-text">
          <h1>What to</h1>
          <h1>Watch?</h1>
        </div>
      </header>   */}


      <div className="relative z-40">
        <div 
          className="feature fixed top-0 left-0 w-full h-screen bg-cover bg-center bg-[url('/movietheatre1.jpg')] z-10"
          style={featureStyle}
        >
        <div className="opaque absolute inset-0 pointer-events-none" style={opaqueStyle}></div>

        <header className="mt-25 flex flex-col items-center z-20 pt-20">
          <div className="container-text text-center">
            <h1>Don't know what to</h1>
            <h1>Watch?</h1>
          </div>
          {showButton && (

            
            <Link
              href="/movies"
              className="bg-transparent text-white  rounded-xl font-bold text-xl shadow-2xl hover:scale-105 active:scale-100 transition-all duration-500 border-2 border-white p-2 m-auto pointer-events-auto mt-2 fade-in-button"
              // Change to px-1 and no border for written text effect





              // text-white ml-60 font-bold text-lg hover:text-xl transition-all duration-300 shadow-2xl bg-transparent shover
            >
              Browse Catalogue
            </Link>
          )}        
        </header>  
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
