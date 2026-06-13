import { describe, expect, it } from "vitest";
import {
	getYear,
	inferGenres,
	isEnglishLanguage,
	runtimeToMinutes,
	slugify,
	stripHtml,
	valueToArray,
	valueToString,
} from "@/lib/movie-utils";

describe("runtimeToMinutes", () => {
	it("converts seconds to minutes", () => {
		expect(runtimeToMinutes("5400")).toBe(90);
	});

	it("parses hh:mm:ss durations", () => {
		expect(runtimeToMinutes("1:32:10")).toBe(92);
	});

	it("parses mm:ss durations", () => {
		expect(runtimeToMinutes("92:10")).toBe(92);
	});

	it("parses hour and minute text", () => {
		expect(runtimeToMinutes("1h 30m")).toBe(90);
		expect(runtimeToMinutes("90 min")).toBe(90);
	});

	it("returns null for invalid values", () => {
		expect(runtimeToMinutes(null)).toBeNull();
		expect(runtimeToMinutes("not-a-runtime")).toBeNull();
	});
});

describe("valueToString", () => {
	it("joins arrays and preserves strings", () => {
		expect(valueToString(["A", "B"])).toBe("A B");
		expect(valueToString("Title")).toBe("Title");
		expect(valueToString(null)).toBe("");
	});
});

describe("valueToArray", () => {
	it("maps arrays and splits semicolon strings", () => {
		expect(valueToArray(["Horror", "Drama"])).toEqual(["Horror", "Drama"]);
		expect(valueToArray("Horror; Drama; ")).toEqual(["Horror", "Drama"]);
		expect(valueToArray(undefined)).toEqual([]);
	});
});

describe("getYear", () => {
	it("extracts the first four-digit year", () => {
		expect(getYear("1968-01-01")).toBe(1968);
		expect(getYear(["Released", "1931"])).toBe(1931);
		expect(getYear("unknown")).toBeNull();
	});
});

describe("stripHtml", () => {
	it("removes tags and normalizes whitespace", () => {
		expect(stripHtml("<p>Hello <strong>world</strong></p>")).toBe(
			"Hello world",
		);
	});
});

describe("slugify", () => {
	it("builds a URL-safe slug with year and identifier", () => {
		expect(slugify("Night of the Living Dead", 1968, "night_of_the_living_dead")).toBe(
			"night-of-the-living-dead-1968-night-of-the-living-dead",
		);
	});

	it("handles titles without a year", () => {
		expect(slugify("Plan 9 & Plan 10", null, "plan9")).toBe(
			"plan-9-and-plan-10-plan9",
		);
	});
});

describe("inferGenres", () => {
	it("maps known subject keywords to genres", () => {
		expect(inferGenres(["Horror", "Science Fiction"])).toEqual([
			"Horror",
			"Sci-Fi",
		]);
	});

	it("falls back to Classic when no keywords match", () => {
		expect(inferGenres(["unknown topic"])).toEqual(["Classic"]);
	});
});

describe("isEnglishLanguage", () => {
	it("accepts common English language labels", () => {
		expect(isEnglishLanguage("English")).toBe(true);
		expect(isEnglishLanguage(["eng"])).toBe(true);
		expect(isEnglishLanguage(["French"])).toBe(false);
	});
});
