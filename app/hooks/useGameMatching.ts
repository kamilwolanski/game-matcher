import { RefObject, useEffect, useRef, useTransition } from "react";
import { findGames } from "../actions/findGames";
import { type GameDto } from "@/lib/dto/game.dto";
import { type GameMatchDto } from "@/lib/dto/game-match.dto";
import { type ShortTag } from "@/lib/dto/tag.dto";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

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
      const top =
        resultsRef.current.getBoundingClientRect().top +
        window.scrollY -
        (window.matchMedia("(max-width: 767px)").matches ? 20 : 56);

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth",
      });
    }
  }, [isMatchingPending, matchedGames.length]);

  const findMatches = () => {
    const startedAt = performance.now();
    const properties = {
      game_names: selectedGames.map((game) => game.name),
      game_count: selectedGames.length,
      tags: activeTags.map((tag) => tag.slug),
    };
    trackEvent("matching_started", properties);
    startMatchTransition(async () => {
      try {
        const result = await findGames(selectedGames, activeTags);
        setMatchedGames(result);
        trackEvent("matching_completed", {
          ...properties,
          result_count: result.length,
          strong_result_count: result.filter((game) => game.similarity >= 0.5).length,
          duration_ms: Math.round(performance.now() - startedAt),
        });
      } catch (err) {
        trackEvent("matching_failed", {
          ...properties,
          duration_ms: Math.round(performance.now() - startedAt),
        });
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
