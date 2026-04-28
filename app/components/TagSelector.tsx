import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tag } from "../generated/prisma/browser";
import { ShortTag } from "@/lib/getRandomTags";

type Props = {
  tags: ShortTag[]; // wszystkie dostępne tagi
  active: ShortTag[]; // aktualnie wybrane tagi
//   suggested: ShortTag[]; // sugerowane tagi (np. na podstawie wybranych gier)
  onToggle: (tag: ShortTag) => void;
};

export const TagSelector = ({ tags, active, onToggle }: Props) => {
//   const suggestedSet = new Set(suggested);
//   const ordered = [
//     ...suggested,
//     ...ALL_TAGS.filter((t) => !suggestedSet.has(t)),
//   ];

  return (
    <div className="space-y-4"> 
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl md:text-4xl font-bold">
          Refine your <span className="gradient-text">taste</span>
        </h2>
        {/* {suggested.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
            <Sparkles className="h-4 w-4 text-secondary" />
            Suggested from your picks
          </div>
        )} */}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {tags.map((tag) => {
          const isActive = active.includes(tag);
        //   const isSuggested = suggestedSet.has(tag);
          return (
            <button
              key={tag.slug}
              onClick={() => onToggle(tag)}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium transition-bounce border",
                isActive
                  ? "gradient-primary text-primary-foreground border-transparent shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.6)]"
                  : "bg-transparent border-border text-foreground/80 hover:border-primary/50 hover:text-foreground hover:-translate-y-0.5",
                // !isActive &&
                //   isSuggested &&
                //   "border-secondary/40 text-foreground",
              )}
            >
              {tag.name}
                {/* {isSuggested && !isActive && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-secondary animate-pulse" />
                )} */}
            </button>
          );
        })}
      </div>
    </div>
  );
};
