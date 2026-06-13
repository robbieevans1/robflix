"use client";

import Link from "next/link";
import { useRef } from "react";
import MovieTitle from "@/components/MovieTitle";

type CarouselMovie = {
	id: string;
	slug: string;
	title: string;
	year: number | null;
	posterUrl: string | null;
};

type GenreCarouselProps = {
	genre: string;
	movies: CarouselMovie[];
};

export default function GenreCarousel({ genre, movies }: GenreCarouselProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	function scroll(direction: "left" | "right") {
		const container = scrollRef.current;
		if (!container) return;

		const amount = container.clientWidth * 0.75;
		container.scrollBy({
			left: direction === "left" ? -amount : amount,
			behavior: "smooth",
		});
	}

	return (
		<section className="mb-10">
			<div className="mb-4 flex items-center justify-between gap-4">
				<h2 className="text-2xl font-semibold">{genre}</h2>

				<div className="flex items-center gap-2">
					<Link
						href={`/genres?genre=${encodeURIComponent(genre)}`}
						className="text-sm text-slate-400 transition hover:text-white"
					>
						View all
					</Link>

					<button
						type="button"
						onClick={() => scroll("left")}
						aria-label={`Scroll ${genre} movies left`}
						className="flex h-8 w-8 items-center justify-center rounded-full border border-red-950/50 bg-black/60 text-lg text-slate-300 transition hover:border-red-500 hover:text-white"
					>
						‹
					</button>

					<button
						type="button"
						onClick={() => scroll("right")}
						aria-label={`Scroll ${genre} movies right`}
						className="flex h-8 w-8 items-center justify-center rounded-full border border-red-950/50 bg-black/60 text-lg text-slate-300 transition hover:border-red-500 hover:text-white"
					>
						›
					</button>
				</div>
			</div>

			<div
				ref={scrollRef}
				className="flex gap-3 overflow-x-auto px-1 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{movies.map((movie) => (
					<Link
						key={movie.id}
						href={`/movies/${movie.slug}`}
						className="group movie-card w-32 shrink-0 rounded-lg border border-red-950/40 bg-black/60 shadow-lg backdrop-blur transition hover:scale-105 hover:border-red-500/60 sm:w-36"
					>
						<div className="aspect-[2/3] w-full overflow-hidden rounded-t-lg bg-slate-800 ring-1 ring-inset ring-transparent transition group-hover:ring-red-500/60">
							{movie.posterUrl ? (
								<img
									src={movie.posterUrl}
									alt={movie.title}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
									No Image
								</div>
							)}
						</div>

						<div className="p-2">
							<MovieTitle title={movie.title} className="text-sm" />

							<p className="mt-1 text-xs text-slate-400">
								{movie.year ?? "Unknown"}
							</p>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
