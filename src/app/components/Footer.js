import Link from 'next/link';


// Footer with sited developer info and accreditation
export default function Footer() {
  return (
    <footer className="bg-black text-white font-light pt-20 pb-5 items-center text-center mt-20 sm:mt-40">
      
      {/* Just use flex box and have the mx static */}
      <div className='mx-auto'>
          <hr className="bg-zinc-200 h-px border-0 sm:w-140 md:w-2xl lg:w-200 mx-4 sm:mx-auto block transition-all"/>
      </div>


      {/* <hr className="bg-zinc-200 lg:w-200 w-100 md:w-2xl mx-auto"/> */}

      <p className="pb-4 mt-10">&#169; 2026 All rights reserved.</p>
      <div className="text-xs text-zinc-200">
        <Link href="https://www.linkedin.com/in/levi-moreau" target="_blank" rel="noopener noreferrer" className="cursor-pointer w-30">
          Levi Moreau
        </Link>

        <p className='mt-1'>Jiro Roales</p>
        <p className='mt-1'>Theo Sanchez</p>
      </div>

    </footer>
  )
}







