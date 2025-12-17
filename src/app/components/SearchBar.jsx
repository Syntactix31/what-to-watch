"use client";
import { useState, useRef } from "react";

export function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const animationTrigger = useRef(0);

  const animatedSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath stroke-dasharray='40' stroke-dashoffset='40' d='M10.76 13.24c-2.34-2.34-2.34-6.14 0-8.49c2.34-2.34 6.14-2.34 8.49 0c2.34 2.34 2.34 6.14 0 8.49c-2.34 2.34-6.14 2.34-8.49 0Z'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' dur='1s' values='40;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='12' stroke-dashoffset='12' d='M10.5 13.5l-7.5 7.5'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='1s' dur='0.4s' values='12;0'/%3E%3C/path%3E%3C/g%3E%3C/svg%3E`;

  const staticSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23fff' stroke-width='2' viewBox='0 0 24 24'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M21 21l-4.35-4.35'/%3E%3C/svg%3E`;

  const handleFocus = () => {
    setIsFocused(true);
    animationTrigger.current += 1; 
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div 
      className="flex items-center border-2 border-white rounded-full px-4 py-2 bg-transparent transition-all duration-300 hover:border-yellow-200 focus-within:border-yellow-400 focus-within:shadow-[0_0_20px_rgba(255,215,0,0.5)] ml-175"
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <span
        key={animationTrigger.current}  // 🎯 This restarts the <animate> every focus
        style={{
          width: "24px",
          height: "24px",
          background: `url("${isFocused ? animatedSvg : staticSvg}") no-repeat center/contain`,
          display: "inline-block",
          transition: "transform 0.2s ease, filter 0.3s ease",
          ...(isFocused && {
            transform: "scale(1.1)",
            filter: "drop-shadow(0 0 8px #FFD700)"
          })
        }}
        className="mr-3 flex-shrink-0"
      />
      
      <input
        type="text"
        placeholder="Search movies, shows..."
        className="bg-transparent outline-none text-white placeholder-gray-400 w-32 sm:w-40 focus:w-64 transition-all duration-300 flex-1"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
}
