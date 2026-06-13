import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import MovieTitle from "@/components/MovieTitle";

describe("MovieTitle", () => {
	const originalScrollWidth = Object.getOwnPropertyDescriptor(
		HTMLElement.prototype,
		"scrollWidth",
	);
	const originalClientWidth = Object.getOwnPropertyDescriptor(
		HTMLElement.prototype,
		"clientWidth",
	);

	afterEach(() => {
		if (originalScrollWidth) {
			Object.defineProperty(
				HTMLElement.prototype,
				"scrollWidth",
				originalScrollWidth,
			);
		}

		if (originalClientWidth) {
			Object.defineProperty(
				HTMLElement.prototype,
				"clientWidth",
				originalClientWidth,
			);
		}
	});

	it("renders the movie title", () => {
		render(<MovieTitle title="Metropolis" />);

		expect(
			screen.getByRole("heading", { name: "Metropolis" }),
		).toBeInTheDocument();
	});

	it("applies a custom className when provided", () => {
		render(<MovieTitle title="Metropolis" className="text-sm" />);

		expect(screen.getByRole("heading", { name: "Metropolis" })).toHaveClass(
			"text-sm",
		);
	});

	it("adds scroll styling when the title overflows", () => {
		Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
			configurable: true,
			get() {
				return 500;
			},
		});

		Object.defineProperty(HTMLElement.prototype, "clientWidth", {
			configurable: true,
			get() {
				return 100;
			},
		});

		render(
			<MovieTitle title="A Very Long Movie Title That Should Overflow" />,
		);

		expect(
			screen.getByRole("heading", {
				name: "A Very Long Movie Title That Should Overflow",
			}),
		).toHaveClass("movie-card-title-scroll");
	});
});
