import { TAG_ALIASES } from "@/consts/tag-aliases";
import { TAG_BLACKLIST } from "@/consts/tag-blacklist";
import { TAG_DISPLAY_NAMES } from "@/consts/tag-display-names";
import { RawgTag } from "@/types/rawg";

export const MIN_TAG_GAMES_COUNT = 40;

export type NormalizedTag = {
  slug: string;
  name: string;
  gamesCount: number;
};

function formatTagName(name: string) {
  return name.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

export function normalizeTag(rawTag: RawgTag) {
  // 1. tylko angielski
  if (rawTag.language !== "eng") return null;

  // 2. minimalna liczba gier w RAWG
  if (rawTag.games_count < MIN_TAG_GAMES_COUNT) return null;

  // 3. blacklist oryginalnego sluga
  if (TAG_BLACKLIST.has(rawTag.slug)) return null;

  // 4. alias
  const slug = TAG_ALIASES[rawTag.slug] ?? rawTag.slug;

  // 5. blacklist sluga po aliasie
  if (TAG_BLACKLIST.has(slug)) return null;

  // 6. display name
  const name = TAG_DISPLAY_NAMES[slug] ?? formatTagName(rawTag.name);

  return { slug, name, gamesCount: rawTag.games_count };
}

export function normalizeTags(rawTags: RawgTag[]) {
  const normalized = rawTags
    .map(normalizeTag)
    .filter((tag): tag is NormalizedTag => tag !== null);

  // deduplikacja po slug, z zachowaniem najwyzszego gamesCount po aliasach
  const unique = Object.values(
    normalized.reduce<Record<string, NormalizedTag>>((acc, tag) => {
      const existing = acc[tag.slug];

      if (!existing || tag.gamesCount > existing.gamesCount) {
        acc[tag.slug] = tag;
      }

      return acc;
    }, {}),
  );

  return unique;
}
