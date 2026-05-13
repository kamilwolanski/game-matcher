import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type ShortTag } from "@/lib/dto/tag.dto";
import { TagButton } from "./TagButton";
import { STATUS_PHRASES } from "./constants";

type Props = {
  suggestedTags: ShortTag[];
  activeSlugs: Set<string>;
  isAnalyzing: boolean;
  onToggle: (tag: ShortTag) => void;
};

export const SuggestedPanel = ({
  suggestedTags,
  activeSlugs,
  isAnalyzing,
  onToggle,
}: Props) => {
  const [statusText, setStatusText] = useState<string | null>(null);
  const [shimmerKey, setShimmerKey] = useState(0);
  const phraseIdxRef = useRef(0);

  useEffect(() => {
    if (suggestedTags.length === 0) return;

    const phrase = STATUS_PHRASES[phraseIdxRef.current % STATUS_PHRASES.length];
    phraseIdxRef.current += 1;
    setStatusText(phrase);
    setShimmerKey((k) => k + 1);

    const timer = window.setTimeout(() => setStatusText(null), 2200);
    return () => window.clearTimeout(timer);
  }, [suggestedTags]);


  if (isAnalyzing) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-secondary/25 bg-secondary/4 p-3.5 md:p-5 space-y-3 animate-fade-in">
        <div className="flex items-start sm:items-center gap-2 text-sm font-semibold">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary/80">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </span>
          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="leading-tight">Suggested from your picks</span>
            <span className="hidden sm:inline text-xs font-normal text-muted-foreground">
              · reading your latest pick
            </span>
            <span className="sm:hidden text-[11px] font-normal text-muted-foreground mt-0.5">
              reading your latest pick
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-2.5" aria-hidden>
          {[72, 56, 88, 64, 80, 60, 96].map((w, i) => (
            <div
              key={i}
              className="h-7 sm:h-8 rounded-full bg-secondary/10 animate-pulse"
              style={{ width: `${w}px`, animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }
  if (!isAnalyzing && suggestedTags.length > 0)
    return (
      <div className="relative overflow-hidden rounded-2xl border border-secondary/30 bg-secondary/5 p-4 md:p-5 space-y-3 animate-fade-in">
        <div
          key={shimmerKey}
          aria-hidden
          className="mb-0 pointer-events-none absolute inset-0 z-0 animate-shimmer-sweep bg-[linear-gradient(110deg,transparent_30%,color-mix(in_srgb,var(--color-secondary)_18%,transparent)_50%,transparent_70%)]"
        />
        <div className="hidden md:flex  items-center gap-2 text-sm font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
            <Sparkles className="h-4 w-4" />
          </span>
          Suggested from your picks
          <span className="text-xs font-normal text-muted-foreground">
            · shared across your selected games
          </span>
          {statusText && (
            <span
              key={statusText + shimmerKey}
              className="ml-auto text-[11px] font-normal text-secondary/90 animate-fade-in"
              style={{
                animation:
                  "fade-in 0.4s ease-out, fade-in 0.4s ease-out 1.6s reverse both",
              }}
            >
              {statusText}
            </span>
          )}
        </div>
        <div className="flex flex-col md:hidden gap-2 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
              <Sparkles className="h-4 w-4" />
            </span>
            Suggested from your picks
          </div>
          <span className="text-xs font-normal text-muted-foreground">
            shared across your selected games
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {suggestedTags.map((tag, idx) => (
            <TagButton
              key={tag.slug}
              index={idx}
              tag={tag}
              isActive={activeSlugs.has(tag.slug)}
              isSuggested={true}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>
    );
};
