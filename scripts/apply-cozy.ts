import fs from "node:fs/promises";

import prisma from "@/lib/prisma";

type Strength = 1 | 2 | 3;

function shouldAddCozy(tags: Set<string>) {
  let score = 0;

  // Strong cozy indicators
  if (tags.has("family-friendly")) score += 2;
  if (tags.has("life-sim")) score += 3;
  if (tags.has("farming-sim")) score += 3;
  if (tags.has("relaxing")) score += 2;

  // Soft cozy indicators
  if (tags.has("casual")) score += 1;
  if (tags.has("stylized")) score += 1;

  // Negative indicators
  if (tags.has("horror")) score -= 3;
  if (tags.has("survival-horror")) score -= 4;
  if (tags.has("grimdark")) score -= 3;
  if (tags.has("competitive")) score -= 2;
  if (tags.has("mil-sim")) score -= 3;
  if (tags.has("fast-paced")) score -= 2;

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

    const alreadyHasCozy = tagSlugs.has("cozy");

    const shouldBeCozy = shouldAddCozy(tagSlugs);

    if (alreadyHasCozy) {
      console.log("  already has cozy");
      return;
    }

    if (!shouldBeCozy) {
      console.log("  no cozy match");
      return;
    }

    const cozyTag = await prisma.tag.findUnique({
      where: {
        slug: "cozy",
      },

      select: {
        id: true,
      },
    });

    if (!cozyTag) {
      throw new Error("Missing cozy tag");
    }

    await prisma.$transaction(async (tx) => {
      await tx.gameTag.create({
        data: {
          gameId: game.id,
          tagId: cozyTag.id,
          strength: 1,
        },
      });

      await tx.tag.update({
        where: {
          id: cozyTag.id,
        },

        data: {
          gamesCount: {
            increment: 1,
          },
        },
      });
    });

    addedGames.push(game.name);

    console.log("  added cozy");
  } catch (error) {
    console.error(`✗ Failed: ${game.name}`);
    console.error(error);
  }
}

async function main() {
  console.log("=== COZY TAG INFERENCE START ===");

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

  // =========================================
  // Save results
  // =========================================

  addedGames.sort((a, b) => a.localeCompare(b));

  await fs.writeFile("cozy-added-games.txt", addedGames.join("\n"), "utf8");

  console.log(`Saved ${addedGames.length} games to cozy-added-games.txt`);

  console.log("=== COZY TAG INFERENCE FINISHED ===");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
