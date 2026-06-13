import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const LIMIT = Number(process.env.LIMIT ?? 500);

const IA_QUERY =
	process.env.IA_QUERY ??
	"collection:feature_films AND mediatype:movies AND language:(English OR eng)";

type ArchiveSearchItem = {
	identifier?: string;
	title?: unknown;
	date?: unknown;
	description?: unknown;
	subject?: unknown;
	language?: unknown;
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

import {
	getYear,
	inferGenres,
	isEnglishLanguage,
	runtimeToMinutes,
	slugify,
	stripHtml,
	valueToArray,
	valueToString,
} from "../lib/movie-utils";

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
		runtimeToMinutes(videoFile?.duration) ?? runtimeToMinutes(videoFile?.length)
	);
}

async function fetchArchiveItems(limit: number): Promise<ArchiveSearchItem[]> {
	const items: ArchiveSearchItem[] = [];
	let cursor: string | undefined;

	while (items.length < limit) {
		const params = new URLSearchParams({
			q: IA_QUERY,
			fields: "identifier,title,date,description,subject,language",
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

		if (item.language && !isEnglishLanguage(item.language)) {
			continue;
		}
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

		const existingMovieByIdentifier = await prisma.movie.findUnique({
			where: {
				archiveIdentifier: identifier,
			},
		});

		if (existingMovieByIdentifier) {
			await prisma.movie.update({
				where: {
					archiveIdentifier: identifier,
				},
				data: movie,
			});

			seededCount++;
			console.log(`Updated ${seededCount}: ${title}`);
			continue;
		}

		const existingMovieBySlug = await prisma.movie.findUnique({
			where: {
				slug: movie.slug,
			},
		});

		if (existingMovieBySlug) {
			console.log(`Skipped duplicate slug: ${movie.slug}`);
			continue;
		}

		await prisma.movie.create({
			data: movie,
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
