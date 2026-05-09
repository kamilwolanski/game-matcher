import { GameDto } from "@/lib/dto/game.dto";
import { SearchGameResult } from "@/lib/dto/search-game.dto";
import { ShortTag } from "@/lib/dto/tag.dto";

export type TagWithCount = ShortTag & {
  count: number;
};

type AnalyzingGame = {
  rawgId: number;
  status: "analyzing";
  data: SearchGameResult;
};

type ReadyGame = {
  rawgId: number;
  status: "ready";
  data: GameDto;
};

type FailedGame = {
  rawgId: number;
  status: "failed";
  data: SearchGameResult;
};

export type GameState = AnalyzingGame | ReadyGame | FailedGame;
