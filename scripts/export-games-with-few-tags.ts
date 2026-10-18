import "dotenv/config";

import fs from "node:fs/promises";

import prisma from "@/lib/prisma";

async function main() {
  const games = await prisma.game.findMany({
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  const filteredGames = games
    .map((game) => ({
      rawgId: game.rawgId,
      slug: game.slug,
      name: game.name,
      tags: game.tags.map((gameTag) => ({
        slug: gameTag.tag.slug,
        name: gameTag.tag.name,
        strength: gameTag.strength,
      })),
    }))
    .filter((game) => game.tags.length <= 5);

  await fs.writeFile(
    "games-with-4-or-less-tags.json",
    JSON.stringify(filteredGames, null, 2),
    "utf-8",
  );

  console.log(
    `Saved ${filteredGames.length} games to games-with-5-or-less-tags.json`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
