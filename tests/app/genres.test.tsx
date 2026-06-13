import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prismaMock, resetPrismaMock } from "../helpers/mock-prisma";

vi.mock("@/components/MovieTitle", () => ({
	default: ({ title }: { title: string }) => <h3>{title}</h3>,
}));

import GenresPage from "@/app/genres/page";

describe("Genres page", () => {
	beforeEach(() => {
		resetPrismaMock();
	});

	it("prompts the user to choose a genre when none is selected", async () => {
		render(await GenresPage({ searchParams: Promise.resolve({}) }));

		expect(
			screen.getByRole("heading", { name: "Browse by Genre", level: 1 }),
		).toBeInTheDocument();
		expect(screen.getByText("Choose a genre to see movies.")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Horror" })).toHaveAttribute(
			"href",
			"/genres?genre=Horror",
		);
	});

	it("renders movies for the selected genre", async () => {
		prismaMock.movie.findMany.mockResolvedValue([
			{
				id: "1",
				slug: "night-of-the-living-dead-1968",
				title: "Night of the Living Dead",
				year: 1968,
				posterUrl: "https://example.com/poster.jpg",
				genres: ["Horror"],
			},
		]);

		render(
			await GenresPage({
				searchParams: Promise.resolve({ genre: "Horror" }),
			}),
		);

		expect(screen.getByRole("heading", { name: "Horror Movies" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /Night of the Living Dead/i })).toHaveAttribute(
			"href",
			"/movies/night-of-the-living-dead-1968",
		);
	});

	it("shows an empty state when a genre has no movies", async () => {
		prismaMock.movie.findMany.mockResolvedValue([]);

		render(
			await GenresPage({
				searchParams: Promise.resolve({ genre: "Western" }),
			}),
		);

		expect(screen.getByText("No movies found for Western.")).toBeInTheDocument();
	});
});
