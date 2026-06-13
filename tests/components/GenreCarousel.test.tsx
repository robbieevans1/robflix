import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import GenreCarousel from "@/components/GenreCarousel";
import { createCarouselMovie } from "../helpers/mock-movie";

describe("GenreCarousel", () => {
	const originalScrollBy = Object.getOwnPropertyDescriptor(
		HTMLElement.prototype,
		"scrollBy",
	);
	const originalClientWidth = Object.getOwnPropertyDescriptor(
		HTMLElement.prototype,
		"clientWidth",
	);

	afterEach(() => {
		if (originalScrollBy) {
			Object.defineProperty(HTMLElement.prototype, "scrollBy", originalScrollBy);
		}

		if (originalClientWidth) {
			Object.defineProperty(
				HTMLElement.prototype,
				"clientWidth",
				originalClientWidth,
			);
		}
	});

	it("renders the genre heading and movie cards", () => {
		const movies = [
			createCarouselMovie(),
			createCarouselMovie({
				id: "movie-2",
				slug: "nosferatu-1922",
				title: "Nosferatu",
				year: 1922,
			}),
		];

		render(<GenreCarousel genre="Horror" movies={movies} />);

		expect(
			screen.getByRole("heading", { name: "Horror", level: 2 }),
		).toBeInTheDocument();
		expect(screen.getByAltText("Night of the Living Dead").closest("a")).toHaveAttribute(
			"href",
			"/movies/night-of-the-living-dead-1968",
		);
		expect(screen.getByAltText("Nosferatu").closest("a")).toHaveAttribute(
			"href",
			"/movies/nosferatu-1922",
		);
	});

	it("links to the genre page", () => {
		render(
			<GenreCarousel
				genre="Sci-Fi"
				movies={[createCarouselMovie({ title: "Plan 9", slug: "plan-9" })]}
			/>,
		);

		expect(screen.getByRole("link", { name: "View all" })).toHaveAttribute(
			"href",
			"/genres?genre=Sci-Fi",
		);
	});

	it("shows a placeholder when a movie has no poster", () => {
		render(
			<GenreCarousel
				genre="Horror"
				movies={[createCarouselMovie({ posterUrl: null, title: "Missing Poster" })]}
			/>,
		);

		expect(screen.getByText("No Image")).toBeInTheDocument();
	});

	it("scrolls the carousel when arrow buttons are clicked", async () => {
		const user = userEvent.setup();
		const scrollBy = vi.fn();

		Object.defineProperty(HTMLElement.prototype, "scrollBy", {
			configurable: true,
			value: scrollBy,
		});

		Object.defineProperty(HTMLElement.prototype, "clientWidth", {
			configurable: true,
			get() {
				return 400;
			},
		});

		render(
			<GenreCarousel genre="Horror" movies={[createCarouselMovie()]} />,
		);

		await user.click(
			screen.getByRole("button", { name: "Scroll Horror movies right" }),
		);

		expect(scrollBy).toHaveBeenCalledWith({
			left: 300,
			behavior: "smooth",
		});

		await user.click(
			screen.getByRole("button", { name: "Scroll Horror movies left" }),
		);

		expect(scrollBy).toHaveBeenCalledWith({
			left: -300,
			behavior: "smooth",
		});
	});
});
