import { RefObject, useEffect, useRef, useTransition } from "react";
import { findGames } from "../actions/findGames";
import { type GameDto } from "@/lib/dto/game.dto";
import { type GameMatchDto } from "@/lib/dto/game-match.dto";
import { type ShortTag } from "@/lib/dto/tag.dto";
import { useState } from "react";

export interface GameMatchingState {
  matchedGames: GameMatchDto[];
  isMatchingPending: boolean;
  resultsRef: RefObject<HTMLDivElement | null>;
  findMatches: () => void;
}

export function useGameMatching(
  selectedGames: GameDto[],
  activeTags: ShortTag[],
): GameMatchingState {
  const [matchedGames, setMatchedGames] = useState<GameMatchDto[]>([]);
  const [isMatchingPending, startMatchTransition] = useTransition();
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMatchingPending && matchedGames.length > 0 && resultsRef.current) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isMatchingPending, matchedGames.length]);

  const findMatches = () => {
    startMatchTransition(async () => {
      try {
        const result = await findGames(selectedGames, activeTags);
        setMatchedGames(result);
      } catch (err) {
        console.error("err", err);
      }
    });
  };

  return {
    matchedGames,
    isMatchingPending,
    resultsRef,
    findMatches,
  };
}
