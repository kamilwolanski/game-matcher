import type { ShortTag } from "@/lib/dto/tag.dto";
import { TagSlug } from "./tags";
export const BASE_TAG_SECTIONS = [
  {
    name: "Gameplay",
    label: "Gameplay",
  },
  {
    name: "Style & Theme",
    label: "Style & Theme",
  },
  {
    name: "Experience",
    label: "Experience",
  },
  {
    name: "Perspective & Modes",
    label: "Perspective & Modes",
  },
] as const;

export type BaseTagSection = (typeof BASE_TAG_SECTIONS)[number]["name"];

export const BASE_TAGS: {
  slug: TagSlug;
  section: BaseTagSection;
}[] = [
  // =========================================================
  // GAMEPLAY
  // =========================================================

  // Core genres
  { slug: "rpg", section: "Gameplay" },
  { slug: "action", section: "Gameplay" },
  { slug: "adventure", section: "Gameplay" },
  { slug: "strategy", section: "Gameplay" },
  { slug: "shooter", section: "Gameplay" },
  { slug: "simulation", section: "Gameplay" },
  { slug: "survival", section: "Gameplay" },
  { slug: "horror", section: "Gameplay" },
  { slug: "platformer", section: "Gameplay" },
  { slug: "sports", section: "Gameplay" },
  { slug: "racing", section: "Gameplay" },
  { slug: "puzzle", section: "Gameplay" },

  // Major subgenres
  { slug: "fps", section: "Gameplay" },
  { slug: "tps", section: "Gameplay" },
  { slug: "arpg", section: "Gameplay" },
  { slug: "jrpg", section: "Gameplay" },
  { slug: "crpg", section: "Gameplay" },
  { slug: "srpg", section: "Gameplay" },
  { slug: "moba", section: "Gameplay" },
  { slug: "rts", section: "Gameplay" },
  { slug: "battle-royale", section: "Gameplay" },
  { slug: "metroidvania", section: "Gameplay" },
  { slug: "soulsvania", section: "Gameplay" },
  { slug: "survival-horror", section: "Gameplay" },
  { slug: "city-builder", section: "Gameplay" },
  { slug: "tower-defense", section: "Gameplay" },
  { slug: "dungeon-crawler", section: "Gameplay" },
  { slug: "point-and-click", section: "Gameplay" },
  { slug: "visual-novel", section: "Gameplay" },
  { slug: "walking-simulator", section: "Gameplay" },
  { slug: "farming-sim", section: "Gameplay" },
  { slug: "party-game", section: "Gameplay" },

  // Structure
  { slug: "open-world", section: "Gameplay" },
  { slug: "souls-like", section: "Gameplay" },
  { slug: "roguelike", section: "Gameplay" },
  { slug: "roguelite", section: "Gameplay" },
  { slug: "sandbox", section: "Gameplay" },
  { slug: "immersive-sim", section: "Gameplay" },
  { slug: "procedural", section: "Gameplay" },
  { slug: "branching", section: "Gameplay" },
  { slug: "mission-based", section: "Gameplay" },
  { slug: "match-based", section: "Gameplay" },

  // Core mechanics
  { slug: "exploration", section: "Gameplay" },
  { slug: "stealth", section: "Gameplay" },
  { slug: "crafting", section: "Gameplay" },
  { slug: "building", section: "Gameplay" },
  { slug: "loot", section: "Gameplay" },
  { slug: "turn-based", section: "Gameplay" },
  { slug: "deckbuilder", section: "Gameplay" },
  { slug: "choices-matter", section: "Gameplay" },
  { slug: "character-builds", section: "Gameplay" },
  { slug: "management", section: "Gameplay" },
  { slug: "resource-management", section: "Gameplay" },
  { slug: "automation", section: "Gameplay" },
  { slug: "dialogue-heavy", section: "Gameplay" },
  { slug: "hack-and-slash", section: "Gameplay" },
  { slug: "parry", section: "Gameplay" },
  { slug: "tactical", section: "Gameplay" },

  // =========================================================
  // STYLE & THEME
  // =========================================================

  // Themes
  // Themes
  { slug: "fantasy", section: "Style & Theme" },
  { slug: "dark-fantasy", section: "Style & Theme" },
  { slug: "sci-fi", section: "Style & Theme" },
  { slug: "cyberpunk", section: "Style & Theme" },
  { slug: "steampunk", section: "Style & Theme" },
  { slug: "post-apocalyptic", section: "Style & Theme" },
  { slug: "dystopian", section: "Style & Theme" },

  { slug: "medieval", section: "Style & Theme" },
  { slug: "magic", section: "Style & Theme" },
  { slug: "space", section: "Style & Theme" },
  { slug: "zombies", section: "Style & Theme" },

  { slug: "detective", section: "Style & Theme" },
  { slug: "mystery", section: "Style & Theme" },
  { slug: "historical", section: "Style & Theme" },

  { slug: "war", section: "Style & Theme" },
  { slug: "military", section: "Style & Theme" },

  { slug: "western", section: "Style & Theme" },
  { slug: "pirates", section: "Style & Theme" },
  { slug: "organized-crime", section: "Style & Theme" },

  { slug: "norse-mythology", section: "Style & Theme" },
  { slug: "samurai", section: "Style & Theme" },
  { slug: "superhero", section: "Style & Theme" },
  { slug: "underwater", section: "Style & Theme" },
  { slug: "urban-fantasy", section: "Style & Theme" },
  { slug: "lovecraftian", section: "Style & Theme" },
  { slug: "vampires", section: "Style & Theme" },

  // Aesthetic
  { slug: "realistic", section: "Style & Theme" },
  { slug: "stylized", section: "Style & Theme" },
  { slug: "retro", section: "Style & Theme" },
  { slug: "pixel-art", section: "Style & Theme" },
  { slug: "anime", section: "Style & Theme" },
  { slug: "gothic", section: "Style & Theme" },
  { slug: "cinematic", section: "Style & Theme" },
  { slug: "hand-drawn", section: "Style & Theme" },
  { slug: "surreal", section: "Style & Theme" },

  // =========================================================
  // EXPERIENCE
  // =========================================================

  // Mood
  { slug: "immersive", section: "Experience" },
  { slug: "atmospheric", section: "Experience" },
  { slug: "dark", section: "Experience" },
  { slug: "tense", section: "Experience" },
  { slug: "scary", section: "Experience" },
  { slug: "emotional", section: "Experience" },
  { slug: "funny", section: "Experience" },
  { slug: "cozy", section: "Experience" },
  { slug: "relaxing", section: "Experience" },
  { slug: "competitive", section: "Experience" },
  { slug: "addictive", section: "Experience" },
  { slug: "philosophical", section: "Experience" },

  // Pace / feel
  { slug: "fast-paced", section: "Experience" },
  { slug: "slow-paced", section: "Experience" },
  { slug: "methodical", section: "Experience" },
  { slug: "challenging", section: "Experience" },
  { slug: "casual", section: "Experience" },
  { slug: "arcade", section: "Experience" },
  { slug: "high-reflex", section: "Experience" },

  // Progression feel
  { slug: "narrative-driven", section: "Experience" },
  { slug: "loot-driven", section: "Experience" },
  { slug: "gear-progression", section: "Experience" },
  { slug: "buildcraft-heavy", section: "Experience" },
  { slug: "grind-heavy", section: "Experience" },

  // =========================================================
  // PERSPECTIVE & MODES
  // =========================================================

  // Perspective
  { slug: "first-person", section: "Perspective & Modes" },
  { slug: "third-person", section: "Perspective & Modes" },
  { slug: "isometric", section: "Perspective & Modes" },
  { slug: "top-down", section: "Perspective & Modes" },
  { slug: "sideview", section: "Perspective & Modes" },

  // Modes
  { slug: "singleplayer", section: "Perspective & Modes" },
  { slug: "multiplayer", section: "Perspective & Modes" },
  { slug: "coop", section: "Perspective & Modes" },
  { slug: "online-pvp", section: "Perspective & Modes" },
  { slug: "online-pve", section: "Perspective & Modes" },
  { slug: "local-multiplayer", section: "Perspective & Modes" },
  { slug: "split-screen", section: "Perspective & Modes" },
  { slug: "ranked", section: "Perspective & Modes" },
  { slug: "shared-world", section: "Perspective & Modes" },
  { slug: "drop-in-drop-out", section: "Perspective & Modes" },
];

export type BaseTag = (typeof BASE_TAGS)[number];

export const BASE_TAG_SLUGS = BASE_TAGS.map((tag) => tag.slug);

export const DEFAULT_BASE_TAG_SECTION = BASE_TAG_SECTIONS[0].name;

const BASE_TAG_SLUG_SET = new Set<string>(BASE_TAG_SLUGS);

export function isBaseTagSlug(slug: string) {
  return BASE_TAG_SLUG_SET.has(slug);
}

export function getBaseTagSection(slug: string): BaseTagSection | null {
  return BASE_TAGS.find((tag) => tag.slug === slug)?.section ?? null;
}

export function groupBaseTagsBySection(tags: ShortTag[]) {
  const tagMap = new Map(tags.map((tag) => [tag.slug, tag]));

  return BASE_TAGS.reduce(
    (acc, config) => {
      const tag = tagMap.get(config.slug);

      if (!tag) return acc;

      acc[config.section].push(tag);

      return acc;
    },
    Object.fromEntries(
      BASE_TAG_SECTIONS.map((section) => [section.name, [] as ShortTag[]]),
    ) as Record<BaseTagSection, ShortTag[]>,
  );
}
