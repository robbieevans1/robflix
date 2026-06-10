import Link from "next/link";
import AuthButton from "./AuthButtons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-white">
        <Link href="/" className="text-2xl font-bold text-red-500">
          Robflix
        </Link>

        <div className="flex items-center gap-6 text-sm text-slate-300">
          {/* <Link href="/" className="hover:text-white">
            Home
          </Link> */}

          <Link href="/genres" className="hover:text-white">
            Genres
          </Link>

          {/* <Link href="/search" className="hover:text-white">
            Search
          </Link> */}

          <Link href="/about" className="hover:text-white">
            About
          </Link>
          <AuthButton />

        </div>
      </nav>
    </header>  )
}

