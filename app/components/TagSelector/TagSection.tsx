import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ShortTag } from "@/lib/dto/tag.dto";
import { TagButton } from "./TagButton";

type Props = {
  tags: ShortTag[];
  baseTags: ShortTag[];
  extraTags: ShortTag[];
  expanded: boolean;
  toggleExpanded: () => void;
  activeSlugs: Set<string>;
  suggestedSlugs?: Set<string>;
  onToggle: (tag: ShortTag) => void;
};

export const TagSection = ({
  tags,
  baseTags,
  extraTags,
  expanded,
  toggleExpanded,
  activeSlugs,
  suggestedSlugs = new Set<string>(),
  onToggle,
}: Props) => {
  if (tags.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-2.5">
        {baseTags.map((tag, idx) => (
          <TagButton
            key={tag.slug}
            index={idx}
            tag={tag}
            isActive={activeSlugs.has(tag.slug)}
            isSuggested={suggestedSlugs.has(tag.slug)}
            onToggle={onToggle}
          />
        ))}
        {expanded &&
          extraTags.map((tag, idx) => (
            <TagButton
              key={tag.slug}
              index={idx}
              tag={tag}
              isActive={activeSlugs.has(tag.slug)}
              isSuggested={suggestedSlugs.has(tag.slug)}
              onToggle={onToggle}
            />
          ))}
      </div>
      {extraTags.length > 0 && (
        <div className="pt-1">
          <button
            onClick={toggleExpanded}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth group"
          >
            <span>
              {expanded
                ? "Show fewer tags"
                : `Show more tags (+${extraTags.length})`}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300 group-hover:text-primary",
                expanded && "rotate-180",
              )}
            />
          </button>
        </div>
      )}
    </div>
  );
};
