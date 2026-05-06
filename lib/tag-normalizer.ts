import { RawgTagLike } from "@/types/rawg";
import { TAGS, TagSlug } from "@/consts/tags";
import { TAG_ALIASES } from "@/consts/tag-aliases";

export const MIN_TAG_GAMES_COUNT = 40;

export type NormalizedTag = {
  slug: string;
  name: string;
  gamesCount: number;
};

export function normalizeTagNew(rawTag: RawgTagLike): TagSlug[] | undefined {
  const alias = TAG_ALIASES[rawTag.slug as keyof typeof TAG_ALIASES];

  if (alias) return alias;

  if (rawTag.slug in TAGS) {
    return [rawTag.slug as TagSlug];
  }
}

function getTagWithName(tagSlugs: TagSlug[]) {
  return tagSlugs.map((tag) => ({
    slug: tag,
    name: TAGS[tag].name,
  }));
}

function deduplicate(tagSlugs: TagSlug[]): TagSlug[] {
  return [...new Set(tagSlugs)];
}

export function normalizeTags(rawTags: RawgTagLike[]) {
  const normalized = rawTags
    .map(normalizeTagNew)
    .filter(Boolean)
    .flat() as TagSlug[];

  const unique = deduplicate(normalized);
  console.log(
    "getTagWithName(unique);",
    getTagWithName(unique).map((el) => el.slug),
  );
  return getTagWithName(unique);
}
