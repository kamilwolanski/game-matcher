import { cn } from "@/lib/utils";
import { type ShortTag } from "@/lib/dto/tag.dto";

type Props = {
  index: number;
  tag: ShortTag;
  isActive: boolean;
  isSuggested?: boolean;
  expandedTags?: boolean;
  onToggle: (tag: ShortTag) => void;
};

export const TagButton = ({
  tag,
  isActive,
  isSuggested = false,
  expandedTags = false,
  onToggle,
}: Props) => {
  return (
    <button
      onClick={() => onToggle(tag)}
      className={cn(
        "relative px-2.5 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-smooth border",
        (expandedTags || isSuggested) ? "animate-tag-in" : '',
        isActive
          ? "gradient-primary border-border/40 text-primary-foreground shadow-[0_6px_16px_-8px_hsl(217_100%_62%/0.45)]"
          : "bg-transparent border-border text-foreground/80 hover:border-primary/50 hover:text-foreground hover:-translate-y-0.5",
  isSuggested && !isActive && "border-secondary/80 text-foreground animate-new-glow",
      )}
    >
      {tag.name}
      {isSuggested && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-secondary md:animate-pulse" />
      )}
    </button>
  );
};
