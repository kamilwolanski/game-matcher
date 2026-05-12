import { ShortTag } from "@/lib/dto/tag.dto";
import { cn } from "@/lib/utils";
import { Check, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { TAGS_AS_OBJECT } from "@/consts/tags";

type Props = {
  tags: ShortTag[];
  onToggle: (tag: ShortTag) => void;
  activeSlugs: Set<string>;
};

const normalize = (s: string) =>
  s.toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();

function scoreTag(tag: ShortTag, query: string) {
  const q = normalize(query);

  if (!q) return -1;

  const name = normalize(tag.name);
  const slug = normalize(tag.slug);

  // exact
  if (name === q) return 1000;
  if (slug === q) return 950;

  // starts with
  if (name.startsWith(q)) return 800;
  if (slug.startsWith(q)) return 750;

  // word starts with
  if (name.split(" ").some((w) => w.startsWith(q))) return 600;

  // contains
  if (name.includes(q)) return 400;
  if (slug.includes(q)) return 350;

  // fuzzy subsequence match
  let qi = 0;

  for (let i = 0; i < name.length; i++) {
    if (name[i] === q[qi]) {
      qi++;
    }

    if (qi === q.length) {
      return 200;
    }
  }

  return -1;
}

const TagSearch = ({ tags, activeSlugs, onToggle }: Props) => {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const results = useMemo<ShortTag[]>(() => {
    const q = normalize(query);

    if (!q) return [];

    return tags
      .map((tag) => ({
        tag,
        score: scoreTag(tag, q),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => {
        // najpierw score
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        // potem popularność
        return b.tag.gamesCount - a.tag.gamesCount;
      })
      .slice(0, 30)
      .map((x) => x.tag);
  }, [query, tags]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHighlightIdx(0);
  }, [query]);

  useEffect(() => {
    itemRefs.current[highlightIdx]?.scrollIntoView({
      block: "nearest",
    });
  }, [highlightIdx]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!searchWrapRef.current?.contains(e.target as Node))
        setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const renderHighlighted = (text: string, q: string) => {
    if (!q) return text;

    const idx = text.toLowerCase().indexOf(q.toLowerCase());

    if (idx < 0) return text;

    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-transparent text-secondary font-semibold">
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div ref={searchWrapRef} className="relative">
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-card/40 transition-smooth",
          searchOpen && query
            ? "border-primary/50 shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]"
            : "border-border hover:border-primary/40",
        )}
      >
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightIdx((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightIdx((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && results[highlightIdx]) {
              e.preventDefault();
              onToggle(results[highlightIdx]);
            } else if (e.key === "Escape") {
              setQuery("");
              setSearchOpen(false);
            }
          }}
          placeholder="Search all tags..."
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setSearchOpen(false);
            }}
            className="text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {searchOpen && query && (
        <div className="absolute z-30 left-0 right-0 mt-2 rounded-xl border border-border bg-popover/95 backdrop-blur-sm shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.4)] overflow-hidden animate-fade-in">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-sm text-muted-foreground text-center">
              No tags match &quot;{query}&quot;
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r, i) => {
                const isActive = activeSlugs.has(r.slug);
                const tagSection = TAGS_AS_OBJECT[r.slug].section;
                const isHi = i === highlightIdx;
                return (
                  <li key={r.slug}>
                    <button
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      onMouseEnter={() => setHighlightIdx(i)}
                      onClick={() => onToggle(r)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-smooth",
                        isHi ? "bg-primary/10" : "hover:bg-primary/5",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                          isActive
                            ? "gradient-primary border-transparent text-primary-foreground"
                            : "border-border bg-background/40",
                        )}
                      >
                        {isActive && <Check className="h-3 w-3" />}
                      </span>
                      <span className="flex-1 text-sm font-medium">
                        {renderHighlighted(r.name, query)}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {tagSection}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSearch;
