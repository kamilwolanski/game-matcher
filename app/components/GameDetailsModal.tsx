import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/Dialog";
import { GameMatchDto } from "@/lib/dto/game-match.dto";
import { cn } from "@/lib/utils";
import { Sparkles, X } from "lucide-react";
import Image from "next/image";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  game: GameMatchDto | null;
};

export const PLATFORM_SHORT_NAMES: Record<string, string> = {
  // PlayStation
  "PlayStation 5": "PS5",
  "PlayStation 4": "PS4",
  "PlayStation 3": "PS3",
  "PS Vita": "Vita",

  // Xbox
  "Xbox Series S/X": "XSX",
  "Xbox One": "XONE",
  "Xbox 360": "X360",

  // Nintendo
  "Nintendo Switch": "Switch",
  "Nintendo 3DS": "3DS",
  "Wii U": "Wii U",

  // Desktop
  PC: "PC",
  macOS: "Mac",
  Linux: "Linux",

  // Mobile
  iOS: "iOS",
  Android: "Android",
};

export function formatPlatforms(platforms: string[]) {
  return platforms
    .map((platform) => PLATFORM_SHORT_NAMES[platform] ?? platform)
    .join(" · ");
}

const MIN_WORDS_FOR_SINGLE_PARAGRAPH = 40;

function compactDescription(description: string | null): string {
  if (!description) {
    return "No description is available for this game yet.";
  }

  const paragraphs = description
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const usefulParagraphs = paragraphs.filter(
    (paragraph) => !paragraph.startsWith("###"),
  );

  if (usefulParagraphs.length === 0) {
    return "No description is available for this game yet.";
  }

  const firstParagraph = usefulParagraphs[0];
  const secondParagraph = usefulParagraphs[1];

  const firstParagraphWordCount = firstParagraph
    .split(/\s+/)
    .filter(Boolean).length;

  // show second paragraph only if first one is short
  if (
    firstParagraphWordCount < MIN_WORDS_FOR_SINGLE_PARAGRAPH &&
    secondParagraph
  ) {
    return `${firstParagraph}\n\n${secondParagraph}`;
  }

  return firstParagraph;
}

export const GameDetailsModal = ({ open, onOpenChange, game }: Props) => {
  if (!game) return null;

  const releasedYear = game.released
    ? new Date(game.released).getFullYear()
    : null;

  const image = game.image ?? "/logo-transparent.png";
  const description = compactDescription(game.description);

  const metacritic = game.metacritic;
  const metaColor = !metacritic
    ? ""
    : metacritic >= 85
      ? "text-emerald-400"
      : metacritic >= 70
        ? "text-amber-400"
        : "text-red-400";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,760px)] w-[calc(100vw-2rem)] max-w-3xl gap-0 overflow-hidden rounded-3xl border-border bg-card p-0 ">
        <DialogTitle className="sr-only">{game.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Match details and shared traits for {game.name}.
        </DialogDescription>

        <div className="relative h-64 md:h-80">
          <div className="relative h-64 md:h-80">
            <Image
              src={image}
              alt={game.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-t from-card via-card/70 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-card/60 via-transparent to-transparent" />
          </div>

          <button
            onClick={() => onOpenChange(false)}
            className="glass absolute right-4 top-4 rounded-full p-2 transition-smooth hover:bg-destructive/20 hover:text-destructive"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="absolute bottom-8 left-4 right-4 md:bottom-5 md:left-6 md:right-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                  {game.name}
                </h2>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-muted-foreground">
                  {releasedYear && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-foreground/90">
                      {releasedYear}
                    </span>
                  )}

                  <span>{formatPlatforms(game.platforms)}</span>
                </p>
                {metacritic && (
                  <p className="text-xs md:text-sm text-muted-foreground mt-1.5 inline-flex items-baseline gap-1.5">
                    <span className="uppercase tracking-wider text-[10px] text-muted-foreground/80">
                      Metacritic
                    </span>
                    <span
                      className={cn("font-semibold tabular-nums", metaColor)}
                    >
                      {metacritic}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-full glass">
                <span className="gradient-text text-xl font-bold leading-none">
                  {(game.similarity * 100).toFixed()}%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  match
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(min(90vh,760px)-16rem)] space-y-6 overflow-y-auto p-5 pt-0 md:max-h-[calc(min(90vh,760px)-20rem)] md:p-8 md:pt-4">
          <p className="text-sm md:text-base whitespace-pre-line leading-relaxed text-foreground/90">
            {description}
          </p>

          {game.matchReason.tags.length > 0 && (
            <div className="rounded-2xl border border-secondary/40 bg-linear-to-br from-primary/10 via-card to-secondary/10 p-5 shadow-[0_8px_30px_-12px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-secondary" />
                <h3 className="text-sm md:text-base font-semibold">Why this game?</h3>
              </div>
              <p className="mb-4 text-xs md:text-sm text-muted-foreground">
                {game.matchReason.title}
              </p>
              <div className="flex flex-wrap gap-2">
                {game.matchReason.tags.map((tag) => (
                  <span
                    key={tag.slug}
                    className="gradient-primary rounded-full px-2.5 py-1 text-[11px] md:px-3 md:py-1.5 md:text-xs font-medium text-primary-foreground"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              All tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] md:px-3 md:py-1 md:text-xs text-foreground/80"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
