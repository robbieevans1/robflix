import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prismaMock, resetPrismaMock } from "../helpers/mock-prisma";

vi.mock("@/components/MovieTitle", () => ({
	default: ({ title }: { title: string }) => <h3>{title}</h3>,
}));

import DecadesPage from "@/app/decades/page";

describe("Decades page", () => {
	beforeEach(() => {
		resetPrismaMock();
	});

	it("prompts the user to choose a decade when none is selected", async () => {
		render(await DecadesPage({ searchParams: Promise.resolve({}) }));

		expect(
			screen.getByRole("heading", { name: "Browse by Decade", level: 1 }),
		).toBeInTheDocument();
		expect(screen.getByText("Choose a decade to see movies.")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "1960s" })).toHaveAttribute(
			"href",
			"/decades?decade=1960",
		);
	});

	it("renders movies for the selected decade", async () => {
		prismaMock.movie.findMany.mockResolvedValue([
			{
				id: "1",
				slug: "night-of-the-living-dead-1968",
				title: "Night of the Living Dead",
				year: 1968,
				posterUrl: null,
				genres: ["Horror"],
			},
		]);

		render(
			await DecadesPage({
				searchParams: Promise.resolve({ decade: "1960" }),
			}),
		);

		expect(
			screen.getByRole("heading", { name: "Movies from the 1960s" }),
		).toBeInTheDocument();
		expect(screen.getByText("No Image")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /Night of the Living Dead/i })).toHaveAttribute(
			"href",
			"/movies/night-of-the-living-dead-1968",
		);
	});

	it("shows an empty state when a decade has no movies", async () => {
		prismaMock.movie.findMany.mockResolvedValue([]);

		render(
			await DecadesPage({
				searchParams: Promise.resolve({ decade: "1910" }),
			}),
		);

		expect(screen.getByText("No movies found for the 1910s.")).toBeInTheDocument();
	});
});
