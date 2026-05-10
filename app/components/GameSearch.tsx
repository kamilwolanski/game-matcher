"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Info, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useDebounce from "../hooks/useDebounce";
import type { SearchGameResult } from "@/lib/dto/search-game.dto";
import Image from "next/image";
import { GameState } from "../hooks/useGameSelection/useGameSelection.types";
import { MAX_GAMES } from "../hooks/useGameSelection/useGameSelection";

type Props = {
  pickedGames: GameState[];
  atLimit: boolean;
  onAdd: (g: SearchGameResult) => void;
  onRetry: (g: SearchGameResult) => void;
  onRemove: (id: number) => void;
};

const ANALYZING_PHRASES = [
  "Analyzing gameplay...",
  "Understanding the game's mechanics...",
  "Mapping its vibe...",
  "Reading the room...",
];

const AnalyzingPhrase = ({ seed }: { seed: number }) => {
  const [idx, setIdx] = useState(seed % ANALYZING_PHRASES.length);
  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % ANALYZING_PHRASES.length),
      1800,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <span
      key={idx}
      className="text-[11px] text-muted-foreground animate-fade-in"
    >
      {ANALYZING_PHRASES[idx]}
    </span>
  );
};

export const GameSearch = ({
  pickedGames,
  atLimit,
  onAdd,
  onRemove,
  onRetry,
}: Props) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<SearchGameResult[]>([]);
  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (!trimmedQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setHasSearched(false);
      return;
    }

    const controller = new AbortController();

    const search = async () => {
      try {
        setIsSearching(true);
        setHasSearched(false);
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}`,
          {
            signal: controller.signal,
          },
        );

        if (!res.ok) {
          throw new Error("Search request failed");
        }

        const data = (await res.json()) as {
          results?: SearchGameResult[];
        };

        setResults(data.results ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        console.error(err);
        setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
          setHasSearched(true);
        }
      }
    };

    search();

    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className={cn(
          "glass rounded-2xl overflow-hidden transition-smooth",
          open && results.length > 0 && "shadow-2xl",
        )}
      >
        <div className="flex items-center gap-3 px-5 py-4">
          <Search
            className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              query ? "text-primary/80" : "text-muted-foreground",
            )}
          />

          <input
            type="text"
            disabled={atLimit}
            value={query}
            onFocus={() => setOpen(query.trim().length > 0)}
            onChange={(e) => {
              const nextQuery = e.target.value;

              setQuery(nextQuery);
              setOpen(nextQuery.trim().length > 0);

              if (!nextQuery.trim()) {
                setResults([]);
              }
            }}
            placeholder={
              atLimit
                ? `You've picked the max of ${MAX_GAMES} games`
                : "Search for games you like..."
            }
            className="flex-1 bg-transparent text-base md:text-lg outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setOpen(false);
              }}
              className="text-muted-foreground hover:text-primary/80 transition-smooth"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* DIVIDER */}
        {open && results.length > 0 && (
          <div className="h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        )}

        {/* DROPDOWN */}
        {open && (
          <div className="animate-slide-down">
            {isSearching ? (
              <ul className="py-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 px-5 py-3 animate-pulse"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="w-12 h-16 rounded-md bg-surface-elevated shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-2/3 rounded bg-surface-elevated" />
                      <div className="h-3 w-1/4 rounded bg-surface-elevated/70" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : hasSearched && results.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm text-muted-foreground">
                No games found for {query}
              </div>
            ) : (
              <ul className="max-h-80 overflow-y-auto">
                {results.map((g) => {
                  const isSelected = pickedGames.some(
                    (pg) => pg.rawgId === g.rawgId,
                  );
                  return (
                    <li key={g.rawgId}>
                      <button
                        onClick={() => {
                          onAdd(g);
                          setQuery("");
                          setResults([]);
                          setOpen(false);
                        }}
                        disabled={isSelected}
                        className={cn(
                          "w-full flex items-center gap-4 px-5 py-3 text-left cursor-pointer transition-smooth hover:bg-primary/10",
                          isSelected &&
                            "cursor-default opacity-50 hover:bg-transparent",
                        )}
                      >
                        {g.image ? (
                          <div className="relative w-12 h-16 shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={g.image}
                              alt={g.name}
                              fill
                              sizes="300px"
                              quality={100}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-16 rounded-md shrink-0 bg-surface-elevated border border-border" />
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate">{g.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {g.releasedYear}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {atLimit && (
        <div className="mt-2 flex items-center gap-2 text-xs text-secondary animate-fade-in">
          <Info className="h-3.5 w-3.5" />
          You&apos;ve reached the max of {MAX_GAMES} games. Remove one to add
          another.
        </div>
      )}

      {/* SELECTED */}
      {pickedGames.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-3 animate-fade-in">
          {pickedGames.map((pg, idx) => {
            const { image, name } = pg.data;
            const status = pg.status;
            return (
              <div
                key={pg.rawgId}
                className={cn(
                  "group flex items-center gap-3 pr-2 pl-2 py-2 rounded-2xl bg-surface-elevated border border-border hover:border-primary/40 transition-smooth",
                  status === "analyzing" &&
                    "bg-surface-elevated border-primary/30 shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]",
                  status === "ready" &&
                    "bg-surface-elevated border-border hover:border-primary/40",
                  status === "failed" &&
                    "bg-surface-elevated border-destructive/40",
                )}
              >
                {image ? (
                  <div className="relative w-9 h-12 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes="300px"
                      quality={90}
                      className={cn(
                        "object-cover",
                        status === "analyzing" && "opacity-70",
                      )}
                    />
                    {status === "analyzing" && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/30 backdrop-blur-[1px]">
                        <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-9 h-12 rounded-lg bg-background border border-border" />
                )}
                <div className="relative flex flex-col min-w-0 max-w-50 pr-1">
                  <span className="text-sm font-medium pr-1 max-w-40 truncate">
                    {name}
                  </span>

                  <div className="flex items-center gap-1.5 leading-none">
                    {status === "analyzing" && <AnalyzingPhrase seed={idx} />}
                    {status === "ready" && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-secondary">
                        <Check className="h-3 w-3" />
                        Ready
                      </span>
                    )}
                    {status === "failed" && (
                      <button
                        onClick={() => onRetry(pg.data)}
                        className="inline-flex items-center gap-1 text-[11px] text-destructive hover:underline"
                      >
                        <AlertCircle className="h-3 w-3" />
                        Couldn&apos;t read this one — retry
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onRemove(pg.rawgId)}
                  className="p-1.5 rounded-full hover:bg-destructive/20 hover:text-destructive transition-smooth"
                  aria-label={`Remove ${name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
