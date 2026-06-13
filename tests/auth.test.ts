import { describe, expect, it, vi } from "vitest";

vi.mock("next-auth/providers/github", () => ({
	default: vi.fn(() => ({ id: "github" })),
}));

vi.mock("next-auth", () => ({
	default: vi.fn(() => ({
		handlers: {
			GET: vi.fn(),
			POST: vi.fn(),
		},
		auth: vi.fn(),
		signIn: vi.fn(),
		signOut: vi.fn(),
	})),
}));

import { auth, handlers, signIn, signOut } from "@/auth";

describe("auth configuration", () => {
	it("exports NextAuth route handlers", () => {
		expect(handlers.GET).toBeTypeOf("function");
		expect(handlers.POST).toBeTypeOf("function");
	});

	it("exports auth helpers", () => {
		expect(auth).toBeTypeOf("function");
		expect(signIn).toBeTypeOf("function");
		expect(signOut).toBeTypeOf("function");
	});
});
