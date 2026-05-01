"use client";

import { type GameMatchDto } from "@/lib/dto/game-match.dto";
import { GameCard, GameCardSkeleton } from "./GameCard";
import { RefObject } from "react";

const SKELETON_COUNT = 8;

type Props = {
  matchedGames: GameMatchDto[];
  isMatchingPending: boolean;
  resultsRef: RefObject<HTMLDivElement | null>
  onGameClick: (game: GameMatchDto) => void;
};

export function GameMatchResults({
  matchedGames,
  isMatchingPending,
  resultsRef,
  onGameClick,
}: Props) {
  if (!isMatchingPending && matchedGames.length === 0) return null;

  return (
    <section ref={resultsRef} className="pb-32 scroll-mt-8">
      {isMatchingPending ? (
        <MatchSkeleton />
      ) : (
        <MatchGrid games={matchedGames} onGameClick={onGameClick} />
      )}
    </section>
  );
}

function MatchSkeleton() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">
        Curating your matches...
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <GameCardSkeleton key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

type MatchGridProps = {
  games: GameMatchDto[];
  onGameClick: (game: GameMatchDto) => void;
};

function MatchGrid({ games, onGameClick }: MatchGridProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Your <span className="gradient-text">matches</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {games.length} games · ranked by how much they match your taste
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onClick={() => onGameClick(game)}
          />
        ))}
      </div>
    </div>
  );
}
