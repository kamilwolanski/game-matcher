import { RawgGame } from "@/types/rawg";

export type GameSeries = {
  name: string;
  slug: string;
  confidence: number;
} | null;

const INVALID_SERIES_WORDS = [
  "edition",
  "collection",
  "pack",
  "bundle",
  "expansion",
  "dlc",
  "remastered",
  "remake",
  "complete",
  "definitive",
  "enhanced",
  "online",
];

function createSeriesSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function cleanGameName(name: string) {
  return (
    name
      .replace(/:\s.*$/i, "")
      .replace(/\(.*?\)/g, "")
      .replace(/\s-\s.*$/i, "")

      // usuń numerki
      .replace(/\b\d+\b/g, "")

      // usuń cyfry rzymskie
      .replace(/\b(i|ii|iii|iv|v|vi|vii|viii|ix|x)\b/gi, "")

      // usuń śmieciowe suffixy
      .replace(
        /\b(definitive edition|complete edition|game of the year edition|remastered|remake|collection|bundle|online|enhanced edition)\b/gi,
        "",
      )

      .replace(/\s+/g, " ")
      .trim()
  );
}

function generateCandidatePrefixes(name: string) {
  const cleaned = cleanGameName(name);

  if (!cleaned) {
    return [];
  }

  const parts = cleaned.split(" ");

  const prefixes: string[] = [];

  // minimum 1 słowo
  // maximum 4 słowa
  for (let i = 1; i <= Math.min(parts.length, 4); i++) {
    const prefix = parts.slice(0, i).join(" ").trim();

    if (prefix.length < 3) {
      continue;
    }

    // unikaj "The"
    if (["the", "a", "an"].includes(prefix.toLowerCase())) {
      continue;
    }

    prefixes.push(prefix);
  }

  return prefixes;
}

export function extractSeriesCandidate(games: RawgGame[]): GameSeries {
  const filteredGames = games.filter((game) => {
    const lower = game.name.toLowerCase();

    return !INVALID_SERIES_WORDS.some((word) => lower.includes(word));
  });

  if (filteredGames.length < 2) {
    return null;
  }

  const counts = new Map<
    string,
    {
      count: number;
      wordCount: number;
    }
  >();

  for (const game of filteredGames) {
    const prefixes = generateCandidatePrefixes(game.name);

    for (const prefix of prefixes) {
      const normalized = prefix.trim();

      if (!normalized) continue;

      const current = counts.get(normalized);

      counts.set(normalized, {
        count: (current?.count ?? 0) + 1,
        wordCount: normalized.split(" ").length,
      });
    }
  }

  const sorted = [...counts.entries()].sort((a, b) => {
    const aData = a[1];
    const bData = b[1];

    // najpierw ilość trafień
    if (bData.count !== aData.count) {
      return bData.count - aData.count;
    }

    // potem preferuj dłuższy prefix
    return bData.wordCount - aData.wordCount;
  });

  const best = sorted[0];

  if (!best) {
    return null;
  }

  const [seriesName, data] = best;

  if (data.count < 2) {
    return null;
  }

  return {
    name: seriesName,
    slug: createSeriesSlug(seriesName),
    confidence: data.count / filteredGames.length,
  };
}
