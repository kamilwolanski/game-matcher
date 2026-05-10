import { cn } from "@/lib/utils";
import { type ShortTag } from "@/lib/dto/tag.dto";
import {
  BASE_TAG_SECTIONS,
  groupBaseTagsBySection,
  type BaseTagSection,
} from "@/consts/base-tags";
import { useState } from "react";
import { TagSection } from "./TagSection";
import { SuggestedPanel } from "./SuggestedPanel";
import { INITIAL_VISIBLE_COUNT, TAG_SECTION_CONFIG } from "./constants";

type Props = {
  tags: ShortTag[];
  activeSection: BaseTagSection;
  active: ShortTag[];
  suggestedTags: ShortTag[];
  onSectionChange: (section: BaseTagSection) => void;
  onToggle: (tag: ShortTag) => void;
};

export const TagSelector = ({
  tags,
  activeSection,
  active,
  suggestedTags,
  onSectionChange,
  onToggle,
}: Props) => {
  const [expanded, setExpanded] = useState<Record<BaseTagSection, boolean>>({
    Gameplay: false,
    "Style & Theme": false,
    Experience: false,
    "Perspective & Modes": false,
  });

  const groupedTags = groupBaseTagsBySection(tags);
  const activeSlugs = new Set(active.map((tag) => tag.slug));
  const activeSectionConfig = TAG_SECTION_CONFIG[activeSection];
  const activeSectionTags = groupedTags[activeSection] ?? [];

  const baseTags = activeSectionTags.slice(0, INITIAL_VISIBLE_COUNT);
  const extraTags = activeSectionTags.slice(INITIAL_VISIBLE_COUNT);

  const toggleExpanded = () => {
    setExpanded((prev) => ({ ...prev, [activeSection]: !prev[activeSection] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl md:text-4xl font-bold">
          Refine your <span className="gradient-text">taste</span>
        </h2>
      </div>

      <SuggestedPanel
        suggestedTags={suggestedTags}
        activeSlugs={activeSlugs}
        onToggle={onToggle}
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
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-bounce",
                isActive
                  ? "gradient-primary border-0 text-primary-foreground shadow-[0_4px_20px_-4px_var(--color-primary)]"
                  : "border-border bg-transparent text-foreground/75 hover:border-primary/50 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-smooth",
                  isActive
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "bg-primary/10 text-primary",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
              </span>
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
          baseTags={baseTags}
          extraTags={extraTags}
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
