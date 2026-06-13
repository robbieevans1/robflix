import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/about/page";

describe("About page", () => {
	it("renders the about content and tech stack cards", () => {
		render(<AboutPage />);

		expect(
			screen.getByRole("heading", {
				name: /A public-domain movie app built as a portfolio project/i,
			}),
		).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Project Purpose" })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Tech Stack" })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Educational Use" })).toBeInTheDocument();
		expect(
			screen.getByText(
				/Robflix uses Next\.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL/i,
			),
		).toBeInTheDocument();
	});
});
