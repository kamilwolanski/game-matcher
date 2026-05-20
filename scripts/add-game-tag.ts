import prisma from "@/lib/prisma";

// Usage:
// npx tsx --env-file=.env scripts/add-game-tag.ts gothic-1 crpg 3

type Params = {
  gameSlug: string;
  tagSlug: string;
  strength: 1 | 2 | 3;
};

async function addGameTag({ gameSlug, tagSlug, strength }: Params) {
  console.log(`\n=== ADD GAME TAG ===`);
  console.log(`Game: ${gameSlug}`);
  console.log(`Tag: ${tagSlug}`);
  console.log(`Strength: ${strength}\n`);

  const game = await prisma.game.findUnique({
    where: {
      slug: gameSlug,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!game) {
    throw new Error(`Game not found: ${gameSlug}`);
  }

  const tag = await prisma.tag.findUnique({
    where: {
      slug: tagSlug,
    },
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });

  if (!tag) {
    throw new Error(`Tag not found: ${tagSlug}`);
  }

  const existingRelation = await prisma.gameTag.findUnique({
    where: {
      gameId_tagId: {
        gameId: game.id,
        tagId: tag.id,
      },
    },
  });

  if (existingRelation) {
    console.log(`Tag "${tag.slug}" already exists on "${game.name}"`);

    console.log(`Updating strength -> ${strength}`);

    await prisma.gameTag.update({
      where: {
        gameId_tagId: {
          gameId: game.id,
          tagId: tag.id,
        },
      },
      data: {
        strength,
      },
    });

    console.log(`✓ Updated tag strength`);

    return;
  }

  await prisma.$transaction([
    prisma.gameTag.create({
      data: {
        gameId: game.id,
        tagId: tag.id,
        strength,
      },
    }),

    prisma.tag.update({
      where: {
        id: tag.id,
      },
      data: {
        gamesCount: {
          increment: 1,
        },
      },
    }),
  ]);

  console.log(
    `✓ Added "${tag.slug}" to "${game.name}" with strength ${strength}`,
  );
}

async function main() {
  const [, , gameSlug, tagSlug, strengthArg] = process.argv;

  if (!gameSlug || !tagSlug || !strengthArg) {
    throw new Error(
      "Usage: npx tsx --env-file=.env scripts/add-game-tag.ts <gameSlug> <tagSlug> <strength>",
    );
  }

  const strength = Number(strengthArg);

  if (![1, 2, 3].includes(strength)) {
    throw new Error("Strength must be 1, 2 or 3");
  }

  await addGameTag({
    gameSlug,
    tagSlug,
    strength: strength as 1 | 2 | 3,
  });
}

main()
  .catch((error) => {
    console.error("\n✗ Script failed");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
