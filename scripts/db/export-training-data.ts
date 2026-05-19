import "dotenv/config";

import { writeFileSync } from "fs";
import prisma from "@/lib/prisma";

async function main() {
  const games = await prisma.game.findMany({
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  const trainingData = games
    .map((game) => game.tags.map((t) => t.tag.slug))
    .filter((tags) => tags.length > 0);

  writeFileSync(
    "./scripts/ml/training-data.json",
    JSON.stringify(trainingData, null, 2),
  );

  console.log(`Exported ${trainingData.length} games`);
}

main();
