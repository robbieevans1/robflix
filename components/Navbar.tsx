import Link from "next/link";
import AuthButton from "./AuthButtons";
import { auth } from "@/auth";


export default async function Navbar() {
	const session = await auth();
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

					<Link href="/decades" className="hover:text-white">
						Decades
					</Link>

					{/* <Link href="/search" className="hover:text-white">
            Search
          </Link> */}

					<Link href="/about" className="hover:text-white">
						About
					</Link>
					{session?.user ? (
						<Link href="/secret" className="hover:text-white">
							Secret
						</Link>
					) : null}
					<AuthButton />
				</div>
			</nav>
		</header>
	);
}
