import type { Movie } from "@prisma/client";

export function createMockMovie(overrides: Partial<Movie> = {}): Movie {
	return {
		id: "movie-1",
		slug: "night-of-the-living-dead-1968",
		title: "Night of the Living Dead",
		year: 1968,
		description: "A classic horror film.",
		runtimeMinutes: 96,
		posterUrl: "https://example.com/poster.jpg",
		genres: ["Horror", "Classic"],
		sourceName: "Internet Archive",
		sourceUrl: "https://archive.org/details/night-of-the-living-dead",
		archiveIdentifier: "night-of-the-living-dead",
		embedUrl: "https://archive.org/embed/night-of-the-living-dead",
		rightsStatus: "Needs Review",
		rightsProofUrl: "https://archive.org/details/night-of-the-living-dead",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		...overrides,
	};
}

export function createCarouselMovie(
	overrides: Partial<{
		id: string;
		slug: string;
		title: string;
		year: number | null;
		posterUrl: string | null;
	}> = {},
) {
	return {
		id: "movie-1",
		slug: "night-of-the-living-dead-1968",
		title: "Night of the Living Dead",
		year: 1968,
		posterUrl: "https://example.com/poster.jpg",
		...overrides,
	};
}
