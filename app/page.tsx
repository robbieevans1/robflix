import { prisma } from "@/lib/prisma";
import { genres } from "@/lib/genres";
import GenreCarousel from "@/components/GenreCarousel";

export default async function Home() {
	const genreSections = await Promise.all(
		genres.map(async (genre) => {
			const movies = await prisma.movie.findMany({
				where: {
					genres: {
						has: genre,
					},
				},
				take: 20,
				orderBy: {
					title: "asc",
				},
				select: {
					id: true,
					slug: true,
					title: true,
					year: true,
					posterUrl: true,
				},
			});

			return { genre, movies };
		}),
	);

	const sectionsWithMovies = genreSections.filter(
		(section) => section.movies.length > 0,
	);

	return (
		<main className="min-h-screen px-8 py-10 text-white">
			<section className="mb-10">
				<h1 className="text-5xl font-bold">Public Domain Movies</h1>
				<p className="mt-4 max-w-2xl text-slate-300">
					Watch films for free from public-domain and open media archives!
				</p>
			</section>

			{sectionsWithMovies.length === 0 ? (
				<p className="text-slate-400">No movies available yet.</p>
			) : (
				sectionsWithMovies.map(({ genre, movies }) => (
					<GenreCarousel key={genre} genre={genre} movies={movies} />
				))
			)}
		</main>
	);
}
