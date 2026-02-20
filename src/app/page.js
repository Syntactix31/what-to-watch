"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { SearchBar } from "./components/SearchBar";
import Footer from "./components/Footer";
import MovieContent from "./components/MovieContent";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./utils/firebase";
import { useRouter } from "next/navigation";




export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [featureStyle, setFeatureStyle] = useState({});
  const [opaqueStyle, setOpaqueStyle] = useState({ opacity: 0 });

  const [query, setQuery] = useState("");
  const router = useRouter();
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

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
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 pr-8 pl-4 sm:px-8 py-4 sm:flex sm:items-center sm:justify-between">

      {/* Left side: Logo + Title + Hamburger (mobile only) */}

<div className=" max-sm:flex max-sm:items-center max-sm:justify-between">
        <div className="sm:flex sm:gap-4   max-sm:flex max-sm:items-center max-sm:gap-2">
          <div onClick={cycleLogo} className="cursor-pointer max-[330px]:hidden">
            <img
              src={`/img/${logoImages[currentLogoIndex]}.png`}
              width={64}
              height={64}
              
              alt="PopCorn Logo"
              className="object-contain hover:scale-110 transition-transform active:scale-100 w-12 h-12"
              loading="eager" 
            />

            {/* Alternate image format for betetr mobile view */}
            {/* <Image
              src={`/img/${logoImages[currentLogoIndex]}.png`}
              alt="PopCorn Logo"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 40px, 48px"
              priority  // Since it's above-the-fold logo
            /> */}
          </div>

          <div className="hover-container">
            <h1 className="text-shimmer shimmer-fontsize normal-case">WhatToWatch</h1>
          </div>
        </div>

        {/* Hamburger Menu - Mobile Only */}
        <button
          className="sm:hidden p-2 -mr-2 hover:text-white transition-colors ml-4"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
</div>

      <div className="items-center space-x-6 hidden sm:flex">
        <div className="p-2.5">
          <SearchBar 
            query={query}
            onSearchChange={handleSearchChange}
            isSearching={isSearching}
            onClearSearch={clearSearch}
            suggestions={suggestions}
            searchRef={searchRef}
            onSuggestionClick={(id) => router.push(`/movie/${id}`)}  // or /movies/${id}
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
    <span className="text-shimmer text-sm max-w-55 truncate">
      {user.displayName || user.email}
    </span>

      <Link
        href="/dashboard"
        className="hover:border-zinc-400 text-zinc-200 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent active:scale-95"
      >
        Dashboard
      </Link>

      <Link
        href="/playlists"
        className="hover:border-zinc-400 text-zinc-200 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent active:scale-95"
      >
        Playlists
      </Link>

      <button
        onClick={handleLogout}
        className="hover:border-zinc-400 text-zinc-200 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent mr-10 active:scale-95"
      >
        Log Out
      </button>
    </div>
  ) : (
                        //   Maybe change the primary colours to: hover:border-red-200 text-red-300 or hover:border-yellow-200 text-gold-[#FFD700] or hover:border-yellow-200 hover:text-yellow-200 with the zinc text
    <Link
      href="/login"
      className="hover:border-zinc-400 text-zinc-200 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent mr-10 active:scale-95"
    >
      Log In / Sign Up
    </Link>
  )}

      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/80 backdrop-blur-md border-t border-zinc-700 pt-4 pb-6 sm:hidden z-50 animate-fadeIn">
          <div className="px-8 space-y-3 text-center">
            {authReady && user ? (
              <>
                <Link 
                  href="/dashboard"
                  className="text-shimmer block w-full px-4 py-3 rounded-xl bg-black hover:bg-zinc-800 transition-all text-lg font-medium z-60"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/playlists"
                  className="text-shimmer block w-full px-4 py-3 rounded-xl bg-black hover:bg-zinc-800 transition-all text-lg font-medium z-60"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Playlists
                </Link>
                <button
                  onClick={async () => {
                    await handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-shimmer w-full px-4 py-3 rounded-xl bg-black hover:bg-zinc-800 transition-all text-lg font-medium z-60"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-shimmer block w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-zinc-700/50 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 text-lg font-semibold border-2 bg-black border-zinc-500 hover:border-zinc-400 transition-all shadow-lg z-60"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}

    </nav>

    <div className="content relative z-20 pt-48 pb-20"></div>
      {/* <header className="mt-40">
        <div className="container-text">
          <h1>What to</h1>
          <h1>Watch?</h1>
        </div>
      </header>   */}


      <div className="relative z-40 mb-8">
        <div 
          className="feature fixed top-0 left-0 w-full h-screen bg-cover bg-no-repeat bg-center bg-[url('/movietheatre1.jpg')] z-10"
          style={featureStyle}
        >
        <div className="opaque absolute inset-0 pointer-events-none" style={opaqueStyle}></div>

        <header className="mt-20 md:mt-20 lg:mt-35 flex flex-col items-center z-20 pt-20">
            <div className="container-text text-center scale-80 sm:scale-100 transition-all">
              <div className=""><h1 className="ml-0 md:ml-[27.5%] lg:ml-[35%]!">Don't know what to</h1></div>

              {/* sm:ml-[19%] md:ml-[27.5%] lg:ml-[35%] */}

              <h1 className="">Watch?</h1>
            </div>
          {showButton && (

            
            <Link
              href="/movies"
              className="bg-transparent text-white  rounded-xl font-bold text-xl shadow-2xl sm:hover:scale-105 sm:active:scale-100 hover:scale-85 active:scale-80 transition-all duration-500 border-2 border-white p-2 m-auto pointer-events-auto sm:mt-2 fade-in-button scale-80 sm:scale-100"
              // Change to px-1 and no border for written text effect





              // text-white ml-60 font-bold text-lg hover:text-xl transition-all duration-300 shadow-2xl bg-transparent shover
            >
              Browse Catalogue
            </Link>
          )}        
        </header>  
        </div>


        <div className="content relative z-20 p-4 sm:p-12 text-white max-w-7xl mx-auto w-full">
          <MovieContent 
            query={query}
            suggestions={suggestions}
            onSuggestionClick={(movieId) => {
              window.location.href = `/movie/${movieId}`;
            }}
          />
        </div>

        <div className="relative z-20 pointer-events-auto">
          <Footer />

        </div>


      </div>
    </main>
  );
}





/**  TODO
 * 
 * Fix nav bar formatting on small viewport sizes + logo button shows on mobile nav with login text -> replace with login image
 * (should just have title and login - users will have to navigate to movie dashboard to search)
 * 
 * On signin the nav should have the profile photo in the top right corner when pressed has drop down menu with list: Username, Dashboard, Playlists, Logout
 * 
 * Include tv shows search
 * Add tv-shows and additional tv preview content on movie page only (not homepage)
 * 
 * 
 * 
 */