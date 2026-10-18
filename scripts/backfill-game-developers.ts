import pLimit from "p-limit";

import prisma from "@/lib/prisma";
import { fetchRawgGameDetails } from "@/lib/clients/rawg.client";

const CONCURRENCY = 2;
const GAME_DELAY_MS = 300;

const limit = pLimit(CONCURRENCY);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>, retries = 5): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      console.error(`Attempt ${attempt}/${retries} failed`);

      if (attempt < retries) {
        await sleep(1000 * attempt);
      }
    }
  }

  throw lastError;
}

async function processGame(game: { id: number; rawgId: number; name: string }) {
  try {
    console.log(`→ ${game.name}`);

    const rawgGame = await withRetry(() => fetchRawgGameDetails(game.rawgId));

    const developer = rawgGame.developers?.[0];

    await prisma.game.update({
      where: {
        id: game.id,
      },
      data: {
        developerSlug: developer?.slug ?? null,
        developerName: developer?.name ?? null,
        developerGamesCount: developer?.games_count ?? null
      },
    });

    console.log(
      `✓ Updated: ${game.name} (${developer?.name ?? "No developer"})`,
    );

    await sleep(GAME_DELAY_MS);
  } catch (error) {
    console.error(`✗ Failed: ${game.name}`);

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  }
}

async function main() {
  console.log("=== START DEVELOPER BACKFILL ===");

  const games = await prisma.game.findMany({
    select: {
      id: true,
      rawgId: true,
      name: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  console.log(`Found ${games.length} games`);

  const jobs = games.map((game) => limit(() => processGame(game)));

  await Promise.all(jobs);

  console.log("=== BACKFILL FINISHED ===");
}

main()
  .catch((error) => {
    console.error("Fatal error");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
