export default function AboutPage() {
	return (
		<main className="min-h-screen px-6 py-12 text-white">
			<section className="mx-auto max-w-4xl">
				<p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-500">
					About Robflix
				</p>

				<h1 className="mb-6 text-4xl font-bold md:text-5xl">
					A public-domain movie app built as a portfolio project.
				</h1>

				<div className="space-y-6 text-lg leading-8 text-slate-300">
					<p>
						Robflix is a Netflix-inspired movie browsing application created as
						a portfolio project for educational purposes. The goal of this
						project is to further develop my skills in full-stack web
						development, database design, API integration, and modern frontend
						design.
					</p>

					<p>
						The app displays a curated catalog of classic movies and stores movie
						metadata such as titles, descriptions, genres, release years, poster
						URLs, and source links in a database. The actual video files are not
						hosted by this application. Instead, Robflix embeds videos from
						third-party archival sources such as Internet Archive.
					</p>

					<p>
						This project was built to practice working with technologies such as
						Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. It is not
						intended to be a commercial streaming service.
					</p>

					<p>
						All media shown in this app is intended to come from public-domain or
						openly available sources. Rights information should still be reviewed
						for each individual title before labeling it as public domain.
					</p>
				</div>

				<section className="mt-12 grid gap-6 md:grid-cols-3">
					<div className="rounded-xl border border-red-950/40 bg-black/60 p-6 shadow-lg backdrop-blur">
						<h2 className="mb-3 text-xl font-semibold text-white">
							Project Purpose
						</h2>
						<p className="text-sm leading-6 text-slate-400">
							To build a realistic full-stack application that demonstrates
							database usage, dynamic routing, API-based data, and a polished
							user interface.
						</p>
					</div>

					<div className="rounded-xl border border-red-950/40 bg-black/60 p-6 shadow-lg backdrop-blur">
						<h2 className="mb-3 text-xl font-semibold text-white">
							Tech Stack
						</h2>
						<p className="text-sm leading-6 text-slate-400">
							Robflix uses Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL,
							and embedded video sources from Internet Archive.
						</p>
					</div>

					<div className="rounded-xl border border-red-950/40 bg-black/60 p-6 shadow-lg backdrop-blur">
						<h2 className="mb-3 text-xl font-semibold text-white">
							Educational Use
						</h2>
						<p className="text-sm leading-6 text-slate-400">
							This application is for learning, experimentation, and portfolio
							presentation. It is not affiliated with Netflix or Internet
							Archive.
						</p>
					</div>
				</section>
			</section>
		</main>
	);
}