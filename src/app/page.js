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
    
    // Parallax zoom/blur effect
    const featureEl = document.querySelector('.feature');
    if (featureEl) {
      const size = 1.5 * featureEl.offsetWidth; // Initial zoom
      const newSize = Math.max(size - (fromTop / 3), featureEl.offsetWidth);
      const blur = Math.min(0 + (fromTop / 100), 5);
      const opacity = Math.max(1 - ((fromTop / document.documentElement.scrollHeight) * 1.3), 0);
      
      setFeatureStyle({
        backgroundSize: `${newSize}px`,
        filter: `blur(${blur}px)`,
        opacity: opacity
      });
    }
    
    // Opaque overlay for non-Webkit browsers
    if (!/Chrome|Safari/.test(navigator.userAgent)) {
      setOpaqueStyle({ opacity: Math.min(fromTop / 5000, 1) });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <main className="pt-20"> {/* Offset for fixed nav */}
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 px-6 py-4 flex items-center justify-between">
        <div className="hover-container">
          <h1 className="explosive-text">What To Watch?</h1>
        </div>
        <Link 
          href="/login" 
          className="hover:border-yellow-200 text-[#FFD700] px-6 py-2 rounded-lg font-medium transition-colors border border-transparent hover:border-yellow-200"
        >
          Log In
        </Link>
      </nav>

      <header className="mt-40">
        <div className="container-text">
          <h1>What to</h1>
          <h1>Watch?</h1>
        </div>
      </header>  

      <div>
        <Image src="/movietheatre1.jpg" alt="Movie Theatre" fill className="object-cover -z-10"/>
      </div>

      <div>
        <div 
          className="feature fixed top-0 left-0 w-full h-screen bg-cover bg-center bg-[url('/movietheatre1.jpg')] z-10"
          style={featureStyle}
        >
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
