import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
	const movies = await prisma.movie.findMany({
		take: 50,
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<main className="min-h-screen bg-slate-950 px-8 py-10 text-white">
			<section className="mb-10">
				<h1 className="text-5xl font-bold">Public Domain Movies</h1>
				<p className="mt-4 max-w-2xl text-slate-300">
					Watch films for free from public-domain and open media archives!
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-2xl font-semibold">Featured Movies</h2>

				<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{movies.map((movie) => (
						<Link
							key={movie.id}
							href={`/movies/${movie.slug}`}
							className="overflow-hidden rounded-lg bg-slate-900 transition hover:scale-105"
						>
							<div className="aspect-[2/3] w-full overflow-hidden bg-slate-800">
								{movie.posterUrl ? (
									<img
										src={movie.posterUrl}
										alt={movie.title}
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
										No Image
									</div>
								)}
							</div>

							<div className="p-4">
								<h3 className="line-clamp-1 text-lg font-bold">
									{movie.title}
								</h3>

								<p className="mt-1 text-sm text-slate-400">
									{movie.year ?? "Release Year Unknown"} • {movie.genres.join(", ")}
								</p>
							</div>
						</Link>
					))}
				</div>
			</section>
		</main>
	);
}
