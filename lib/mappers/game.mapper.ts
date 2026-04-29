import type { Prisma } from "@/app/generated/prisma/client";
import type { GameDto } from "../dto/game.dto";

type GameWithRelations = Prisma.GameGetPayload<{
  include: {
    tags: {
      include: {
        tag: true;
      };
    };
  };
}>;

export const toGameDto = (game: GameWithRelations): GameDto => {
  return {
    ...game,
    tags: game.tags.map((t) => ({
      name: t.tag.name,
      slug: t.tag.slug,
    })),
  };
};
