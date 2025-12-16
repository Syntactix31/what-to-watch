import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <main>
      <header>
        <p className="p-10 text-[#FFD700] font-bold">
          What To Watch
        </p>
      </header>  

      <div>
        {/* {trending.results.map(movie => (
          <div key={movie.id}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
            <h3>{movie.title}</h3>
          </div>
        ))} */}
      </div>
    </main>
  );
}
//might use tmdb but u have to enter personal info
