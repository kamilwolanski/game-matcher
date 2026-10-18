import fs from "node:fs/promises";
import path from "node:path";

const RAWG_API_KEY = process.env.RAWG_API_KEY;

const PAGE_SIZE = 40;
const MAX_PAGES = 60;

type RawgGenre = {
  id: number;
  name: string;
  slug: string;
};

type RawgGame = {
  id: number;
  name: string;
  slug: string;
  added?: number;
  genres: RawgGenre[];
};

type MmoGameResult = {
  rawgId: number;
  slug: string;
  name: string;
  added: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    `&page=${page}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`RAWG request failed: ${response.status}`);
  }

  return response.json();
}

function isMassivelyMultiplayer(game: RawgGame) {
  return game.genres?.some((genre) => genre.slug === "massively-multiplayer");
}

async function saveResults(results: MmoGameResult[]) {
  const reportsDir = path.join(process.cwd(), "reports");

  await fs.mkdir(reportsDir, {
    recursive: true,
  });

  const filePath = path.join(reportsDir, "massively-multiplayer-games.json");

  await fs.writeFile(filePath, JSON.stringify(results, null, 2), "utf-8");

  console.log(`\nSaved ${results.length} MMO games`);
  console.log(filePath);
}

async function main() {
  const results: MmoGameResult[] = [];

  console.log("=== START ===");

  for (let page = 1; page <= MAX_PAGES; page++) {
    console.log(`\n=== PAGE ${page}/${MAX_PAGES} ===`);

    try {
      const data = await fetchPage(page);

      const games: RawgGame[] = data.results ?? [];

      const massivelyMultiplayerGames = games.filter(isMassivelyMultiplayer);

      console.log(
        `Found ${massivelyMultiplayerGames.length} massively multiplayer games`,
      );

      for (const game of massivelyMultiplayerGames) {
        results.push({
          rawgId: game.id,
          slug: game.slug,
          name: game.name,
          added: game.added ?? 0,
        });

        console.log(`→ ${game.name}`);
      }
    } catch (error) {
      console.error(`Failed page ${page}`);
      console.error(error);
    }

    await sleep(1000);
  }

  results.sort((a, b) => b.added - a.added);

  await saveResults(results);

  console.log("\n=== FINISHED ===");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
