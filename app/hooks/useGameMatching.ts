import { RefObject, useEffect, useRef, useTransition } from "react";
import { findGames } from "../actions/findGames";
import { type GameDto } from "@/lib/dto/game.dto";
import { type GameMatchDto } from "@/lib/dto/game-match.dto";
import { type ShortTag } from "@/lib/dto/tag.dto";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { type MatchFeedbackContext } from "@/lib/match-feedback";

export interface GameMatchingState {
  matchedGames: GameMatchDto[];
  feedbackContext: MatchFeedbackContext | null;
  isMatchingPending: boolean;
  resultsRef: RefObject<HTMLDivElement | null>;
  findMatches: () => void;
}

export function useGameMatching(
  selectedGames: GameDto[],
  activeTags: ShortTag[],
): GameMatchingState {
  const [matchedGames, setMatchedGames] = useState<GameMatchDto[]>([]);
  const [feedbackContext, setFeedbackContext] = useState<MatchFeedbackContext | null>(null);
  const [isMatchingPending, startMatchTransition] = useTransition();
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMatchingPending && feedbackContext && resultsRef.current) {
      const top =
        resultsRef.current.getBoundingClientRect().top +
        window.scrollY -
        (window.matchMedia("(max-width: 767px)").matches ? 20 : 56);

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth",
      });
    }
  }, [isMatchingPending, matchedGames.length, feedbackContext]);

  const findMatches = () => {
    setFeedbackContext(null);
    const startedAt = performance.now();
    const properties = {
      match_id: crypto.randomUUID(),
      game_names: selectedGames.map((game) => game.name),
      game_count: selectedGames.length,
      tags: activeTags.map((tag) => tag.slug),
    };
    trackEvent("matching_started", properties);
    startMatchTransition(async () => {
      try {
        const result = await findGames(selectedGames, activeTags);
        setMatchedGames(result);
        const context = {
          ...properties,
          result_count: result.length,
          strong_result_count: result.filter((game) => game.similarity >= 0.5).length,
        };
        setFeedbackContext(context);
        trackEvent("matching_completed", {
          ...context,
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
    feedbackContext,
    isMatchingPending,
    resultsRef,
    findMatches,
  };
}
