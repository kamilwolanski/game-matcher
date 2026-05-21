import type { GameDto } from "./game.dto";
import type { ShortTag } from "./tag.dto";

export type GameMatchDto = Pick<
  GameDto,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "image"
  | "metacritic"
  | "rating"
  | "added"
  | "platforms"
  | "released"
  | "tags"
> & {
  similarity: number;
  matchReason: {
    title: string;
    tags: ShortTag[];
  };
};
