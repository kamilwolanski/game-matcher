import fs from "node:fs/promises";

import prisma from "@/lib/prisma";

function shouldAddFunny(tags: Set<string>) {
  let score = 0;

  // Strong indicators
  if (tags.has("party-game")) score += 3;
  if (tags.has("physics-based")) score += 2;
  if (tags.has("family-friendly")) score += 1;
  if (tags.has("stylized")) score += 1;
  if (tags.has("sandbox")) score += 1;

  // Negative indicators
  if (tags.has("grimdark")) score -= 4;
  if (tags.has("survival-horror")) score -= 4;
  if (tags.has("horror")) score -= 2;
  if (tags.has("mil-sim")) score -= 4;

  return score >= 4;
}

const addedGames: string[] = [];

async function processGame(game: {
  id: number;
  name: string;

  tags: {
    tagId: number;
    strength: number;

    tag: {
      id: number;
      slug: string;
    };
  }[];
}) {
  try {
    console.log(`→ ${game.name}`);

    const tagSlugs = new Set(game.tags.map((t) => t.tag.slug));

    const alreadyHasFunny = tagSlugs.has("funny");

    const shouldBeFunny = shouldAddFunny(tagSlugs);

    if (alreadyHasFunny) {
      console.log("  already has funny");
      return;
    }

    if (!shouldBeFunny) {
      console.log("  no funny match");
      return;
    }

    const funnyTag = await prisma.tag.findUnique({
      where: {
        slug: "funny",
      },

      select: {
        id: true,
      },
    });

    if (!funnyTag) {
      throw new Error("Missing funny tag");
    }

    await prisma.$transaction(async (tx) => {
      await tx.gameTag.create({
        data: {
          gameId: game.id,
          tagId: funnyTag.id,
          strength: 1,
        },
      });

      await tx.tag.update({
        where: {
          id: funnyTag.id,
        },

        data: {
          gamesCount: {
            increment: 1,
          },
        },
      });
    });

    addedGames.push(game.name);

    console.log("  added funny");
  } catch (error) {
    console.error(`✗ Failed: ${game.name}`);
    console.error(error);
  }
}

async function main() {
  console.log("=== FUNNY TAG INFERENCE START ===");

  const games = await prisma.game.findMany({
    select: {
      id: true,
      name: true,

      tags: {
        select: {
          tagId: true,
          strength: true,

          tag: {
            select: {
              id: true,
              slug: true,
            },
          },
        },
      },
    },

    orderBy: {
      id: "asc",
    },
  });

  console.log(`Found ${games.length} games`);

  for (const game of games) {
    await processGame(game);
  }

  addedGames.sort((a, b) => a.localeCompare(b));

  await fs.writeFile("funny-added-games.txt", addedGames.join("\n"), "utf8");

  console.log(`Saved ${addedGames.length} games to funny-added-games.txt`);

  console.log("=== FUNNY TAG INFERENCE FINISHED ===");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
