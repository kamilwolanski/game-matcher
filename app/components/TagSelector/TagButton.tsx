import { cn } from "@/lib/utils";
import { type ShortTag } from "@/lib/dto/tag.dto";

type Props = {
  index: number;
  tag: ShortTag;
  isActive: boolean;
  isSuggested?: boolean;
  onToggle: (tag: ShortTag) => void;
};

export const TagButton = ({
  tag,
  isActive,
  isSuggested = false,
  onToggle,
}: Props) => {
  return (
    <button
      onClick={() => onToggle(tag)}
      className={cn(
        "relative px-4 py-2 rounded-full text-sm font-medium transition-bounce border animate-tag-in",
        isActive
          ? "gradient-primary border-border/40 text-primary-foreground shadow-[0_4px_20px_-4px_var(--color-primary)]"
          : "bg-transparent border-border text-foreground/80 hover:border-primary/50 hover:text-foreground hover:-translate-y-0.5",
  isSuggested && !isActive && "border-secondary/80 text-foreground animate-new-glow",
      )}
    >
      {tag.name}
      {isSuggested && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-secondary animate-pulse" />
      )}
    </button>
  );
};
