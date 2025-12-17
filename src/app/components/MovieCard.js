import Image from "next/image";
import Link from "next/link";

export default function MovieCard({ movie, compact = false }) {
  if (!movie?.id) return null;

  return (
    <Link 
      href={`/movie/${movie.id}`} 
      className="block group"
      prefetch={false} 
    >
      <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="relative overflow-hidden rounded-xl mb-3">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={compact ? 80 : 224}
            height={compact ? 120 : 336}
            className="rounded-xl shadow-lg group-hover:shadow-2xl group-hover:shadow-yellow-500/20 transition-all duration-300"
          />
          
          {/* rating icon */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-yellow-400 px-2 py-1 rounded-full text-sm font-bold">
            ⭐ {movie.vote_average?.toFixed(1)}
          </div>
          
          {/* hovering overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-white text-sm line-clamp-2">{movie.overview}</p>
          </div>
        </div>
        
        {!compact && (
          <div>
            <h3 className="font-semibold text-lg mb-1 group-hover:text-yellow-300 transition-colors line-clamp-1">
              {movie.title}
            </h3>
            <p className="text-gray-400 text-sm">
              {movie.release_date?.split('-')[0] || 'N/A'}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}