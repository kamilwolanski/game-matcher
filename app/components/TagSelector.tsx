import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ShortTag } from "@/lib/dto/tag.dto";

type Props = {
  tags: ShortTag[];
  active: ShortTag[];
  suggested: ShortTag[];
  onToggle: (tag: ShortTag) => void;
};

type TagButtonProps = {
  tag: ShortTag;
  isActive: boolean;
  isSuggested?: boolean;
  onToggle: (tag: ShortTag) => void;
};

const TagButton = ({
  tag,
  isActive,
  isSuggested = false,
  onToggle,
}: TagButtonProps) => {
  return (
    <button
      onClick={() => onToggle(tag)}
      className={cn(
        "relative px-4 py-2 rounded-full text-sm font-medium transition-bounce border",
        isActive
          ? "gradient-primary text-primary-foreground border-transparent shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.6)]"
          : "bg-transparent border-border text-foreground/80 hover:border-primary/50 hover:text-foreground hover:-translate-y-0.5",
        isSuggested && !isActive && "border-secondary/40 text-foreground",
      )}
    >
      {tag.name}
      {isSuggested && !isActive && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-secondary animate-pulse" />
      )}
    </button>
  );
};

export const TagSelector = ({ tags, active, suggested, onToggle }: Props) => {
  const isTagActive = (tag: ShortTag) =>
    active.some((activeTag) => activeTag.slug === tag.slug);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl md:text-4xl font-bold">
          Refine your <span className="gradient-text">taste</span>
        </h2>

        {suggested.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
            <Sparkles className="h-4 w-4 text-secondary" />
            Suggested from your picks
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {suggested.map((tag) => (
          <TagButton
            key={tag.slug}
            tag={tag}
            isActive={isTagActive(tag)}
            isSuggested
            onToggle={onToggle}
          />
        ))}

        {tags.map((tag) => (
          <TagButton
            key={tag.slug}
            tag={tag}
            isActive={isTagActive(tag)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
};
