import { describe, expect, it } from "vitest";
import { genres } from "@/lib/genres";

describe("genres", () => {
	it("exports a non-empty list of genre names", () => {
		expect(genres.length).toBeGreaterThan(0);
	});

	it("contains expected core genres", () => {
		expect(genres).toContain("Horror");
		expect(genres).toContain("Comedy");
		expect(genres).toContain("Classic");
	});

	it("does not contain duplicate genres", () => {
		expect(new Set(genres).size).toBe(genres.length);
	});
});
