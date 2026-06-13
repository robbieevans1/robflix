import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.fn();
const signInMock = vi.fn();
const signOutMock = vi.fn();

vi.mock("@/auth", () => ({
	auth: () => authMock(),
	signIn: (...args: unknown[]) => signInMock(...args),
	signOut: (...args: unknown[]) => signOutMock(...args),
}));

import AuthButtons from "@/components/AuthButtons";

describe("AuthButtons", () => {
	beforeEach(() => {
		authMock.mockReset();
		signInMock.mockReset();
		signOutMock.mockReset();
	});

	it("shows a login button when there is no session", async () => {
		authMock.mockResolvedValue(null);

		render(await AuthButtons());

		expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
	});

	it("shows the user name and logout button when signed in", async () => {
		authMock.mockResolvedValue({
			user: {
				name: "Rob Evans",
				email: "rob@example.com",
			},
		});

		render(await AuthButtons());

		expect(screen.getByText("Rob Evans")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
	});
});
