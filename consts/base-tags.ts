import type { ShortTag } from "@/lib/dto/tag.dto";

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
  slug: string;
  section: BaseTagSection;
}[] = [
  // =========================================================
  // GAMEPLAY
  // =========================================================

  // Genres
  {
    slug: "rpg",
    section: "Gameplay",
  },
  {
    slug: "action",
    section: "Gameplay",
  },
  {
    slug: "adventure",
    section: "Gameplay",
  },
  {
    slug: "strategy",
    section: "Gameplay",
  },
  {
    slug: "shooter",
    section: "Gameplay",
  },
  {
    slug: "simulation",
    section: "Gameplay",
  },
  {
    slug: "platformer",
    section: "Gameplay",
  },
  {
    slug: "racing",
    section: "Gameplay",
  },
  {
    slug: "sports",
    section: "Gameplay",
  },
  {
    slug: "survival",
    section: "Gameplay",
  },
  {
    slug: "horror",
    section: "Gameplay",
  },

  // Popular subgenres
  {
    slug: "fps",
    section: "Gameplay",
  },
  {
    slug: "arpg",
    section: "Gameplay",
  },
  {
    slug: "jrpg",
    section: "Gameplay",
  },
  {
    slug: "crpg",
    section: "Gameplay",
  },
  {
    slug: "srpg",
    section: "Gameplay",
  },
  {
    slug: "moba",
    section: "Gameplay",
  },
  {
    slug: "metroidvania",
    section: "Gameplay",
  },
  {
    slug: "city-builder",
    section: "Gameplay",
  },
  {
    slug: "battle-royale",
    section: "Gameplay",
  },
  {
    slug: "survival-horror",
    section: "Gameplay",
  },

  // Structure
  {
    slug: "open-world",
    section: "Gameplay",
  },
  {
    slug: "souls-like",
    section: "Gameplay",
  },
  {
    slug: "roguelike",
    section: "Gameplay",
  },
  {
    slug: "roguelite",
    section: "Gameplay",
  },
  {
    slug: "immersive-sim",
    section: "Gameplay",
  },
  {
    slug: "sandbox",
    section: "Gameplay",
  },

  // Mechanics
  {
    slug: "exploration",
    section: "Gameplay",
  },
  {
    slug: "stealth",
    section: "Gameplay",
  },
  {
    slug: "crafting",
    section: "Gameplay",
  },
  {
    slug: "building",
    section: "Gameplay",
  },
  {
    slug: "loot",
    section: "Gameplay",
  },
  {
    slug: "turn-based",
    section: "Gameplay",
  },
  {
    slug: "deckbuilder",
    section: "Gameplay",
  },
  {
    slug: "choices-matter",
    section: "Gameplay",
  },
  {
    slug: "character-builds",
    section: "Gameplay",
  },
  {
    slug: "management",
    section: "Gameplay",
  },

  // =========================================================
  // STYLE & THEME
  // =========================================================

  {
    slug: "fantasy",
    section: "Style & Theme",
  },
  {
    slug: "dark-fantasy",
    section: "Style & Theme",
  },
  {
    slug: "sci-fi",
    section: "Style & Theme",
  },
  {
    slug: "cyberpunk",
    section: "Style & Theme",
  },
  {
    slug: "post-apocalyptic",
    section: "Style & Theme",
  },
  {
    slug: "medieval",
    section: "Style & Theme",
  },
  {
    slug: "magic",
    section: "Style & Theme",
  },
  {
    slug: "space",
    section: "Style & Theme",
  },
  {
    slug: "zombies",
    section: "Style & Theme",
  },
  {
    slug: "detective",
    section: "Style & Theme",
  },
  {
    slug: "mystery",
    section: "Style & Theme",
  },
  {
    slug: "historical",
    section: "Style & Theme",
  },

  // Aesthetic
  {
    slug: "realistic",
    section: "Style & Theme",
  },
  {
    slug: "stylized",
    section: "Style & Theme",
  },
  {
    slug: "retro",
    section: "Style & Theme",
  },
  {
    slug: "pixel-art",
    section: "Style & Theme",
  },
  {
    slug: "anime",
    section: "Style & Theme",
  },
  {
    slug: "gothic",
    section: "Style & Theme",
  },
  {
    slug: "cinematic",
    section: "Style & Theme",
  },

  // =========================================================
  // EXPERIENCE
  // =========================================================

  {
    slug: "relaxing",
    section: "Experience",
  },
  {
    slug: "cozy",
    section: "Experience",
  },
  {
    slug: "competitive",
    section: "Experience",
  },
  {
    slug: "atmospheric",
    section: "Experience",
  },
  {
    slug: "dark",
    section: "Experience",
  },
  {
    slug: "emotional",
    section: "Experience",
  },
  {
    slug: "addictive",
    section: "Experience",
  },
  {
    slug: "funny",
    section: "Experience",
  },

  // Pace
  {
    slug: "fast-paced",
    section: "Experience",
  },
  {
    slug: "slow-paced",
    section: "Experience",
  },
  {
    slug: "tactical",
    section: "Experience",
  },
  {
    slug: "methodical",
    section: "Experience",
  },
  {
    slug: "hardcore",
    section: "Experience",
  },
  {
    slug: "casual",
    section: "Experience",
  },
  {
    slug: "arcade",
    section: "Experience",
  },

  // =========================================================
  // PERSPECTIVE & MODES
  // =========================================================

  {
    slug: "first-person",
    section: "Perspective & Modes",
  },
  {
    slug: "third-person",
    section: "Perspective & Modes",
  },
  {
    slug: "isometric",
    section: "Perspective & Modes",
  },
  {
    slug: "top-down",
    section: "Perspective & Modes",
  },

  {
    slug: "singleplayer",
    section: "Perspective & Modes",
  },
  {
    slug: "multiplayer",
    section: "Perspective & Modes",
  },
  {
    slug: "coop",
    section: "Perspective & Modes",
  },
  {
    slug: "online-pvp",
    section: "Perspective & Modes",
  },
];

export type BaseTag = (typeof BASE_TAGS)[number];

export type TagSlug = BaseTag["slug"];

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
