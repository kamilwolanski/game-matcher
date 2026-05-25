import fs from "node:fs/promises";
import path from "node:path";

import pLimit from "p-limit";

import {
  fetchRawgGameDetails,
  fetchRawgGameSeries,
} from "@/lib/clients/rawg.client";
import { saveRawgGame } from "@/lib/services/game.service";
import type { RawgGame } from "@/types/rawg";
import prisma from "@/lib/prisma";
import { shouldHideGame } from "@/lib/clients/rawg-filters";
import { extractSeriesCandidate } from "@/lib/series/game-series";

const RAWG_API_KEY = process.env.RAWG_API_KEY;

const PAGE_SIZE = 40;
const MAX_PAGES = 80;

const CONCURRENCY = 2;

const PAGE_DELAY_MS = 1000;
const GAME_DELAY_MS = 300;

const limit = pLimit(CONCURRENCY);

const failedGames: {
  page: number;
  rawgId: number;
  slug: string;
  name: string;
  error: string;
}[] = [];

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

async function processGame(game: RawgGame, page: number) {
  try {
    const alreadySeededGame = await prisma.game.findUnique({
      where: {
        rawgId: game.id,
      },
      select: {
        id: true,
      },
    });

    if (alreadySeededGame) {
      console.log(`→ Game already exists in the database: ${game.name}`);
      return;
    }

    console.log(`→ ${game.name}`);

    const rawgGame = await withRetry(() => fetchRawgGameDetails(game.id));

    const rawgGameSeries = await withRetry(() => fetchRawgGameSeries(game.id));

    const detectedSeries = extractSeriesCandidate([
      rawgGame,
      ...rawgGameSeries,
    ]);

    const gameSeries =
      detectedSeries && detectedSeries.confidence >= 0.5
        ? detectedSeries
        : null;

    if (gameSeries) {
      console.log(
        `→ Series detected: ${gameSeries.name} (${gameSeries.confidence.toFixed(2)})`,
      );
    }

    await withRetry(() => saveRawgGame(rawgGame, gameSeries));

    console.log(`✓ Saved: ${game.name}`);

    await sleep(GAME_DELAY_MS);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error(`✗ Failed: ${game.name}`);
    console.error(message);

    failedGames.push({
      page,
      rawgId: game.id,
      slug: game.slug,
      name: game.name,
      error: message,
    });
  }
}

async function fetchPage(page: number) {
  if (!RAWG_API_KEY) {
    throw new Error("Missing RAWG_API_KEY");
  }

  const url =
    `https://api.rawg.io/api/games` +
    `?key=${RAWG_API_KEY}` +
    `&ordering=-added` +
    `&page_size=${PAGE_SIZE}` +
    // `&exclude_additions=true` +
    `&page=${page}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`RAWG request failed: ${response.status}`);
  }

  return response.json();
}

async function saveFailedGamesReport() {
  if (failedGames.length === 0) {
    console.log("No failed games 🎉");
    return;
  }

  const reportsDir = path.join(process.cwd(), "reports");

  await fs.mkdir(reportsDir, {
    recursive: true,
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const filePath = path.join(reportsDir, `failed-games-${timestamp}.json`);

  await fs.writeFile(filePath, JSON.stringify(failedGames, null, 2), "utf-8");

  console.log(`\nSaved failed games report:`);
  console.log(filePath);
  console.log(`Failed games count: ${failedGames.length}`);
}

async function main() {
  console.log("=== START SEED ===");

  for (let page = 70; page <= MAX_PAGES; page++) {
    console.log(`\n=== PAGE ${page}/${MAX_PAGES} ===`);

    try {
      const data = await withRetry(() => fetchPage(page));

      const games: RawgGame[] = data.results ?? [];

      const filteredGames = games.filter(
        (game) =>
          !shouldHideGame({
            slug: game.slug,
            name: game.name,
            added: game.added || 0,
            released: game.released || null,
            tba: game.tba,
          }),
      );

      console.log(
        `Found ${games.length} games (${filteredGames.length} after filtering)`,
      );

      const jobs = filteredGames.map((game) =>
        limit(() => processGame(game, page)),
      );

      await Promise.all(jobs);

      console.log(`✓ Finished page ${page}`);
    } catch (error) {
      console.error(`✗ Failed page ${page}`);
      console.error(error);
    }

    await sleep(PAGE_DELAY_MS);
  }

  await saveFailedGamesReport();

  console.log("\n=== SEED FINISHED ===");
}

main().catch(async (error) => {
  console.error("Fatal seed error");
  console.error(error);

  await saveFailedGamesReport();

  process.exit(1);
});
