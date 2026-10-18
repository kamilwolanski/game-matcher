import "dotenv/config";

import prisma from "@/lib/prisma";

import {
  fetchRawgGameDetails,
  fetchRawgGameSeries,
} from "@/lib/clients/rawg.client";

import { generateGameTags } from "@/lib/services/game-ai-tagging.service";
import { extractSeriesCandidate } from "@/lib/series/game-series";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readValue(args: string[], name: string) {
  const index = args.indexOf(name);

  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function printUsage() {
  console.log(`
Usage:
  npx tsx scripts/retag-games-by-tag.ts --tag adventure

Options:
  --tag <tag-slug>    Retag all games containing this tag.
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const tagSlug = readValue(args, "--tag");

  if (!tagSlug) {
    throw new Error("Pass --tag <tag-slug>");
  }

  const targetTag = await prisma.tag.findUnique({
    where: {
      slug: tagSlug,
    },
  });

  if (!targetTag) {
    throw new Error(`Tag "${tagSlug}" not found`);
  }

  const games = await prisma.game.findMany({
    where: {
      tags: {
        some: {
          tagId: targetTag.id,
        },
      },
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  console.log(`Found ${games.length} games with "${tagSlug}" tag`);

  const failedGames: {
    game: string;
    rawgId: number;
    error: string;
  }[] = [];

  for (const game of games) {
    console.log(`\n=== ${game.name} ===`);

    try {
      // =========================================================
      // Fetch fresh RAWG data FIRST
      // =========================================================

      const rawgGame = await fetchRawgGameDetails(game.rawgId);

      const rawgGameSeries = await fetchRawgGameSeries(game.rawgId);

      const detectedSeries = extractSeriesCandidate([
        rawgGame,
        ...rawgGameSeries,
      ]);

      const gameSeries =
        detectedSeries && detectedSeries.confidence >= 0.5
          ? detectedSeries
          : null;

      // =========================================================
      // Generate new tags FIRST
      // =========================================================

      const tags = await generateGameTags(rawgGame);

      console.log(`→ New tags: ${tags.map((tag) => tag.slug).join(", ")}`);

      const strengthMap = new Map(tags.map((tag) => [tag.slug, tag.strength]));

      // =========================================================
      // Transaction
      // =========================================================

      await prisma.$transaction(async (tx) => {
        // =========================================================
        // Decrement old tag counters
        // =========================================================

        for (const gameTag of game.tags) {
          await tx.tag.update({
            where: {
              id: gameTag.tagId,
            },
            data: {
              gamesCount: {
                decrement: 1,
              },
            },
          });
        }

        // =========================================================
        // Remove old relations
        // =========================================================

        await tx.gameTag.deleteMany({
          where: {
            gameId: game.id,
          },
        });

        // =========================================================
        // Upsert new tags
        // =========================================================

        const dbTags = await Promise.all(
          tags.map((tag) =>
            tx.tag.upsert({
              where: {
                slug: tag.slug,
              },
              update: {
                name: tag.name,
              },
              create: {
                slug: tag.slug,
                name: tag.name,
              },
            }),
          ),
        );

        // =========================================================
        // Create new relations + increment counters
        // =========================================================

        for (const tag of dbTags) {
          await tx.gameTag.create({
            data: {
              gameId: game.id,
              tagId: tag.id,
              strength: strengthMap.get(tag.slug) ?? 2,
            },
          });

          await tx.tag.update({
            where: {
              id: tag.id,
            },
            data: {
              gamesCount: {
                increment: 1,
              },
            },
          });
        }

        // =========================================================
        // Update series
        // =========================================================

        await tx.game.update({
          where: {
            id: game.id,
          },
          data: {
            seriesName: gameSeries?.name ?? null,
            seriesSlug: gameSeries?.slug ?? null,
          },
        });
      });

      console.log("✓ Reseeded");

      // =========================================================
      // Delay for RAWG / OpenAI rate limits
      // =========================================================

      await sleep(300);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      console.error(`✗ Failed: ${game.name}`);
      console.error(message);

      failedGames.push({
        game: game.name,
        rawgId: game.rawgId,
        error: message,
      });
    }
  }

  // =========================================================
  // Summary
  // =========================================================

  console.log("\n=== DONE ===");

  if (failedGames.length > 0) {
    console.log(`\nFailed games: ${failedGames.length}`);

    for (const failed of failedGames) {
      console.log(`- ${failed.game} (${failed.rawgId}) → ${failed.error}`);
    }
  } else {
    console.log("No failed games 🎉");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
