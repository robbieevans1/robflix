import Link from "next/link";
import { prisma } from "@/lib/prisma";


export default async function Home() {
  const movies = await prisma.movie.findMany({
    orderBy: {
      createdAt: "desc",
    }
  });

  return (
        <main className="min-h-screen bg-slate-950 px-8 py-10 text-white">
      <section className="mb-10">
        <h1 className="text-5xl font-bold">Public Domain Movies</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Watch films for free from public-domain and open media archives!
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Featured Movies</h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.slug}`}
              className="rounded-lg bg-slate-900 p-4 transition hover:scale-105"
            >
              {movie.posterUrl && (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="mb-4 aspect-[2/3] w-full rounded object-cover"
                />
              )}

              <h3 className="text-lg font-bold">{movie.title}</h3>
              <p className="text-sm text-slate-400">
                {movie.year} • {movie.genres.join(", ")}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
