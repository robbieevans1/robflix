import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type MoviePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { slug } = await params;

  const movie = await prisma.movie.findUnique({
    where: {
      slug,
    },
  });

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-wide text-red-500">
            {movie.sourceName}
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">{movie.title}</h1>

          <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
            <span>{movie.year ?? "Unknown year"}</span>

            {movie.runtimeMinutes && (
              <span>{movie.runtimeMinutes} min</span>
            )}

            {movie.genres.length > 0 && (
              <span>{movie.genres.join(", ")}</span>
            )}
          </div>
        </section>

        <section className="mb-8 overflow-hidden rounded-xl bg-black shadow-lg">
          <div className="aspect-video w-full">
            <iframe
              src={movie.embedUrl}
              title={movie.title}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-[250px_1fr]">
          {movie.posterUrl && (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="aspect-[2/3] w-full rounded-lg object-cover"
            />
          )}

          <div>
            <h2 className="mb-3 text-2xl font-semibold">About this movie</h2>

            <p className="max-w-3xl leading-7 text-slate-300">
              {movie.description || "No description available for this movie."}
            </p>

            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <p>
                <span className="font-semibold text-slate-200">Source:</span>{" "}
                {movie.sourceName}
              </p>

              <p>
                <span className="font-semibold text-slate-200">Genre:</span>{" "}
                {movie.genres}
              </p>

              <a
                href={movie.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-red-400 hover:text-red-300"
              >
                View original source
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}