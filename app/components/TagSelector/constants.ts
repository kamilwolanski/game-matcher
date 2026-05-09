import {
  Gamepad2,
  Layers3,
  Palette,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { type BaseTagSection } from "@/consts/base-tags";

export type SectionConfig = {
  label: string;
  icon: LucideIcon;
};

export const INITIAL_VISIBLE_COUNT = 17;

export const TAG_SECTION_CONFIG: Record<BaseTagSection, SectionConfig> = {
  Gameplay: {
    label: "Gameplay",
    icon: Swords,
  },
  "Style & Theme": {
    label: "Style & Theme",
    icon: Palette,
  },
  Experience: {
    label: "Experience",
    icon: Gamepad2,
  },
  "Perspective & Modes": {
    label: "Perspective & Modes",
    icon: Layers3,
  },
};

export const STATUS_PHRASES = [
  "Updated from your latest pick",
  "Suggestions refreshed",
  "Taste profile updated",
];
