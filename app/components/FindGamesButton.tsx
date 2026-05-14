"use client";

import { Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  canSearch: boolean;
  isAnalyzing: boolean;
  isMatchingPending: boolean;
  onFind: () => void;
};

export function FindGamesButton({
  canSearch,
  isAnalyzing,
  isMatchingPending,
  onFind,
}: Props) {
  const getButtonText = () => {
    if (isMatchingPending) return "Finding matches...";
    if (isAnalyzing) return "Getting your picks ready...";
    return "Find Games";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={onFind}
        disabled={!canSearch || isMatchingPending}
        aria-busy={isMatchingPending}
        className={cn(
          "group relative inline-flex items-center gap-3 px-7 py-4 md:px-10 md:py-5 rounded-2xl font-bold text-base md:text-lg",
          "gradient-primary text-primary-foreground transition-bounce",
          "shadow-[0_10px_40px_-10px_var(--color-primary),0_10px_40px_-10px_hsl(var(--secondary)/0.5)]",
          "hover:scale-102 hover:shadow-[0_12px_32px_-12px_var(--color-primary),0_12px_32px_-12px_var(--color-secondary)]",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
          canSearch && !isMatchingPending && "animate-pulse-glow",
          isMatchingPending && "overflow-hidden",
        )}
      >
        {isMatchingPending && (
          <span className="absolute inset-0 match-button-sheen" />
        )}
        <Wand2
          className={cn(
            "relative h-5 w-5 transition-smooth",
            isMatchingPending && "animate-pulse",
          )}
        />
        <span className="relative">{getButtonText()}</span>
      </button>

      {isMatchingPending && <MatchLoading />}

      <p
        className={`text-xs text-muted-foreground ${!canSearch ? "visible" : "invisible"}`}
      >
        Pick a game or a tag to get started
      </p>
    </div>
  );
}

function MatchLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-4 w-full max-w-md animate-fade-in"
    >
      <div className="glass relative overflow-hidden rounded-2xl px-5 py-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent match-scan-line" />
        <div className="flex items-center gap-4">
          <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10">
            <span className="absolute h-12 w-12 rounded-full border border-secondary/40 match-orbit" />
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              Mapping shared traits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
