import type { ShortTag } from "@/lib/dto/tag.dto";

export const BASE_TAG_SECTIONS = [
  {
    name: "Genres",
    label: "Genres",
  },
  {
    name: "Ways to Play",
    label: "Ways to Play",
  },
  {
    name: "Themes",
    label: "Themes",
  },
  {
    name: "Playstyle",
    label: "Playstyle",
  },
] as const;

export type BaseTagSection = (typeof BASE_TAG_SECTIONS)[number]["name"];

export const BASE_TAGS = [
  // Genres
  {
    slug: "rpg",
    section: "Genres",
  },
  {
    slug: "shooter",
    section: "Genres",
  },
  {
    slug: "simulation",
    section: "Genres",
  },
{
    slug: "adventure",
    section: "Genres",
  },
  {
    slug: 'strategy',
    section: "Genres",
  },
  {
    slug: "action",
    section: "Genres",
  },
  {
    slug: "platformer",
    section: "Genres",
  },
  {
    slug: "racing",
    section: "Genres",
  },
  {
    slug: "roguelike",
    section: "Genres",
  },
  {
    slug: "sports",
    section: "Genres",
  },

  // Ways to Play
  {
    slug: "atmospheric",
    section: "Ways to Play",
  },
  {
    slug: "arpg",
    section: "Ways to Play",
  },
  {
    slug: "battle-royale",
    section: "Ways to Play",
  },
  {
    slug: "souls-like",
    section: "Ways to Play",
  },
  {
    slug: "fps",
    section: "Ways to Play",
  },
  {
    slug: "survival-horror",
    section: "Ways to Play",
  },
  {
    slug: "city-builder",
    section: "Ways to Play",
  },
  {
    slug: "hack-and-slash",
    section: "Ways to Play",
  },
  {
    slug: "rts",
    section: "Ways to Play",
  },
  {
    slug: "point-and-click",
    section: "Ways to Play",
  },
  {
    slug: "action-adventure",
    section: "Ways to Play",
  },

  // Themes
  {
    slug: "fantasy",
    section: "Themes",
  },
  {
    slug: "cyberpunk",
    section: "Themes",
  },
  {
    slug: "sci-fi",
    section: "Themes",
  },
  {
    slug: "post-apocalyptic",
    section: "Themes",
  },
  {
    slug: "zombies",
    section: "Themes",
  },
  {
    slug: "pirates",
    section: "Themes",
  },
  {
    slug: "horror",
    section: "Themes",
  },
  {
    slug: "romance",
    section: "Themes",
  },
  {
    slug: "crime",
    section: "Themes",
  },

  // Playstyle
  {
    slug: "singleplayer",
    section: "Playstyle",
  },
  {
    slug: "multiplayer",
    section: "Playstyle",
  },
  {
    slug: "casual",
    section: "Playstyle",
  },
] as const;

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
