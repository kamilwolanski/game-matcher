import { TAGS_AS_OBJECT } from "@/consts/tags";
import type { GameAiTag, RawAiTag, TagStrength } from "./types";

const PARENT_TAG_RULES: Record<string, readonly string[]> = {
  jrpg: ["rpg"],
  crpg: ["rpg"],
  arpg: ["rpg", "action", "real-time-combat"],
  srpg: ["rpg", "strategy"],
  drpg: ["rpg", "dungeon-crawler"],
  fps: ["shooter"],
  tps: ["shooter"],
  "boomer-shooter": ["shooter", "fps"],
  "hero-shooter": ["shooter"],
  "looter-shooter": ["shooter", "loot-driven", "gear-progression"],
  "arena-shooter": ["shooter"],
  "extraction-shooter": ["shooter"],
  "tactical-shooter": ["shooter", "tactical"],
  "survival-horror": ["horror", "survival"],
  soulsvania: ["metroidvania"],
  "city-builder": ["simulation", "strategy", "building", "resource-management"],
  "grand-strategy": ["strategy"],
  "tower-defense": ["strategy"],
  rts: ["strategy"],
  moba: ["strategy", "multiplayer", "online-pvp", "match-based"],
  football: ["sports"],
  "farming-sim": ["simulation"],
  "survival-crafting": ["survival", "crafting"],
  ww2: ["war", "military", "historical"],
  "auto-battler": ["strategy"],
  "battle-royale": ["multiplayer", "online-pvp", "match-based"],
  "visual-novel": ["narrative-driven", "dialogue-heavy"],
  "walking-simulator": ["exploration", "narrative-driven"],
  "point-and-click": ["adventure", "puzzle-solving"],
  roguelike: ["procedural", "permadeath"],
  roguelite: ["procedural", "permadeath"],
  "souls-like": ["precision-combat", "challenging"],
  "bullet-hell": ["high-reflex", "arcade"],
  "factory-management": ["automation", "resource-management"],
  "colony-management": ["resource-management"],
  cyberpunk: ["sci-fi", "dystopian"],
  aliens: ["sci-fi"],
  space: ["sci-fi"],
  "organized-crime": ["crime"],
  "greek-mythology": ["mythology"],
  "norse-mythology": ["mythology"],
  "urban-fantasy": ["fantasy"],
  lovecraftian: ["horror", "dark"],
  mmo: ["multiplayer", "shared-world"],
  noir: ["crime"],
  "open-world": ["exploration"],
};

function getParentTagStrength(childStrength: TagStrength): TagStrength {
  if (childStrength === 3) return 2;

  return childStrength;
}

function maxStrength(a: TagStrength, b: TagStrength): TagStrength {
  return Math.max(a, b) as TagStrength;
}

function withRequiredParentTags(tags: RawAiTag[]) {
  const normalizedTags = new Map<string, RawAiTag>();

  for (const tag of tags) {
    normalizedTags.set(tag.slug, tag);

    for (const parentSlug of PARENT_TAG_RULES[tag.slug] ?? []) {
      const parentStrength = getParentTagStrength(tag.strength);
      const existingParent = normalizedTags.get(parentSlug);

      normalizedTags.set(parentSlug, {
        slug: parentSlug,
        strength: existingParent
          ? maxStrength(existingParent.strength, parentStrength)
          : parentStrength,
      });
    }
  }

  return Array.from(normalizedTags.values());
}

function withInferredTags(tags: RawAiTag[]) {
  const tagMap = new Map(tags.map((tag) => [tag.slug, { ...tag }]));
  const tagSlugs = new Set(tagMap.keys());

  const ensure = (slug: string, strength: TagStrength) => {
    const existing = tagMap.get(slug);

    if (!existing) {
      tagMap.set(slug, { slug, strength });
      return;
    }

    existing.strength = maxStrength(existing.strength, strength);
  };

  if (shouldAddCozy(tagSlugs)) {
    ensure("cozy", 1);
  }

  if (shouldAddFunny(tagSlugs)) {
    ensure("funny", 1);
  }

  return Array.from(tagMap.values());
}

function shouldAddCozy(tags: Set<string>) {
  let score = 0;

  if (tags.has("family-friendly")) score += 2;
  if (tags.has("life-sim")) score += 3;
  if (tags.has("farming-sim")) score += 3;
  if (tags.has("relaxing")) score += 2;

  if (tags.has("casual")) score += 1;
  if (tags.has("stylized")) score += 1;

  if (tags.has("horror")) score -= 3;
  if (tags.has("survival-horror")) score -= 4;
  if (tags.has("grimdark")) score -= 3;
  if (tags.has("competitive")) score -= 2;
  if (tags.has("mil-sim")) score -= 3;
  if (tags.has("fast-paced")) score -= 2;

  return score >= 4;
}

function shouldAddFunny(tags: Set<string>) {
  let score = 0;

  if (tags.has("party-game")) score += 3;
  if (tags.has("physics-based")) score += 2;
  if (tags.has("family-friendly")) score += 1;
  if (tags.has("stylized")) score += 1;
  if (tags.has("sandbox")) score += 1;

  if (tags.has("grimdark")) score -= 4;
  if (tags.has("survival-horror")) score -= 4;
  if (tags.has("horror")) score -= 2;
  if (tags.has("mil-sim")) score -= 4;

  return score >= 4;
}

export function normalizeAiTags(tags: RawAiTag[]): GameAiTag[] {
  return Array.from(
    new Map(
      withInferredTags(withRequiredParentTags(tags)).map((tag) => [
        tag.slug,
        {
          slug: tag.slug,
          name: TAGS_AS_OBJECT[tag.slug].name,
          strength: tag.strength,
        },
      ]),
    ).values(),
  );
}
