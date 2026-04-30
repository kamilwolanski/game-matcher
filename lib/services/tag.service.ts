import "server-only";

import { Prisma } from "@/app/generated/prisma/client";
import { BASE_TAGS } from "@/consts/base-tags";
import prisma from "@/lib/prisma";
import type { ShortTag } from "@/lib/dto/tag.dto";

export async function getRandomTags(count: number): Promise<ShortTag[]> {
  const baseTagSlugs = Object.keys(BASE_TAGS);

  return prisma.$queryRaw<ShortTag[]>`
    SELECT slug, name, "gamesCount"
    FROM "Tag"
    WHERE slug NOT IN (${Prisma.join(baseTagSlugs)})
    ORDER BY RANDOM()
    LIMIT ${count}
  `;
}
