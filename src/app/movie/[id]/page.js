import Image from "next/image";
import { notFound } from 'next/navigation';
import TrackRecentlyViewed from "../../components/TrackRecentlyViewed";
import AddToPlaylist from "../../components/AddToPlaylist";
import MovieReview from "../../components/MovieReview";


// Fetch function
async function getMovie(id) {
  if (!id) return null;
  
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
  if (!apiKey) {
    console.error('TMDB API Key is missing');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`,
      { 
        next: { revalidate: 3600 } 
      }
    );

    if (!response.ok) {
      console.error(`TMDB API error: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
}

// Main component
export default async function MovieDetailsPage({ params }) {
  const { id } = await params;
  
  if (!id) {
    return <div className="p-10">No movie ID provided</div>;
  }

  const movie = await getMovie(id);

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-transparent text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* back button */}
        <div className="mb-6">
          <a 
            href="/movies" 
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
          >
            ← Back to Movies
          </a>
        </div>

        {/* Movie Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* poser for movie */}
          <div className="shrink-0">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={400}
                height={600}
                className="rounded-lg shadow-2xl"
                priority
              />
            ) : (
              <div className="w-100 h-150 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No Image Available</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="text-xl text-gray-300 italic mb-6">"{movie.tagline}"</p>
            )}
            
            {/* Rating and Info */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="text-2xl font-bold">{movie.vote_average?.toFixed(1)}</span>
                <span className="text-gray-400">/10</span>
              </div>
              
              <span className="text-gray-300">•</span>
              
              {movie.runtime && (
                <span className="text-gray-300">{movie.runtime} min</span>
              )}
              
              <span className="text-gray-300">•</span>
              
              {movie.release_date && (
                <span className="text-gray-300">{new Date(movie.release_date).getFullYear()}</span>
              )}
            </div>
            
            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(genre => (
                  <span 
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            
            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{movie.overview}</p>
            </div>
            
            {/* Top Cast for Movie */}
            {movie.credits?.cast?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Top Cast</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {movie.credits.cast.slice(0, 6).map(actor => (
                    <div 
                      key={actor.id} 
                      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition"
                    >
                      <p className="font-semibold text-lg">{actor.name}</p>
                      <p className="text-gray-400 text-sm mt-1">as {actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <TrackRecentlyViewed
            movie={{
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
            }}
          />

          <AddToPlaylist
            movie={{
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
            }}
          />

          <MovieReview
            movie={{
              id: movie.id,
              title: movie.title,
            }}
          />

            
          </div>
        </div>
      </div>
    </main>
  );
}

function UserRating() {
  return (
    <div className="mt-8 pt-8 border-t border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Your Rating</h2>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
          <button
            key={star}
            className="text-3xl text-yellow-400 hover:text-yellow-300 hover:scale-110 transition"
            title={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="text-gray-400 text-sm">Click a star to rate this movie</p>
    </div>
  );
}




