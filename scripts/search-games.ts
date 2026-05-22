import "dotenv/config";

import prisma from "@/lib/prisma";

// Usage:
// npx tsx --env-file=.env scripts/search-games.ts gothic
// npx tsx --env-file=.env scripts/search-games.ts witcher 3
// npx tsx --env-file=.env scripts/search-games.ts red dead redemption

function normalize(text: string) {
  return text.toLowerCase().trim().replace(/[-_:]/g, " ").replace(/\s+/g, " ");
}

function similarity(a: string, b: string) {
  const aWords = new Set(normalize(a).split(" "));
  const bWords = new Set(normalize(b).split(" "));

  const intersection = [...aWords].filter((word) => bWords.has(word)).length;

  return intersection / Math.max(aWords.size, bWords.size);
}

async function main() {
  const query = process.argv.slice(2).join(" ").trim();

  if (!query) {
    throw new Error("Provide search query");
  }

  const normalizedQuery = normalize(query);

  const games = await prisma.game.findMany({
    select: {
      id: true,
      rawgId: true,
      name: true,
      slug: true,
      released: true,
    },
  });

  const ranked = games
    .map((game) => {
      const normalizedName = normalize(game.name);
      const normalizedSlug = normalize(game.slug);

      let score = 0;

      // Exact matches
      if (normalizedName === normalizedQuery) {
        score += 1000;
      }

      if (normalizedSlug === normalizedQuery) {
        score += 1000;
      }

      // Starts with
      if (normalizedName.startsWith(normalizedQuery)) {
        score += 300;
      }

      if (normalizedSlug.startsWith(normalizedQuery)) {
        score += 300;
      }

      // Includes
      if (normalizedName.includes(normalizedQuery)) {
        score += 200;
      }

      if (normalizedSlug.includes(normalizedQuery)) {
        score += 200;
      }

      // Word similarity
      score += similarity(normalizedName, normalizedQuery) * 100;
      score += similarity(normalizedSlug, normalizedQuery) * 100;

      return {
        ...game,
        score: Math.round(score),
      };
    })
    .filter((game) => game.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  if (ranked.length === 0) {
    console.log("No games found");
    return;
  }

  console.table(
    ranked.map((game) => ({
      score: game.score,
      name: game.name,
      slug: game.slug,
      rawgId: game.rawgId,
      released: game.released
        ? game.released.toISOString().split("T")[0]
        : null,
    })),
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
