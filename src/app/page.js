import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <main>
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 px-6 py-4 flex items-center justify-between">
        <div className="hover-container">
            <h1 className="explosive-text">What To Watch?</h1>
        </div>
        <Link 
          href="/login" 
          className=" hover:border-yellow-200 text-[#FFD700] px-6 py-2 rounded-lg font-medium transition-colors"
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
        <Image src="/movietheatre2.jpg" alt="Movie Theatre Bb" fill className="object-cover -z-10"/>
      </div>

      <div>
      </div>
    </main>
  );
}
//might use tmdb but u have to enter personal info
