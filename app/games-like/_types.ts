import type { GameMatchDto } from "@/lib/dto/game-match.dto";

export type GameMatchWithReasons = GameMatchDto & {
  reasons: string[];
};

export type GameMatchColumn = {
  title: string;
  games: GameMatchDto[];
};
