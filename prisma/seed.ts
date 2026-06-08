import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.movie.createMany({
    data: [
      {
        slug: "night-of-the-living-dead",
        title: "Night of the Living Dead",
        year: 1968,
        description: "A group of people hide in a farmhouse during a zombie outbreak.",
        runtimeMinutes: 96,
        posterUrl: "https://archive.org/services/img/night_of_the_living_dead",
        genres: ["Horror"],
        sourceName: "Internet Archive",
        sourceUrl: "https://archive.org/details/night_of_the_living_dead",
        archiveIdentifier: "night_of_the_living_dead",
        embedUrl: "https://archive.org/embed/night_of_the_living_dead",
        rightsStatus: "Public Domain",
        rightsProofUrl: "https://archive.org/details/night_of_the_living_dead",
      },
      {
        slug: "the-general",
        title: "The General",
        year: 1926,
        description: "A silent comedy about a train engineer caught in the Civil War.",
        runtimeMinutes: 75,
        posterUrl: "https://archive.org/services/img/TheGeneral",
        genres: ["Comedy", "Action", "Silent"],
        sourceName: "Internet Archive",
        sourceUrl: "https://archive.org/details/TheGeneral",
        archiveIdentifier: "TheGeneral",
        embedUrl: "https://archive.org/embed/TheGeneral",
        rightsStatus: "Public Domain",
        rightsProofUrl: "https://archive.org/details/TheGeneral",
      },
    ],
    skipDuplicates: true,
  });
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