import prisma from "@/lib/prisma";
import fs from "fs/promises";

async function main() {
  console.log("Wczytano dane z tags-from-db.json");
  const tagsFromDb = await prisma.tag.findMany({
    orderBy: {
      gamesCount: "desc",
    },
  });
  const tagNames = tagsFromDb
    .sort((a, b) => b.gamesCount - a.gamesCount)
    .map((tag) => {
      return {
        id: tag.id,
        slug: tag.slug,
        name: tag.name,
        gamesCount: tag.gamesCount,
      };
    });

  await fs.writeFile(
    "tags-from-db.json",
    JSON.stringify(tagNames, null, 2),
    "utf-8",
  );
}

main();
