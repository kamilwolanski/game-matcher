import { Prisma, type Tag } from "@/app/generated/prisma/client";
import prisma from "./prisma";
import { BASE_TAGS } from "../consts/base-tags";

export type ShortTag = Pick<Tag, "slug" | "name">;

export const getRandomTags = async (count: number): Promise<ShortTag[]> => {
  const tagSlugs = Object.entries(BASE_TAGS).map((tag) => tag[0]);

  const tags = await prisma.$queryRaw<ShortTag[]>`
  SELECT slug, name
  FROM "Tag"
  WHERE slug NOT IN (${Prisma.join(tagSlugs)})
  ORDER BY RANDOM()
  LIMIT ${count}
`;
  return tags;
};
