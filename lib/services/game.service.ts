import "server-only";

import prisma from "@/lib/prisma";
import { fetchRawgGameDetails } from "@/lib/clients/rawg.client";
import { toGameDto } from "@/lib/mappers/game.mapper";
import { normalizeTags } from "@/lib/tag-normalizer";
import type { RawgGame } from "@/types/rawg";
import { BASE_TAGS } from "@/consts/base-tags";
import { ShortTag } from "../dto/tag.dto";

const gameWithTagsInclude = {
  tags: {
    include: {
      tag: true,
    },
  },
} as const;

export async function getGameByRawgId(rawgId: number) {
  const game = await prisma.game.findUnique({
    where: { rawgId },
    include: gameWithTagsInclude,
  });

  if (!game) return null;

  return toGameDto(game);
}

export async function getBaseTags(): Promise<ShortTag[]> {
  const baseTagSlugs = Object.keys(BASE_TAGS);

  return prisma.tag.findMany({
    where: {
      slug: {
        in: baseTagSlugs,
      },
    },
    select: {
      slug: true,
      name: true,
      gamesCount: true,
    },
  });
}

export async function saveRawgGame(rawgGame: RawgGame) {
  const tags = normalizeTags(rawgGame.tags);

  return prisma.$transaction(async (tx) => {
    const game = await tx.game.upsert({
      where: { rawgId: rawgGame.id },
      update: {},
      create: {
        rawgId: rawgGame.id,
        name: rawgGame.name,
        slug: rawgGame.slug,
        description: rawgGame.description_raw,
        image: rawgGame.background_image,
        rating: rawgGame.rating,
        added: rawgGame.added,
        released: rawgGame.released ? new Date(rawgGame.released) : null,
        platforms: rawgGame.platforms?.map((p) => p.platform.name) ?? [],
      },
    });

    const dbTags = await Promise.all(
      tags.map(async (tag) => {
        const dbTag = await tx.tag.upsert({
          where: { slug: tag.slug },
          update: { name: tag.name },
          create: {
            slug: tag.slug,
            name: tag.name,
            gamesCount: tag.gamesCount,
          },
        });

        if (tag.gamesCount > dbTag.gamesCount) {
          return tx.tag.update({
            where: { id: dbTag.id },
            data: { gamesCount: tag.gamesCount },
          });
        }

        return dbTag;
      }),
    );

    if (dbTags.length > 0) {
      await tx.gameTag.createMany({
        data: dbTags.map((tag) => ({
          gameId: game.id,
          tagId: tag.id,
        })),
        skipDuplicates: true,
      });
    }

    const fullGame = await tx.game.findUnique({
      where: { id: game.id },
      include: gameWithTagsInclude,
    });

    if (!fullGame) throw new Error("Game not found after save");

    return toGameDto(fullGame);
  });
}

export async function selectGameByRawgId(rawgId: number) {
  const existingGame = await getGameByRawgId(rawgId);

  if (existingGame) {
    return existingGame;
  }

  const rawgGame = await fetchRawgGameDetails(rawgId);

  return saveRawgGame(rawgGame);
}

export const getGame = getGameByRawgId;
