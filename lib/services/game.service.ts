// import "server-only";

import prisma from "@/lib/prisma";
import { fetchRawgGameDetails } from "@/lib/clients/rawg.client";
import { toGameDto } from "@/lib/mappers/game.mapper";
import type { RawgGame } from "@/types/rawg";
import { TAG_SLUGS } from "@/consts/tags";
import { ShortTag } from "../dto/tag.dto";
import { Prisma } from "@/app/generated/prisma/client";
import { generateGameTags } from "@/lib/services/game-ai-tagging.service";

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
  return prisma.tag.findMany({
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
}

export async function saveRawgGame(rawgGame: RawgGame) {
  // =========================================================
  // AI tagging
  // =========================================================
  try {
    const tags = await generateGameTags(rawgGame);
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

  if (existingGame) {
    return existingGame;
  }

  const rawgGame = await fetchRawgGameDetails(rawgId);

  return saveRawgGame(rawgGame);
}

export const getGame = getGameByRawgId;
