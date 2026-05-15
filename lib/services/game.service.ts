// import "server-only";

import prisma from "@/lib/prisma";
import {
  fetchRawgGameDetails,
  fetchRawgGameSeries,
} from "@/lib/clients/rawg.client";
import { toGameDto } from "@/lib/mappers/game.mapper";
import type { RawgGame } from "@/types/rawg";
import { TAGS, TAG_SLUGS } from "@/consts/tags";
import { ShortTag } from "../dto/tag.dto";
import { Prisma } from "@/app/generated/prisma/client";
import { generateGameTags } from "@/lib/services/game-ai-tagging.service";
import { extractSeriesCandidate, GameSeries } from "../series/game-series";

const gameWithTagsInclude = {
  tags: {
    include: {
      tag: true,
    },
  },
} as const;

function isDuplicateError(e: unknown) {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
  );
}

export async function getGameByRawgId(rawgId: number) {
  const game = await prisma.game.findUnique({
    where: { rawgId },
    include: gameWithTagsInclude,
  });

  if (!game) return null;

  return toGameDto(game);
}

export async function getBaseTags(): Promise<ShortTag[]> {
  const dbTags = await prisma.tag.findMany({
    where: {
      slug: {
        in: TAG_SLUGS,
      },
    },
    select: {
      slug: true,
      name: true,
      gamesCount: true,
    },
  });

  const dbTagMap = new Map(dbTags.map((tag) => [tag.slug, tag]));

  return TAGS.map((tag) => ({
    slug: tag.slug,
    name: tag.name,
    gamesCount: dbTagMap.get(tag.slug)?.gamesCount ?? 0,
  }));
}

export async function saveRawgGame(rawgGame: RawgGame, gameSeries: GameSeries) {
  // =========================================================
  // AI tagging
  // =========================================================
  try {
    const tags = await generateGameTags(rawgGame);
    const strengthMap = new Map(tags.map((tag) => [tag.slug, tag.strength]));
    // =========================================================
    // Transaction
    // =========================================================
    return prisma.$transaction(async (tx) => {
      // =========================================================
      // Create game
      // =========================================================

      const game = await tx.game.create({
        data: {
          rawgId: rawgGame.id,
          name: rawgGame.name,
          slug: rawgGame.slug,
          description: rawgGame.description_raw,
          image: rawgGame.background_image,
          rating: rawgGame.rating,
          added: rawgGame.added,
          released: rawgGame.released ? new Date(rawgGame.released) : null,
          platforms: rawgGame.platforms?.map((p) => p.platform.name) ?? [],
          metacritic: rawgGame.metacritic,
          developerSlug: rawgGame.developers?.[0]?.slug ?? null,
          developerName: rawgGame.developers?.[0]?.name ?? null,
          developerGamesCount: rawgGame.developers?.[0]?.games_count ?? null,
          seriesName: gameSeries?.name,
          seriesSlug: gameSeries?.slug
        },
      });

      // =========================================================
      // Upsert tags
      // =========================================================

      const dbTags = await Promise.all(
        tags.map((tag) =>
          tx.tag.upsert({
            where: {
              slug: tag.slug,
            },
            update: {
              name: tag.name,
            },
            create: {
              slug: tag.slug,
              name: tag.name,
            },
          }),
        ),
      );

      // =========================================================
      // Create relations safely
      // =========================================================

      await Promise.all(
        dbTags.map(async (tag) => {
          const existingRelation = await tx.gameTag.findUnique({
            where: {
              gameId_tagId: {
                gameId: game.id,
                tagId: tag.id,
              },
            },
          });

          if (existingRelation) {
            return;
          }

          await tx.gameTag.create({
            data: {
              gameId: game.id,
              tagId: tag.id,
              strength: strengthMap.get(tag.slug) ?? 2,
            },
          });

          await tx.tag.update({
            where: {
              id: tag.id,
            },
            data: {
              gamesCount: {
                increment: 1,
              },
            },
          });
        }),
      );

      // =========================================================
      // Return full game
      // =========================================================

      const fullGame = await tx.game.findUnique({
        where: {
          id: game.id,
        },
        include: gameWithTagsInclude,
      });

      if (!fullGame) {
        throw new Error("Game not found after save");
      }

      return toGameDto(fullGame);
    });
  } catch (error) {
    if (isDuplicateError(error)) {
      return getGameByRawgId(rawgGame.id);
    }

    throw error;
  }
}

export async function getOrCreateGameByRawgId(rawgId: number) {
  const existingGame = await getGameByRawgId(rawgId);



  const [rawgGame, gameSeries] = await Promise.all([
    fetchRawgGameDetails(rawgId),
    fetchRawgGameSeries(rawgId),
  ]);

  const series = extractSeriesCandidate([...gameSeries, rawgGame]);

  if (existingGame) {
    return existingGame;
  }

  return saveRawgGame(rawgGame, series);
}

export const getGame = getGameByRawgId;
