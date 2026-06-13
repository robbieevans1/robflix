import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prismaMock, resetPrismaMock } from "../helpers/mock-prisma";
import { createCarouselMovie } from "../helpers/mock-movie";

vi.mock("@/components/GenreCarousel", () => ({
	default: ({
		genre,
		movies,
	}: {
		genre: string;
		movies: Array<{ title: string }>;
	}) => (
		<section data-testid={`carousel-${genre}`}>
			<h2>{genre}</h2>
			<ul>
				{movies.map((movie) => (
					<li key={movie.title}>{movie.title}</li>
				))}
			</ul>
		</section>
	),
}));

import Home from "@/app/page";

describe("Home page", () => {
	beforeEach(() => {
		resetPrismaMock();
	});

	it("renders genre carousels for genres that have movies", async () => {
		prismaMock.movie.findMany.mockImplementation(({ where }) => {
			if (where.genres.has === "Horror") {
				return Promise.resolve([
					createCarouselMovie({ title: "Night of the Living Dead" }),
				]);
			}

			return Promise.resolve([]);
		});

		render(await Home());

		expect(
			screen.getByRole("heading", {
				name: "Public Domain Movies",
				level: 1,
			}),
		).toBeInTheDocument();
		expect(screen.getByTestId("carousel-Horror")).toBeInTheDocument();
		expect(screen.getByText("Night of the Living Dead")).toBeInTheDocument();
	});

	it("shows an empty state when no movies exist", async () => {
		prismaMock.movie.findMany.mockResolvedValue([]);

		render(await Home());

		expect(screen.getByText("No movies available yet.")).toBeInTheDocument();
	});
});
