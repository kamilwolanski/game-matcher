import "dotenv/config";

import prisma from "@/lib/prisma";

type CliOptions = {
  rawgId?: number;
  slug?: string;
  dryRun: boolean;
};

function printUsage() {
  console.log(`
Usage:
  npx tsx scripts/delete-game.ts --slug dark-messiah-of-might-and-magic
  npx tsx scripts/delete-game.ts --rawg-id 1234 --dry-run

Options:
  --slug <game-slug>      Game slug from the database.
  --rawg-id <id>          RAWG id from the database.
  --dry-run               Print planned changes without writing to the database.
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
    dryRun: args.includes("--dry-run"),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const where = options.rawgId
    ? { rawgId: options.rawgId }
    : { slug: options.slug };

  await prisma.$transaction(async (tx) => {
    const game = await tx.game.findUnique({
      where,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!game) {
      throw new Error("Game not found.");
    }

    const tagIds = game.tags.map(({ tagId }) => tagId);
    const tagSlugs = game.tags.map(({ tag }) => tag.slug);

    console.log(`Game: ${game.name} (${game.slug}, RAWG ${game.rawgId})`);
    console.log(`Tags to decrement: ${tagSlugs.join(", ") || "-"}`);

    if (options.dryRun) {
      console.log("Dry run: no database changes were written.");
      return;
    }

    if (tagIds.length > 0) {
      await tx.tag.updateMany({
        where: {
          id: {
            in: tagIds,
          },
          gamesCount: {
            gt: 0,
          },
        },
        data: {
          gamesCount: {
            decrement: 1,
          },
        },
      });
    }

    await tx.game.delete({
      where: {
        id: game.id,
      },
    });

    console.log("Deleted.");
  });
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
