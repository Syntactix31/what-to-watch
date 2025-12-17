"use client"; // Add this at top for client-side only
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [featureStyle, setFeatureStyle] = useState({});
  const [opaqueStyle, setOpaqueStyle] = useState({ opacity: 0 });

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
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <main className="pt-20 relative">
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 px-6 py-4 flex items-center justify-between">
        <div className="hover-container">
          <h1 className="explosive-text">WhatToWatch</h1>
        </div>
        {/* <div className="ml-200">
          <h2 className="font-bold border-2 rounded-4xl border-white py-2 px-15 text-[#6e6d6d]"> Search</h2>
        </div> */}
        <div className="search-container flex items-center border-2 border-white rounded-full px-4 py-2 text-[#6e6d6d] bg-transparent transition-colors focus-within:border-yellow-200">
          <span className="line-md--search mr-2"></span>
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-white placeholder-[#6e6d6d] w-32 sm:w-40 focus:w-64 transition-all duration-300"
          />
        </div>

        <Link 
          href="/login" 
          className="hover:border-yellow-200 text-[#FFD700] px-6 py-2 rounded-lg font-medium transition-colors border border-transparent hover:border-yellow-200"
        >
          Log In
        </Link>
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

        <header className="mt-40">
          <div className="container-text">
            <h1>What to</h1>
            <h1>Watch?</h1>
          </div>
        </header>  
          <div className="opaque absolute inset-0" style={opaqueStyle}></div>
        </div>
        <div className="content relative z-20 bg-black/50 p-12 text-white max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Heading</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscfing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. </p>
          <p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. </p>
          <p>Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. </p>
          <h2>Heading</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. </p>
          <p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. </p>
          <p>Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. </p>
        </div>
      </div>
    </main>
  );
}
