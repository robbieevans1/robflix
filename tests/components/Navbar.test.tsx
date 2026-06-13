import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.fn();

vi.mock("@/auth", () => ({
	auth: () => authMock(),
}));

vi.mock("@/components/AuthButtons", () => ({
	default: () => <div data-testid="auth-buttons">Auth</div>,
}));

import Navbar from "@/components/Navbar";

describe("Navbar", () => {
	beforeEach(() => {
		authMock.mockReset();
	});

	it("renders primary navigation links", async () => {
		authMock.mockResolvedValue(null);

		render(await Navbar());

		expect(screen.getByRole("link", { name: "Robflix" })).toHaveAttribute(
			"href",
			"/",
		);
		expect(screen.getByRole("link", { name: "Genres" })).toHaveAttribute(
			"href",
			"/genres",
		);
		expect(screen.getByRole("link", { name: "Decades" })).toHaveAttribute(
			"href",
			"/decades",
		);
		expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
			"href",
			"/about",
		);
	});

	it("shows the secret link only for signed-in users", async () => {
		authMock.mockResolvedValue({
			user: { email: "rob@example.com" },
		});

		render(await Navbar());

		expect(screen.getByRole("link", { name: "Secret" })).toHaveAttribute(
			"href",
			"/secret",
		);
	});

	it("hides the secret link for guests", async () => {
		authMock.mockResolvedValue(null);

		render(await Navbar());

		expect(screen.queryByRole("link", { name: "Secret" })).not.toBeInTheDocument();
	});
});
