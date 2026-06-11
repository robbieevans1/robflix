import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MovieTitle from "@/components/MovieTitle";

const decades = [
	1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020,
];

type MovieCard = {
	id: string;
	slug: string;
	title: string;
	year: number | null;
	posterUrl: string | null;
	genres: string[];
};

type DecadesPageProps = {
	searchParams: Promise<{
		decade?: string;
	}>;
};

export default async function DecadesPage({ searchParams }: DecadesPageProps) {
	const { decade } = await searchParams;

	const selectedDecade = decade ? Number(decade) : null;

	const movies: MovieCard[] = selectedDecade
		? await prisma.movie.findMany({
				where: {
					year: {
						gte: selectedDecade,
						lte: selectedDecade + 9,
					},
				},
				take: 50,
				orderBy: {
					year: "asc",
				},
				select: {
					id: true,
					slug: true,
					title: true,
					year: true,
					posterUrl: true,
					genres: true,
				},
			})
		: [];

	return (
		<main className="min-h-screen px-8 py-10 text-white">
			<section className="mb-10">
				<h1 className="text-5xl font-bold">Browse by Decade</h1>
				<p className="mt-4 max-w-2xl text-slate-300">
					Explore classic public-domain movies by decade.
				</p>
			</section>

			<section className="mb-10 flex flex-wrap gap-3">
				{decades.map((decade) => {
					const isActive = selectedDecade === decade;

					return (
						<Link
							key={decade}
							href={`/decades?decade=${decade}`}
							className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
								isActive
									? "border-red-500 bg-red-600 text-white"
									: "border-red-950/50 bg-black/60 text-slate-300 hover:border-red-500 hover:text-white"
							}`}
						>
							{decade}s
						</Link>
					);
				})}
			</section>

			{!selectedDecade ? (
				<p className="text-slate-400">Choose a decade to see movies.</p>
			) : (
				<section>
					<h2 className="mb-6 text-2xl font-semibold">
						Movies from the {selectedDecade}s
					</h2>

					{movies.length === 0 ? (
						<p className="text-slate-400">
							No movies found for the {selectedDecade}s.
						</p>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
							{movies.map((movie) => (
								<Link
									key={movie.id}
									href={`/movies/${movie.slug}`}
									className="movie-card overflow-hidden rounded-lg border border-red-950/30 bg-black/70 shadow-lg backdrop-blur transition hover:scale-105 hover:border-red-500/50"
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
										<MovieTitle title={movie.title} />

										<p className="mt-1 text-sm text-slate-400">
											{movie.year ?? "Unknown"} • {movie.genres.join(", ")}
										</p>
									</div>
								</Link>
							))}
						</div>
					)}
				</section>
			)}
		</main>
	);
}
