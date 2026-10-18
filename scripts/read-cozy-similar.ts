import fs from "node:fs/promises";
import path from "node:path";
import prisma from "@/lib/prisma";

async function main() {
  console.log("Loading cozy like games...");

  const games = await prisma.game.findMany({
    where: {
      tags: {
        some: {
          tag: {
            slug: {
              in: ["relaxing", "pixel-art", "stylized", "casual", "funny"],
            },
          },
        },
        none: {
          tag: {
            slug: {
              in: [
                "cozy",
                "horror",
                "dark",
                "gore",
                "realistic",
                "historical",
                "ww2",
                "metroidvania",
                "souls-like",
                "roguelike",
                "roguelite",
                "survival",
                "fast-paced",
              ],
            },
          },
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

    orderBy: {
      id: "asc",
    },
  });

  console.log(`Found ${games.length} games`);

  const output = games.map((game) => {
    return {
      name: game.name,
      slug: game.slug,

      existingTags: game.tags
        .filter((t) => t.tag.slug === "cozy" || t.tag.slug === "relaxing")
        .map((t) => ({
          slug: t.tag.slug,
          strength: t.strength,
        })),
    };
  });

  const outputPath = path.join(process.cwd(), "cozy-similar-results.json");

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`Saved results to: ${outputPath}`);

  console.log({
    total: output.length,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
