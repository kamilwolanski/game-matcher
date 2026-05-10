import { GameMatchDto } from "@/lib/dto/game-match.dto";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  game: GameMatchDto;
  onClick: () => void;
  index?: number;
};

export const GameCard = ({ game, onClick, index = 0 }: Props) => {
  const image = game.image ?? "/logo-transparent.png";
  const releasedYear = game.released
    ? new Date(game.released).getFullYear()
    : null;
  const platforms = game.platforms.slice(0, 2).join(" / ");
  const description =
    game.description?.trim() || "No description is available yet.";
  const scoreColor =
    game.similarity >= 0.85
      ? "from-neon-blue to-neon-purple"
      : game.similarity >= 0.7
        ? "from-primary to-secondary"
        : "from-secondary/70 to-primary/70";

  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border gradient-card text-left",
        "transition-bounce hover:-translate-y-2 hover:border-secondary/50",
        "shadow-(--shadow-card) hover:shadow-(--shadow-card-hover)",
        "animate-fade-in-up opacity-0 fill-mode-forwards",
      )}
    >
      <div className="relative">
        <div className="aspect-3/4 overflow-hidden transition-bounce group-hover:scale-110">
          <Image
            src={image}
            alt={game.name}
            fill
            className="object-cover object-top  "
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/10 to-transparent " />
        </div>

        <div className="glass absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-xl">
          <span
            className={cn(
              "bg-linear-to-r bg-clip-text text-base font-bold text-transparent",
              scoreColor,
            )}
          >
            {(game.similarity * 100).toFixed()}%
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/90">
            match
          </span>
        </div>

        <div className="absolute -bottom-3.75 inset-0 flex flex-col justify-end bg-linear-to-t from-card via-card/95 to-transparent p-4 opacity-0 transition-smooth group-hover:opacity-100">
          <p className="mb-3 line-clamp-3 translate-y-2 text-sm text-foreground/90 transition-smooth group-hover:translate-y-0">
            {description}
          </p>
          <div className="gradient-primary inline-flex translate-y-2 items-center justify-center self-start rounded-full px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-smooth group-hover:translate-y-0">
            View details
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 ">
        <div>
          <h3 className="line-clamp-1 text-base font-bold leading-tight">
            {game.name}
          </h3>
          {(releasedYear || platforms) && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {[releasedYear, platforms].filter(Boolean).join(" / ")}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full bg-linear-to-r transition-smooth",
                scoreColor,
              )}
              style={{ width: `${game.similarity * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {game.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.slug}
              className="rounded-full border border-border/50 bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
};

export const GameCardSkeleton = ({ index = 0 }: { index?: number }) => (
  <div
    style={{ animationDelay: `${index * 60}ms` }}
    className="animate-fade-in overflow-hidden rounded-2xl border border-border gradient-card"
  >
    <div className="aspect-3/4 shimmer" />
    <div className="space-y-3 p-4">
      <div className="h-4 w-3/4 rounded shimmer" />
      <div className="h-1.5 w-full rounded-full shimmer" />
      <div className="flex gap-1.5">
        <div className="h-4 w-12 rounded-full shimmer" />
        <div className="h-4 w-16 rounded-full shimmer" />
      </div>
    </div>
  </div>
);
