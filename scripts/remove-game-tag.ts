// import "server-only";

// npx tsx --env-file=.env scripts/remove-game-tag.ts gothic-1 gothic
import prisma from "@/lib/prisma";

type Params = {
  gameSlug: string;
  tagSlug: string;
};

async function removeGameTag({ gameSlug, tagSlug }: Params) {
  console.log(`\n=== REMOVE GAME TAG ===`);
  console.log(`Game: ${gameSlug}`);
  console.log(`Tag: ${tagSlug}\n`);

  const game = await prisma.game.findUnique({
    where: {
      slug: gameSlug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
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
      name: true,
      slug: true,
      gamesCount: true,
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

  if (!existingRelation) {
    console.log(`Tag "${tag.slug}" is not assigned to "${game.name}"`);

    return;
  }

  await prisma.$transaction([
    prisma.gameTag.delete({
      where: {
        gameId_tagId: {
          gameId: game.id,
          tagId: tag.id,
        },
      },
    }),

    prisma.tag.update({
      where: {
        id: tag.id,
      },
      data: {
        gamesCount: {
          decrement: 1,
        },
      },
    }),
  ]);

  console.log(`✓ Removed tag "${tag.slug}" from "${game.name}"`);
}

async function main() {
  const [, , gameSlug, tagSlug] = process.argv;

  if (!gameSlug || !tagSlug) {
    throw new Error(
      "Usage: npx tsx --env-file=.env scripts/remove-game-tag.ts <gameSlug> <tagSlug>",
    );
  }

  console.log({
    gameSlug,
    tagSlug,
  });

  await removeGameTag({
    gameSlug,
    tagSlug,
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
