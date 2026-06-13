export function runtimeToMinutes(value: unknown): number | null {
	if (value == null) return null;

	const text = String(value).trim();

	if (/^\d+(\.\d+)?$/.test(text)) {
		const seconds = Number(text);
		return Math.round(seconds / 60);
	}

	const parts = text.split(":").map(Number);

	if (parts.every((part) => !Number.isNaN(part))) {
		if (parts.length === 3) {
			const [hours, minutes, seconds] = parts;
			return Math.round(hours * 60 + minutes + seconds / 60);
		}

		if (parts.length === 2) {
			const [minutes, seconds] = parts;
			return Math.round(minutes + seconds / 60);
		}
	}

	const hourMatch = text.match(/(\d+)\s*h/i);
	const minuteMatch = text.match(/(\d+)\s*m/i);

	if (hourMatch || minuteMatch) {
		const hours = hourMatch ? Number(hourMatch[1]) : 0;
		const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
		return hours * 60 + minutes;
	}

	return null;
}

export function valueToString(value: unknown): string {
	if (Array.isArray(value)) return value.join(" ");
	if (typeof value === "string") return value;
	if (value == null) return "";
	return String(value);
}

export function valueToArray(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.map(String).filter(Boolean);
	}

	if (typeof value === "string") {
		return value
			.split(";")
			.map((item) => item.trim())
			.filter(Boolean);
	}

	return [];
}

export function getYear(value: unknown): number | null {
	const text = valueToString(value);
	const match = text.match(/\d{4}/);
	return match ? Number(match[0]) : null;
}

export function stripHtml(value: string): string {
	return value
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

export function slugify(
	title: string,
	year: number | null,
	identifier: string,
): string {
	const base = title
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

	const shortId = identifier.toLowerCase().replace(/[^a-z0-9]+/g, "-");

	return year ? `${base}-${year}-${shortId}` : `${base}-${shortId}`;
}

export function inferGenres(subjects: string[]): string[] {
	const text = subjects.join(" ").toLowerCase();

	const genres: string[] = [];

	if (text.includes("horror")) genres.push("Horror");
	if (text.includes("comedy")) genres.push("Comedy");
	if (text.includes("sci-fi") || text.includes("science fiction"))
		genres.push("Sci-Fi");
	if (text.includes("drama")) genres.push("Drama");
	if (text.includes("western")) genres.push("Western");
	if (text.includes("silent")) genres.push("Silent");
	if (text.includes("animation") || text.includes("cartoon"))
		genres.push("Animation");
	if (text.includes("documentary")) genres.push("Documentary");
	if (text.includes("noir")) genres.push("Film Noir");
	if (text.includes("crime")) genres.push("Crime");
	if (text.includes("adventure")) genres.push("Adventure");

	return genres.length > 0 ? genres : ["Classic"];
}

export function isEnglishLanguage(value: unknown): boolean {
	const languages = valueToArray(value).map((language) =>
		language.toLowerCase().trim(),
	);

	return languages.some(
		(language) =>
			language === "english" ||
			language === "eng" ||
			language.includes("english"),
	);
}
