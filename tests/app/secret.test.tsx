import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.fn();
const redirectMock = vi.fn((url: string) => {
	throw new Error(`NEXT_REDIRECT:${url}`);
});

vi.mock("@/auth", () => ({
	auth: () => authMock(),
}));

vi.mock("next/navigation", () => ({
	redirect: (url: string) => redirectMock(url),
}));

import SecretPage from "@/app/secret/page";

describe("Secret page", () => {
	beforeEach(() => {
		authMock.mockReset();
		redirectMock.mockClear();
	});

	it("redirects guests to the home page", async () => {
		authMock.mockResolvedValue(null);

		await expect(SecretPage()).rejects.toThrow("NEXT_REDIRECT:/");
		expect(redirectMock).toHaveBeenCalledWith("/");
	});

	it("renders secret content for signed-in users", async () => {
		authMock.mockResolvedValue({
			user: {
				email: "rob@example.com",
				name: "Rob Evans",
			},
		});

		render(await SecretPage());

		expect(
			screen.getByRole("heading", { name: "Secret Robflix Page", level: 1 }),
		).toBeInTheDocument();
		expect(screen.getByText("rob@example.com")).toBeInTheDocument();
	});
});
