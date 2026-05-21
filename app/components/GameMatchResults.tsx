"use client";

import { type GameMatchDto } from "@/lib/dto/game-match.dto";
import { GameCard, GameCardSkeleton } from "./GameCard";
import { RefObject, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CalendarPlus,
  Check,
  ChevronDown,
  Compass,
  Sparkles,
  Star,
} from "lucide-react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

const SKELETON_COUNT = 8;

type Props = {
  matchedGames: GameMatchDto[];
  isMatchingPending: boolean;
  resultsRef: RefObject<HTMLDivElement | null>;
  onGameClick: (game: GameMatchDto) => void;
};

const PAGE_SIZE = 20;
const STRONG_THRESHOLD = 0.5;

type SortMode = "match" | "newest" | "oldest" | "rated";

const SORT_OPTIONS: {
  id: SortMode;
  label: string;
  hint: string;
  Icon: typeof Sparkles;
}[] = [
  {
    id: "match",
    label: "Best Match",
    hint: "Ranked by similarity to your taste",
    Icon: Sparkles,
  },
  {
    id: "newest",
    label: "Newest first",
    hint: "Newest among your matches",
    Icon: CalendarPlus,
  },
  {
    id: "oldest",
    label: "Oldest first",
    hint: "Classics among your matches",
    Icon: CalendarClock,
  },
  {
    id: "rated",
    label: "Top rated",
    hint: "Highest-rated of your matches",
    Icon: Star,
  },
];

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

  const [sort, setSort] = useState<SortMode>("match");
  const [sortOpen, setSortOpen] = useState(false);
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
  const sortedGames = useMemo(() => {
    if (sort === "newest") {
      return matchedGames
        .slice()
        .sort(
          (a, b) =>
            (getReleaseTime(b) ?? Number.NEGATIVE_INFINITY) -
            (getReleaseTime(a) ?? Number.NEGATIVE_INFINITY),
        );
    }

    if (sort === "oldest") {
      return matchedGames
        .slice()
        .sort(
          (a, b) =>
            (getReleaseTime(a) ?? Number.POSITIVE_INFINITY) -
            (getReleaseTime(b) ?? Number.POSITIVE_INFINITY),
        );
    }

    if (sort === "rated") {
      return matchedGames
        .slice()
        .sort(
          (a, b) =>
            (b.rating ?? 0) - (a.rating ?? 0) || b.similarity - a.similarity,
        );
    }

    return matchedGames;
  }, [matchedGames, sort]);
  const activeSort = SORT_OPTIONS.find((o) => o.id === sort) ?? SORT_OPTIONS[0];
  const ActiveSortIcon = activeSort.Icon;
  const resultDescription =
    sort === "match"
      ? strong.length === 0
        ? "No strong matches found. Try exploring broader matches below."
        : `${strong.length} strong match${strong.length === 1 ? "" : "es"} · ranked by how much they match your taste`
      : `${matchedGames.length} match${matchedGames.length === 1 ? "" : "es"} ${" · "}`;
  // reset after click find
  useEffect(() => {
    if (isMatchingPending) {
      setVisibleStrong(Math.min(strong.length, PAGE_SIZE));
      setVisibleBroader(Math.min(broader.length, PAGE_SIZE));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowBroader(false);
      setSort("match");
      setSortOpen(false);
    }
  }, [
    broader.length,
    isMatchingPending,
    setVisibleBroader,
    setVisibleStrong,
    strong.length,
  ]);

  const handleSortChange = (nextSort: SortMode) => {
    setSort(nextSort);
    setSortOpen(false);
  };

  if (!isMatchingPending && matchedGames.length === 0) return null;

  return (
    <section className="pb-32 scroll-mt-8 mt-10 md:mt-0">
      <div className="space-y-10 animate-fade-in">
        {isMatchingPending ? (
          <MatchSkeleton />
        ) : (
          <>
            <div ref={resultsRef}>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-end justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      Personalized for <span className="gradient-text">you</span>
                    </h2>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {resultDescription}
                        {sort !== "match" && (
                          <span className="inline-flex items-center gap-1 text-foreground/80">
                            reordered by <ActiveSortIcon className="h-3 w-3" />
                            {activeSort.label.toLowerCase()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center gap-2 flex-wrap sm:w-auto">
                  <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "group inline-flex items-center gap-2 h-8 pl-2 pr-1.5 md:h-9 md:pl-2.5 md:pr-2 rounded-xl text-xs font-medium transition-smooth",
                          "max-w-full min-w-0 border border-transparent",
                          sort === "match"
                            ? "bg-linear-to-r from-primary/15 via-secondary/10 to-transparent text-foreground border-primary/30 shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-primary)_15%,transparent),0_8px_24px_-12px_color-mix(in_srgb,var(--color-primary)_60%,transparent)]"
                            : "bg-muted/40 hover:bg-muted/60 text-foreground border-border/60",
                        )}
                        aria-label="Sort results"
                      >
                        <span
                          className={cn(
                            "inline-flex items-center justify-center h-6 w-6 rounded-lg",
                            sort === "match"
                              ? "gradient-primary text-primary-foreground shadow-[0_4px_12px_-4px_color-mix(in_srgb,var(--color-primary)_70%,transparent)]"
                              : "bg-background/60 text-muted-foreground",
                          )}
                        >
                          <ActiveSortIcon className="h-3.5 w-3.5" />
                        </span>
                        <span className="hidden sm:inline text-muted-foreground">
                          Sort by
                        </span>
                        <span className="min-w-0 truncate font-medium text-[11px] sm:text-xs">
                          {activeSort.label}
                        </span>

                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
                            sortOpen && "rotate-180",
                          )}
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={8}
                      collisionPadding={12}
                      className="w-[calc(100vw-1.5rem)] max-w-72 p-1.5 rounded-xl border-border/70 bg-popover/95 backdrop-blur-md shadow-[0_20px_50px_-20px_color-mix(in_srgb,var(--color-primary)_40%,transparent)] sm:w-72"
                    >
                      <div className="px-2.5 pt-1.5 pb-1.5">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
                          Reorder your matches
                        </div>
                        <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                          Personalization stays on - only the order changes.
                        </div>
                      </div>
                      {SORT_OPTIONS.map((opt) => {
                        const Icon = opt.Icon;
                        const selected = sort === opt.id;
                        const isSmart = opt.id === "match";
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSortChange(opt.id)}
                            className={cn(
                              "w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-smooth",
                              selected ? "bg-muted/70" : "hover:bg-muted/50",
                            )}
                          >
                            <span
                              className={cn(
                                "inline-flex items-center justify-center h-7 w-7 rounded-md shrink-0",
                                isSmart
                                  ? "gradient-primary text-primary-foreground"
                                  : "bg-muted text-foreground/70",
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold">
                                  {opt.label}
                                </span>
                              </span>
                              <span className="block text-[11px] leading-snug text-muted-foreground sm:truncate">
                                {opt.hint}
                              </span>
                            </span>
                            {selected && (
                              <Check className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <MatchGrid
                  games={sort === "match" ? visibleStrongGames : sortedGames}
                  onGameClick={onGameClick}
                />
              </div>
            </div>
            {sort === "match" && hasMoreStrong && (
              <div
                ref={setSentinelEl}
                className="mt-30 flex items-center justify-center py-6"
              ></div>
            )}
            {sort === "match" && broader.length > 0 && !hasMoreStrong && (
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
                    <div className="space-y-6">
                      <div className="flex items-end justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold">
                            Broader{" "}
                            <span className="gradient-text">discoveries</span>
                          </h3>

                          <p className="text-xs text-muted-foreground mt-1">
                            Less direct overlap, but worth a look.
                          </p>
                        </div>
                      </div>
                      <MatchGrid
                        games={visibleBroaderGames}
                        onGameClick={onGameClick}
                      />
                    </div>

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
  onGameClick: (game: GameMatchDto) => void;
};

function MatchGrid({ games, onGameClick }: MatchGridProps) {
  return (
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
  );
}

function getReleaseTime(game: GameMatchDto) {
  if (!game.released) return null;

  const time =
    game.released instanceof Date
      ? game.released.getTime()
      : new Date(game.released).getTime();

  return Number.isFinite(time) ? time : null;
}
