// import "server-only";

import type { SearchGameResult } from "@/lib/dto/search-game.dto";
import type { RawgGame, RawgSearchGame } from "@/types/rawg";

const RAWG_BASE_URL = "https://api.rawg.io/api";
const DEFAULT_SEARCH_PAGE_SIZE = 5;

export class RawgApiError extends Error {
  constructor(
    public readonly status: number,
    statusText: string,
  ) {
    super(`RAWG API error: ${status} ${statusText}`);
  }
}

function getRawgApiKey() {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RAWG_API_KEY environment variable");
  }

  return apiKey;
}

function createRawgUrl(path: string) {
  const url = new URL(`${RAWG_BASE_URL}${path}`);
  url.searchParams.set("key", getRawgApiKey());

  return url;
}

async function fetchRawg<T>(url: URL): Promise<T> {
  const response = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 }, // 1 hour
  });

  if (!response.ok) {
    throw new RawgApiError(response.status, response.statusText);
  }

  return response.json() as Promise<T>;
}

function toSearchGameResult(game: RawgSearchGame): SearchGameResult {
  return {
    rawgId: game.id,
    name: game.name,
    image: game.background_image,
    releasedYear: game.released ? new Date(game.released).getFullYear() : null,
  };
}

export async function fetchRawgGameDetails(rawgId: number) {
  return fetchRawg<RawgGame>(createRawgUrl(`/games/${rawgId}`));
}

export async function searchRawgGames(query: string) {
  const url = createRawgUrl("/games");
  url.searchParams.set("page_size", String(DEFAULT_SEARCH_PAGE_SIZE));

  if (query) {
    url.searchParams.set("search", query);
  }

  const data = await fetchRawg<{ results: RawgSearchGame[] }>(url);

  return data.results.map(toSearchGameResult);
}
