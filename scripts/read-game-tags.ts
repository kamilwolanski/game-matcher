import "dotenv/config";

import prisma from "@/lib/prisma";

type CliOptions = {
  rawgId?: number;
  slug?: string;
};

function printUsage() {
  console.log(`
Usage:
  npx tsx scripts/read-game-tags.ts --slug gothic-1
  npx tsx scripts/read-game-tags.ts --slug the-elder-scrolls-v-skyrim
  npx tsx scripts/read-game-tags.ts --rawg-id 3498

Options:
  --slug <game-slug>      Game slug from the database.
  --rawg-id <id>          RAWG id from the database.
`);
}

function readValue(args: string[], name: string) {
  const index = args.indexOf(name);

  if (index === -1) return undefined;

  return args[index + 1];
}

function parseArgs(args: string[]): CliOptions {
  const rawgIdValue = readValue(args, "--rawg-id");
  const slug = readValue(args, "--slug");
  const rawgId = rawgIdValue === undefined ? undefined : Number(rawgIdValue);

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  if (!slug && !rawgId) {
    throw new Error("Pass --slug or --rawg-id.");
  }

  if (slug && rawgId) {
    throw new Error("Pass only one game identifier: --slug or --rawg-id.");
  }

  if (
    rawgId !== undefined &&
    (!Number.isInteger(rawgId) || rawgId <= 0)
  ) {
    throw new Error("--rawg-id must be a positive integer.");
  }

  return {
    rawgId,
    slug,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const where = options.rawgId
    ? { rawgId: options.rawgId }
    : { slug: options.slug };

  const game = await prisma.game.findUnique({
    where,
    include: {
      tags: {
        include: {
          tag: true,
        },
        orderBy: {
          tag: {
            slug: "asc",
          },
        },
      },
    },
  });

  if (!game) {
    throw new Error("Game not found.");
  }

  const tags = game.tags.map((r) => ({
    name: r.tag.slug,
    slug: r.tag.slug,
    strength: r.strength,
    gamesCount: r.tag.gamesCount
  }));

  if (tags.length === 0) {
    console.log("Tags: -");
    return;
  }

  console.table(
    tags.map((tag) => ({
      slug: tag.slug,
      name: tag.name,
      strenght: tag.strength,
      gamesCount: tag.gamesCount,
    })).sort((a, b) => b.strenght - a.strenght),
  );
  console.log(`Slugs: ${tags.map((tag) => tag.slug).join(",")}`);
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
