import { useRef, useEffect, useState, useCallback } from "react";
import MovieCard from "./MovieCard";

export default function MovieSection({ title, subtitle, movies }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleWheel = useCallback((e) => {
    if (e.deltaY === 0) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = e.deltaY * 2.5;
    el.scrollBy({ left: scrollAmount, behavior: 'auto' });
  }, []);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    const el = scrollRef.current;
    if (!el) return;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    e.preventDefault();
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 2.5;
    el.scrollLeft = scrollLeft.current - walk;
  }, [isDragging]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.style.scrollbarWidth = 'none';
    el.style.msOverflowStyle = 'none';

    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-gray-400">{subtitle}</p>}
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide  cursor-grab active:cursor-grabbing select-none"
        style={{
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="shrink-0 w-48 md:w-56 snap-start">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
