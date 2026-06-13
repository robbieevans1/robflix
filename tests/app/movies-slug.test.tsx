import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prismaMock, resetPrismaMock } from "../helpers/mock-prisma";
import { createMockMovie } from "../helpers/mock-movie";

const notFoundMock = vi.fn(() => {
	throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
	notFound: () => notFoundMock(),
}));

import MoviePage from "@/app/movies/[slug]/page";

describe("Movie detail page", () => {
	beforeEach(() => {
		resetPrismaMock();
		notFoundMock.mockClear();
	});

	it("renders movie details when the slug exists", async () => {
		const movie = createMockMovie();
		prismaMock.movie.findUnique.mockResolvedValue(movie);

		render(
			await MoviePage({
				params: Promise.resolve({ slug: movie.slug }),
			}),
		);

		expect(
			screen.getByRole("heading", { name: movie.title, level: 1 }),
		).toBeInTheDocument();
		expect(screen.getByTitle(movie.title)).toHaveAttribute(
			"src",
			movie.embedUrl,
		);
		expect(screen.getByText(movie.description!)).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "View original source" })).toHaveAttribute(
			"href",
			movie.sourceUrl,
		);
	});

	it("uses a fallback description when none is stored", async () => {
		const movie = createMockMovie({ description: null });
		prismaMock.movie.findUnique.mockResolvedValue(movie);

		render(
			await MoviePage({
				params: Promise.resolve({ slug: movie.slug }),
			}),
		);

		expect(
			screen.getByText("No description available for this movie."),
		).toBeInTheDocument();
	});

	it("calls notFound when the movie does not exist", async () => {
		prismaMock.movie.findUnique.mockResolvedValue(null);

		await expect(
			MoviePage({
				params: Promise.resolve({ slug: "missing-movie" }),
			}),
		).rejects.toThrow("NEXT_NOT_FOUND");

		expect(notFoundMock).toHaveBeenCalled();
	});
});
