import { useWindowSize } from "react-use";
import { cn } from "@/lib/utils";
import { type ShortTag } from "@/lib/dto/tag.dto";
import {
  BASE_TAG_SECTIONS,
  getDefaultVisibleTags,
  groupBaseTagsBySection,
  TAGS_AS_OBJECT,
  type BaseTagSection,
} from "@/consts/tags";
import { useMemo, useState } from "react";
import { TagSection } from "./TagSection";
import { SuggestedPanel } from "./SuggestedPanel";
import {
  INITIAL_VISIBLE_COUNT_DESKTOP,
  INITIAL_VISIBLE_COUNT_MOBILE,
  TAG_SECTION_CONFIG,
} from "./constants";
import TagSearch from "./TagSearch";
import { X } from "lucide-react";

type Props = {
  tags: ShortTag[];
  activeSection: BaseTagSection;
  activeTags: ShortTag[];
  suggestedTags: ShortTag[];
  isAnalyzing: boolean;
  isMobile: boolean;
  onSectionChange: (section: BaseTagSection) => void;
  onToggle: (tag: ShortTag) => void;
  clearAllTags: () => void;
};

export const TagSelector = ({
  tags,
  activeSection,
  activeTags,
  suggestedTags,
  isAnalyzing,
  isMobile,
  onSectionChange,
  onToggle,
  clearAllTags,
}: Props) => {
  const [expanded, setExpanded] = useState<Record<BaseTagSection, boolean>>({
    Gameplay: false,
    "Style & Theme": false,
    Experience: false,
    Perspective: false,
  });

  const groupedTags = useMemo(() => {
    const defaultTags = getDefaultVisibleTags(tags);

    if (activeTags.length === 0) {
      return groupBaseTagsBySection(defaultTags, false);
    }

    const activeNonDefaultTags = activeTags.filter(
      (tag) => !TAGS_AS_OBJECT[tag.slug].defaultVisible,
    );

    return groupBaseTagsBySection(
      [...defaultTags, ...activeNonDefaultTags],
      false,
    );
  }, [activeTags, tags]);

  const activeSlugs = new Set(activeTags.map((tag) => tag.slug));
  const activeSectionConfig = TAG_SECTION_CONFIG[activeSection];
  const activeSectionTags = groupedTags[activeSection] ?? [];

  const limit = isMobile
    ? INITIAL_VISIBLE_COUNT_MOBILE
    : INITIAL_VISIBLE_COUNT_DESKTOP;

  const defaultSectionTags = activeSectionTags.filter(
    (tag) => TAGS_AS_OBJECT[tag.slug].defaultVisible,
  );
  const visibleDefaultTags = defaultSectionTags.slice(0, limit);
  const selectedHiddenTags = activeSectionTags.filter(
    (tag) =>
      activeSlugs.has(tag.slug) && !TAGS_AS_OBJECT[tag.slug].defaultVisible,
  );

  const extraTags = defaultSectionTags
    .slice(limit)
    .filter((at) => selectedHiddenTags.every((sht) => sht.slug !== at.slug));

  const sectionExpanded = expanded[activeSection];

  const visibleTags = sectionExpanded
    ? visibleDefaultTags
    : [...visibleDefaultTags, ...selectedHiddenTags];
  const visibleExtraTags = sectionExpanded
    ? [...extraTags, ...selectedHiddenTags]
    : extraTags;

  const toggleExpanded = () => {
    setExpanded((prev) => ({ ...prev, [activeSection]: !prev[activeSection] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl md:text-4xl font-bold leading-none">
          Refine your <span className="gradient-text">taste</span>
        </h2>
        <button
          onClick={clearAllTags}
          className={cn(
            `
      shrink-0
      inline-flex
      items-center
      gap-1.5
      text-xs
      font-medium
      px-3
      py-1.5
      rounded-full
      border
      transition-smooth
    `,
            activeTags.length > 0
              ? `
        text-muted-foreground
        hover:text-foreground
        border-border/60
        hover:border-primary/40
        bg-card/40
        opacity-100
      `
              : `
        opacity-0
        pointer-events-none
      `,
          )}
        >
          <X className="h-3.5 w-3.5" />
          Clear all
          <span className="text-muted-foreground/60">
            ({activeTags.length})
          </span>
        </button>
      </div>

      <TagSearch tags={tags} onToggle={onToggle} activeSlugs={activeSlugs} />

      <SuggestedPanel
        suggestedTags={suggestedTags}
        activeSlugs={activeSlugs}
        onToggle={onToggle}
        isAnalyzing={isAnalyzing}
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BASE_TAG_SECTIONS.map((section) => {
          const config = TAG_SECTION_CONFIG[section.name];
          if (!config) return null;

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
                "flex items-center justify-center gap-1 md:gap-2 rounded-lg border px-2 py-2 md:px-3 md:py-3 text-xs md:text-sm font-medium transition-bounce",
                isActive
                  ? "border-primary/30 bg-linear-to-br from-primary/18 to-secondary/14 text-foreground shadow-[0_0_0_1px_hsl(217_100%_62%/0.15)]"
                  : "border-border bg-transparent text-foreground/75 hover:border-primary/50 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 md:h-9 md:w-9 items-center justify-center rounded-full transition-smooth",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "bg-primary/10 text-primary",
                )}
              >
                <Icon className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
              </span>
              <span>{config.label}</span>
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] transition-opacity",
                  activeCount > 0 ? "opacity-100" : "opacity-0",
                  isActive
                    ? "bg-white/5 text-foreground/80"
                    : "bg-primary/12 text-primary",
                )}
              >
                {activeCount}
              </span>
            </button>
          );
        })}
      </div>

      {activeSectionConfig && (
        <TagSection
          baseTags={visibleTags}
          extraTags={visibleExtraTags}
          expanded={expanded[activeSection]}
          toggleExpanded={toggleExpanded}
          tags={activeSectionTags}
          activeSlugs={activeSlugs}
          onToggle={onToggle}
        />
      )}
    </div>
  );
};
