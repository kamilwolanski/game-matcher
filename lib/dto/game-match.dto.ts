import type { GameDto } from "./game.dto";
import type { ShortTag } from "./tag.dto";

export type GameMatchDto = GameDto & {
  similarity: number;
  matchReason: {
    title: string;
    tags: ShortTag[];
  };
};
