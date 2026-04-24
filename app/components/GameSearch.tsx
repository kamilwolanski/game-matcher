"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { SearchGameResult } from "../api/search/route";
import { cn } from "@/lib/utils";
import useDebounce from "../hooks/useDebounce";

type Props = {
  selected: SearchGameResult[];
  onAdd: (g: SearchGameResult) => void;
  onRemove: (id: number) => void;
};

export const GameSearch = ({ selected, onAdd, onRemove }: Props) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchGameResult[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Search request failed");
        return res.json() as Promise<{ results?: SearchGameResult[] }>;
      })
      .then((data) => {
        setResults(data.results ?? []);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setResults([]);
        console.error(err);
      });

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
        {/* INPUT */}
        <div className="flex items-center gap-3 px-5 py-4">
          <Search
            className={cn(
              "h-5 w-5 shrink-0 transition-colors",
              query ? "text-primary/80" : "text-muted-foreground",
            )}
          />

          <input
            type="text"
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
            placeholder="Search for games you like..."
            className="flex-1 bg-transparent text-base md:text-lg outline-none placeholder:text-muted-foreground"
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
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        )}

        {/* DROPDOWN */}
        {open && results.length > 0 && (
          <div className="animate-slide-down">
            <ul className="max-h-80 overflow-y-auto">
              {results.map((g) => (
                <li key={g.rawgId}>
                  <button
                    onClick={() => {
                      onAdd(g);
                      setQuery("");
                      setResults([]);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-4 px-5 py-3 text-left cursor-pointer transition-smooth hover:bg-primary/10"
                  >
                    {g.image ? (
                      <img
                        src={g.image}
                        alt={g.name}
                        className="w-12 h-16 object-cover rounded-md shrink-0"
                        loading="lazy"
                      />
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
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* SELECTED */}
      {selected.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-3 animate-fade-in">
          {selected.map((g) => (
            <div
              key={g.rawgId}
              className="group flex items-center gap-3 pr-2 pl-2 py-2 rounded-2xl bg-surface-elevated border border-border hover:border-primary/40 transition-smooth"
            >
              {g.image ? (
                <img
                  src={g.image}
                  alt={g.name}
                  className="w-9 h-12 object-cover rounded-lg"
                  loading="lazy"
                />
              ) : (
                <div className="w-9 h-12 rounded-lg bg-background border border-border" />
              )}
              <span className="text-sm font-medium pr-1 max-w-[160px] truncate">
                {g.name}
              </span>
              <button
                onClick={() => onRemove(g.rawgId)}
                className="p-1.5 rounded-full hover:bg-destructive/20 hover:text-destructive transition-smooth"
                aria-label={`Remove ${g.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
