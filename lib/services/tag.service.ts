import "server-only";

import { Prisma } from "@/app/generated/prisma/client";
import { TAG_SLUGS } from "@/consts/tags";
import prisma from "@/lib/prisma";
import type { ShortTag } from "@/lib/dto/tag.dto";

export async function getRandomTags(count: number): Promise<ShortTag[]> {

  return prisma.$queryRaw<ShortTag[]>`
    SELECT slug, name, "gamesCount"
    FROM "Tag"
    WHERE slug NOT IN (${Prisma.join(TAG_SLUGS)})
    ORDER BY RANDOM()
    LIMIT ${count}
  `;
}
