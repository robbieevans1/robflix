import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const LIMIT = Number(process.env.LIMIT ?? 500);

const IA_QUERY =
	process.env.IA_QUERY ?? "collection:feature_films AND mediatype:movies";

type ArchiveSearchItem = {
	identifier?: string;
	title?: unknown;
	date?: unknown;
	description?: unknown;
	subject?: unknown;
};

type ArchiveMetadataResponse = {
	metadata?: {
		runtime?: unknown;
		length?: unknown;
	};
	files?: Array<{
		name?: string;
		format?: string;
		length?: string;
		duration?: string;
	}>;
};

function runtimeToMinutes(value: unknown): number | null {
  if (value == null) return null;

  const text = String(value).trim();

  // Handles plain seconds like "5400"
  if (/^\d+(\.\d+)?$/.test(text)) {
    const seconds = Number(text);
    return Math.round(seconds / 60);
  }

  // Handles formats like "1:32:10" or "92:10"
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

  // Handles text like "90 min", "90 minutes", "1h 30m"
  const hourMatch = text.match(/(\d+)\s*h/i);
  const minuteMatch = text.match(/(\d+)\s*m/i);

  if (hourMatch || minuteMatch) {
    const hours = hourMatch ? Number(hourMatch[1]) : 0;
    const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
    return hours * 60 + minutes;
  }

  return null;
}

async function fetchRuntimeMinutes(identifier: string): Promise<number | null> {
  const url = `https://archive.org/metadata/${identifier}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.warn(`Could not fetch metadata for ${identifier}`);
    return null;
  }

  const data = (await response.json()) as ArchiveMetadataResponse;

  const metadataRuntime =
    runtimeToMinutes(data.metadata?.runtime) ??
    runtimeToMinutes(data.metadata?.length);

  if (metadataRuntime) return metadataRuntime;

  const videoFile = data.files?.find((file) => {
    const format = file.format?.toLowerCase() ?? "";
    const name = file.name?.toLowerCase() ?? "";

    return (
      format.includes("mpeg4") ||
      format.includes("h.264") ||
      format.includes("matroska") ||
      name.endsWith(".mp4") ||
      name.endsWith(".mkv") ||
      name.endsWith(".avi")
    );
  });

  return (
    runtimeToMinutes(videoFile?.duration) ??
    runtimeToMinutes(videoFile?.length)
  );
}

function valueToString(value: unknown): string {
	if (Array.isArray(value)) return value.join(" ");
	if (typeof value === "string") return value;
	if (value == null) return "";
	return String(value);
}

function valueToArray(value: unknown): string[] {
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

function getYear(value: unknown): number | null {
	const text = valueToString(value);
	const match = text.match(/\d{4}/);
	return match ? Number(match[0]) : null;
}

function stripHtml(value: string): string {
	return value
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function slugify(
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

function inferGenres(subjects: string[]): string[] {
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

async function fetchArchiveItems(limit: number): Promise<ArchiveSearchItem[]> {
	const items: ArchiveSearchItem[] = [];
	let cursor: string | undefined;
  
	while (items.length < limit) {
		const params = new URLSearchParams({
			q: IA_QUERY,
			fields: "identifier,title,date,description,subject",
			count: "500",
		});

		if (cursor) {
			params.set("cursor", cursor);
		}

		const url = `https://archive.org/services/search/v1/scrape?${params.toString()}`;

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Internet Archive search failed: ${response.status}`);
		}

		const data = await response.json();

		items.push(...(data.items ?? []));

		cursor = data.cursor;

		if (!cursor) break;

		// Be polite to the API.
		await new Promise((resolve) => setTimeout(resolve, 250));
	}

	return items.slice(0, limit);
}

async function main() {

  const RESET_ARCHIVE_MOVIES = process.env.RESET_ARCHIVE_MOVIES === "true";

if (RESET_ARCHIVE_MOVIES) {
  const deleted = await prisma.movie.deleteMany({
    where: {
      sourceName: "Internet Archive",
    },
  });

  console.log(`Deleted ${deleted.count} existing Internet Archive movies.`);
}
	console.log(`Fetching ${LIMIT} movies from Internet Archive...`);
	console.log(`Query: ${IA_QUERY}`);

	const archiveItems = await fetchArchiveItems(LIMIT);

	let seededCount = 0;

	for (const item of archiveItems) {
		const identifier = item.identifier;

		if (!identifier) continue;

		const title = valueToString(item.title) || identifier;
		const year = getYear(item.date);
		const subjects = valueToArray(item.subject);
		const description = stripHtml(valueToString(item.description));

		const runtimeMinutes = await fetchRuntimeMinutes(identifier);

		if (runtimeMinutes == null) {
			console.log(`Skipped: ${title} — missing runtime`);
			continue;
		}

		if (runtimeMinutes < 65) {
			//console.log(`Skipped: ${title} — ${runtimeMinutes} minutes`);
			continue;
		}

		const movie = {
			slug: slugify(title, year, identifier),
			title,
			year,
			description: description || null,
			runtimeMinutes,
			posterUrl: `https://archive.org/services/img/${identifier}`,
			genres: inferGenres(subjects),

			sourceName: "Internet Archive",
			sourceUrl: `https://archive.org/details/${identifier}`,
			archiveIdentifier: identifier,
			embedUrl: `https://archive.org/embed/${identifier}`,

			// Do not blindly trust this yet. Review these later.
			rightsStatus: "Needs Review",
			rightsProofUrl: `https://archive.org/details/${identifier}`,
		};

		await prisma.movie.upsert({
			where: {
				archiveIdentifier: identifier,
			},
			update: movie,
			create: movie,
		});

		seededCount++;
		console.log(`Seeded ${seededCount}: ${title}`);
	}

	console.log(`Done. Seeded/updated ${seededCount} movies.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});
