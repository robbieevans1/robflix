import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MovieTitle from "@/components/MovieTitle";

const genres = [
	"Horror",
	"Comedy",
	"Drama",
	"Sci-Fi",
	"Western",
	"Silent",
	"Animation",
	"Documentary",
	"Film Noir",
	"Crime",
	"Adventure",
	"Classic",
];

type MovieCard = {
	id: string;
	slug: string;
	title: string;
	year: number | null;
	posterUrl: string | null;
	genres: string[];
};

type GenresPageProps = {
	searchParams: Promise<{
		genre?: string;
	}>;
};

export default async function GenresPage({ searchParams }: GenresPageProps) {
	const { genre } = await searchParams;

	const selectedGenre = genre ? decodeURIComponent(genre) : null;

	const movies: MovieCard[] = selectedGenre
		? await prisma.movie.findMany({
				where: {
					genres: {
						has: selectedGenre,
					},
				},
				take: 50,
				orderBy: {
					title: "asc",
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
				<h1 className="text-5xl font-bold">Browse by Genre</h1>
				<p className="mt-4 max-w-2xl text-slate-300">
					Choose a genre to explore classic public-domain movies.
				</p>
			</section>

			<section className="mb-10 flex flex-wrap gap-3">
				{genres.map((genre) => {
					const isActive = selectedGenre === genre;

					return (
						<Link
							key={genre}
							href={`/genres?genre=${encodeURIComponent(genre)}`}
							className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
								isActive
									? "border-red-500 bg-red-600 text-white"
									: "border-red-950/50 bg-black/60 text-slate-300 hover:border-red-500 hover:text-white"
							}`}
						>
							{genre}
						</Link>
					);
				})}
			</section>

			{!selectedGenre ? (
				<p className="text-slate-400">Choose a genre to see movies.</p>
			) : (
				<section>
					<h2 className="mb-6 text-2xl font-semibold">
						{selectedGenre} Movies
					</h2>

					{movies.length === 0 ? (
						<p className="text-slate-400">
							No movies found for {selectedGenre}.
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
