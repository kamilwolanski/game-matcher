import {
  Gamepad2,
  Palette,
  SlidersHorizontal,
  Sparkles,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ShortTag } from "@/lib/dto/tag.dto";
import {
  BASE_TAG_SECTIONS,
  groupBaseTagsBySection,
  type BaseTagSection,
} from "@/consts/base-tags";

type Props = {
  tags: ShortTag[];
  activeSection: BaseTagSection;
  active: ShortTag[];
  suggested: ShortTag[];
  onSectionChange: (section: BaseTagSection) => void;
  onToggle: (tag: ShortTag) => void;
};

type SectionConfig = {
  label: string;
  icon: LucideIcon;
};

type TagButtonProps = {
  tag: ShortTag;
  isActive: boolean;
  isSuggested?: boolean;
  onToggle: (tag: ShortTag) => void;
};

type TagSectionProps = {
  tags: ShortTag[];
  activeSlugs: Set<string>;
  suggestedSlugs?: Set<string>;
  onToggle: (tag: ShortTag) => void;
};

const TAG_SECTION_CONFIG: Record<BaseTagSection, SectionConfig> = {
  Genres: {
    label: "Genres",
    icon: Swords,
  },
  "Ways to Play": {
    label: "Ways to Play",
    icon: SlidersHorizontal,
  },
  Themes: {
    label: "Themes",
    icon: Palette,
  },
  Playstyle: {
    label: "Playstyle",
    icon: Gamepad2,
  },
};

const TagSection = ({
  tags,
  activeSlugs,
  suggestedSlugs = new Set<string>(),
  onToggle,
}: TagSectionProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-2.5">
        {tags.map((tag) => (
          <TagButton
            key={tag.slug}
            tag={tag}
            isActive={activeSlugs.has(tag.slug)}
            isSuggested={suggestedSlugs.has(tag.slug)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
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

export const TagSelector = ({
  tags,
  activeSection,
  active,
  suggested,
  onSectionChange,
  onToggle,
}: Props) => {
  const groupedTags = groupBaseTagsBySection(tags);
  const activeSlugs = new Set(active.map((tag) => tag.slug));
  const suggestedTags = suggested;
  const suggestedSlugs = new Set(suggestedTags.map((tag) => tag.slug));
  const activeSectionConfig = TAG_SECTION_CONFIG[activeSection];
  const activeSectionTags = groupedTags[activeSection];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl md:text-4xl font-bold">
          Refine your <span className="gradient-text">taste</span>
        </h2>
      </div>

      {suggestedTags.length > 0 && (
        <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-4 md:p-5 space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
              <Sparkles className="h-4 w-4" />
            </span>
            Suggested from your picks
            <span className="text-xs font-normal text-muted-foreground">
              · shared across your selected games
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {suggestedTags.map((tag) => {
              return (
                <TagButton
                  key={tag.slug}
                  tag={tag}
                  isActive={activeSlugs.has(tag.slug)}
                  isSuggested={suggestedSlugs.has(tag.slug)}
                  onToggle={onToggle}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BASE_TAG_SECTIONS.map((section) => {
          const config = TAG_SECTION_CONFIG[section.name];
          const Icon = config.icon;
          const activeCount = groupedTags[section.name].filter((tag) =>
            activeSlugs.has(tag.slug),
          ).length;
          const isActive = activeSection === section.name;

          return (
            <button
              key={section.name}
              type="button"
              onClick={() => onSectionChange(section.name)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-bounce",
                isActive
                  ? "gradient-primary border-transparent text-primary-foreground shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.6)]"
                  : "border-border bg-transparent text-foreground/75 hover:border-primary/50 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{config.label}</span>
              {activeCount > 0 && (
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px]",
                    isActive
                      ? "bg-background/20 text-primary-foreground"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {activeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeSectionConfig && (
        <TagSection
          tags={activeSectionTags}
          activeSlugs={activeSlugs}
          onToggle={onToggle}
        />
      )}
    </div>
  );
};
