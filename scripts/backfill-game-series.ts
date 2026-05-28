// import "server-only";

import pLimit from "p-limit";

import prisma from "@/lib/prisma";

import {
  fetchRawgGameDetails,
  fetchRawgGameSeries,
} from "@/lib/clients/rawg.client";
import { extractSeriesCandidate } from "@/lib/series/game-series";

const CONCURRENCY = 2;
const GAME_DELAY_MS = 300;

const limit = pLimit(CONCURRENCY);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processGame(game: { id: number; rawgId: number; name: string }) {
  try {
    console.log(`→ ${game.name}`);

    const rawgGame = await fetchRawgGameDetails(game.rawgId);

    const rawgGameSeries = await fetchRawgGameSeries(game.rawgId);

    const detectedSeries = extractSeriesCandidate([
      rawgGame,
      ...rawgGameSeries,
    ]);
    console.log(`${rawgGame.name}, detectedSeries`, detectedSeries)
    const gameSeries =
      detectedSeries && detectedSeries.confidence >= 0.5
        ? detectedSeries
        : null;

    await prisma.game.update({
      where: {
        id: game.id,
      },
      data: {
        seriesName: gameSeries?.name ?? null,
        seriesSlug: gameSeries?.slug ?? null,
      },
    });

    if (gameSeries) {
      console.log(
        `✓ ${game.name} → ${gameSeries.name} (${gameSeries.confidence.toFixed(2)})`,
      );
    } else {
      console.log(`- ${game.name} → no series`);
    }

    await sleep(GAME_DELAY_MS);
  } catch (error) {
    console.error(`✗ Failed: ${game.name}`);
    console.error(error);
  }
}

async function main() {
  console.log("=== UPDATE GAME SERIES START ===");

  const games = await prisma.game.findMany({
    select: {
      id: true,
      rawgId: true,
      name: true,
    },

    // opcjonalnie tylko gry bez series
    where: {
      seriesSlug: null,
    },

      orderBy: {
    id: "asc",
  },
  });

  console.log(`Found ${games.length} games`);

  const jobs = games.map((game) => limit(() => processGame(game)));

  await Promise.all(jobs);

  console.log("=== UPDATE GAME SERIES FINISHED ===");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
