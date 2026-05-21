import prisma from "@/lib/prisma";
// npx tsx --env-file=.env scripts/print-game.ts gothic-1
// npx tsx --env-file=.env.local scripts/print-game.ts gothic-1
async function main() {
  const slug = process.argv[2];

  if (!slug) {
    throw new Error("Provide game slug");
  }

  const game = await prisma.game.findUnique({
    where: {
      slug,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!game) {
    console.log(`Game not found: ${slug}`);
    return;
  }

  console.table([
    {
      id: game.id,
      rawgId: game.rawgId,
      name: game.name,
      slug: game.slug,
      developer: game.developerName,
      developerSlug: game.developerSlug,
      seriesName: game.seriesName,
      seriesSlug: game.seriesSlug,
      rating: game.rating,
      metacritic: game.metacritic,
      released: game.released?.toISOString().split("T")[0] ?? null,
    },
  ]);

  console.log("\nTags:\n");

  console.table(
    game.tags.map((gameTag) => ({
      slug: gameTag.tag.slug,
      name: gameTag.tag.name,
      strength: gameTag.strength,
      gamesCount: gameTag.tag.gamesCount,
    })),
  );
}

main()
  .catch((error) => {
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });