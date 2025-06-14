import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky z-50 bg-blue-400 top-0 px-6 py-4 flex items-center justify-between">
      <div className="flex flex-col leading-tight">
        <span className="text-lg md:text-2xl font-bold text-amber-700 ">Rise Of Coding</span>
       

    
      </div>  
        <div className="flex items-center ">
            <Link href="/">Coding </Link>

        </div>
    </nav>
  );
}
