"use client";

import { type GameMatchDto } from "@/lib/dto/game-match.dto";
import { GameCard, GameCardSkeleton } from "./GameCard";
import { JSX, ReactNode, RefObject, useEffect, useMemo, useState } from "react";
import { Compass } from "lucide-react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

const SKELETON_COUNT = 8;

type Props = {
  matchedGames: GameMatchDto[];
  isMatchingPending: boolean;
  resultsRef: RefObject<HTMLDivElement | null>;
  onGameClick: (game: GameMatchDto) => void;
};

const PAGE_SIZE = 20;
const STRONG_THRESHOLD = 0.5;

export function GameMatchResults({
  matchedGames,
  isMatchingPending,
  resultsRef,
  onGameClick,
}: Props) {
  const { strong, broader } = useMemo(() => {
    const strong = matchedGames.filter((r) => r.similarity >= STRONG_THRESHOLD);
    const broader = matchedGames.filter((r) => r.similarity < STRONG_THRESHOLD);
    return { strong, broader };
  }, [matchedGames]);

  const [showBroader, setShowBroader] = useState(false);

  const {
    visible: visibleStrong,
    hasMore: hasMoreStrong,
    setSentinelEl,
    setVisible: setVisibleStrong,
  } = useInfiniteScroll(strong.length, PAGE_SIZE);
  const {
    visible: visibleBroader,
    hasMore: hasMoreBroader,
    setSentinelEl: setSentinelBroaderEl,
    setVisible: setVisibleBroader,
  } = useInfiniteScroll(broader.length, PAGE_SIZE);

  const visibleStrongGames = strong.slice(0, visibleStrong);
  const visibleBroaderGames = broader.slice(0, visibleBroader);

  // reset after click find
  useEffect(() => {
    if (isMatchingPending) {
      setVisibleStrong(Math.min(strong.length, PAGE_SIZE));
      setVisibleBroader(Math.min(broader.length, PAGE_SIZE));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowBroader(false);
    }
  }, [
    broader.length,
    isMatchingPending,
    setVisibleBroader,
    setVisibleStrong,
    strong.length,
  ]);

  if (!isMatchingPending && matchedGames.length === 0) return null;

  return (
    <section className="pb-32 scroll-mt-8">
      <div className="space-y-10 animate-fade-in">
        {isMatchingPending ? (
          <MatchSkeleton />
        ) : (
          <>
            <div ref={resultsRef}>
              <MatchGrid
                title={
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Your <span className="gradient-text">matches</span>
                  </h2>
                }
                description={
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {strong.length === 0
                        ? "No strong matches found. Try exploring broader matches below."
                        : `${strong.length} strong match${strong.length === 1 ? "" : "es"} · ranked by how much they match your taste`}
                    </p>
                  </div>
                }
                games={visibleStrongGames}
                onGameClick={onGameClick}
              />
            </div>
            {hasMoreStrong && (
              <div
                ref={setSentinelEl}
                className="mt-30 flex items-center justify-center py-6"
              ></div>
            )}
            {broader.length > 0 && !hasMoreStrong && (
              <div className="space-y-6">
                <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
                {!showBroader ? (
                  <div className="flex flex-col items-center gap-3 text-center animate-fade-in">
                    <button
                      onClick={() => setShowBroader(true)}
                      className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm text-primary-foreground gradient-primary transition-bounce 
                      shadow-[0_10px_30px_-10px_color-mix(in_srgb,var(--color-primary),transparent_30%),0_10px_30px_-10px_color-mix(in_srgb,var(--color-secondary),transparent_50%)] 
                      hover:scale-105 
                      hover:shadow-[0_18px_44px_-12px_color-mix(in_srgb,var(--color-primary),transparent_15%),0_18px_44px_-12px_color-mix(in_srgb,var(--color-secondary),transparent_30%)]"
                    >
                      <Compass className="h-4 w-4 transition-smooth group-hover:rotate-12" />
                      Try less obvious matches
                      <span className="inline-flex items-center justify-center min-w-6 h-5 px-1.5 rounded-full bg-primary-foreground/20 text-[11px] font-bold">
                        +{broader.length}
                      </span>
                    </button>
                    <div className="max-w-75">
                      <p className="text-xs text-muted-foreground ">
                        These games are less closely matched to your picks, but
                        may still surprise you.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <MatchGrid
                      title={
                        <h3 className="text-lg md:text-xl font-bold">
                          Broader{" "}
                          <span className="gradient-text">discoveries</span>
                        </h3>
                      }
                      description={
                        <p className="text-xs text-muted-foreground mt-1">
                          Less direct overlap, but worth a look.
                        </p>
                      }
                      games={visibleBroaderGames}
                      onGameClick={onGameClick}
                    />
                    {hasMoreBroader && (
                      <div
                        ref={setSentinelBroaderEl}
                        className="mt-30 flex items-center justify-center py-6"
                      ></div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
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
  title: ReactNode;
  description: JSX.Element;
  onGameClick: (game: GameMatchDto) => void;
};

function MatchGrid({ title, description, games, onGameClick }: MatchGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          {title}
          {description}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {games.map((game, index) => (
          <GameCard
            key={game.id}
            game={game}
            index={index % PAGE_SIZE}
            onClick={() => onGameClick(game)}
          />
        ))}
      </div>
    </div>
  );
}
