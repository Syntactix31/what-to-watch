import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <main>
      <header>
            <div className="hover-container">
                <h1 className="explosive-text">What To Watch?</h1>
            </div>
            <div className="shadow-dance-container">
                <h1 className="shadow-dance-text">What To Watch?</h1>
            </div>
            <div className="container">
              <h1>What to</h1>
              <h1>Watch?</h1>
            </div>
      </header>  

      <div>
        <Image src="./assets/img/movietheatre1.jpg" alt="Movie Theatre Bb" width={100} height={100} className="h-screen w-screen"/>
      </div>

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
