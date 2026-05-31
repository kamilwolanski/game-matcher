import prisma from "@/lib/prisma";

// Usage:
// npx tsx --env-file=.env scripts/change-game-developer.ts gothic-1 piranha-bytes "Piranha Bytes"

type Params = {
  gameSlug: string;
  developerSlug: string | null;
  developerName: string | null;
};

async function changeGameDeveloper({
  gameSlug,
  developerSlug,
  developerName,
}: Params) {
  console.log(`\n=== CHANGE GAME DEVELOPER ===`);
  console.log(`Game: ${gameSlug}`);
  console.log(`Developer slug: ${developerSlug}`);
  console.log(`Developer name: ${developerName}\n`);

  const game = await prisma.game.findUnique({
    where: {
      slug: gameSlug,
    },
    select: {
      id: true,
      name: true,
      developerSlug: true,
      developerName: true,
    },
  });

  if (!game) {
    throw new Error(`Game not found: ${gameSlug}`);
  }

  console.log(`Current developer:`);
  console.log(`- slug: ${game.developerSlug}`);
  console.log(`- name: ${game.developerName}\n`);

  await prisma.game.update({
    where: {
      id: game.id,
    },
    data: {
      developerSlug,
      developerName,
    },
  });

  console.log(`✓ Developer updated successfully`);
  console.log(`New developer:`);
  console.log(`- slug: ${developerSlug}`);
  console.log(`- name: ${developerName}`);
}

async function main() {
  const [, , gameSlug, developerSlugArg, ...developerNameParts] = process.argv;

  if (!gameSlug) {
    throw new Error(
      "Usage: npx tsx --env-file=.env scripts/change-game-developer.ts <gameSlug> <developerSlug|null> <developerName|null>",
    );
  }

  const developerSlug = developerSlugArg === "null" ? null : developerSlugArg;

  const developerNameRaw = developerNameParts.join(" ");

  const developerName =
    developerNameRaw === "null" || developerNameRaw.length === 0
      ? null
      : developerNameRaw;

  await changeGameDeveloper({
    gameSlug,
    developerSlug,
    developerName,
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
