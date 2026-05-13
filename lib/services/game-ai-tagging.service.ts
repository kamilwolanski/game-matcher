import { CATEGORY_WEIGHTS, TAG_SLUGS, TAGS_AS_OBJECT } from "@/consts/tags";
import type { RawgGame } from "@/types/rawg";
import OpenAI from "openai";

const client = new OpenAI();

const OPENAI_MODEL = "gpt-5.4-mini";
const DESCRIPTION_LIMIT = 600;
const MIN_TAGS = 6;
const MAX_TAGS = 10;

type GameAiTag = {
  slug: string;
  name: string;
  strength: 1 | 2 | 3;
};

type RawAiTag = Pick<GameAiTag, "slug" | "strength">;

const PARENT_TAG_RULES: Record<string, readonly string[]> = {
  jrpg: ["rpg"],
  crpg: ["rpg"],
  arpg: ["rpg"],
  srpg: ["rpg", "strategy"],
  drpg: ["rpg", "dungeon-crawler"],
  fps: ["shooter"],
  tps: ["shooter"],
  "boomer-shooter": ["shooter", "fps"],
  "hero-shooter": ["shooter"],
  "looter-shooter": ["shooter"],
  "arena-shooter": ["shooter"],
  "extraction-shooter": ["shooter"],
  "tactical-shooter": ["shooter"],
  "survival-horror": ["horror", "survival"],
  soulsvania: ["metroidvania"],
  "city-builder": ["simulation", "strategy"],
  "grand-strategy": ["strategy"],
  "tower-defense": ["strategy"],
  rts: ["strategy"],
  moba: ["strategy"],
  football: ["sports"],
  "farming-sim": ["simulation"],
  "survival-crafting": ["survival", "crafting"],
};

function compactDescription(description?: string) {
  if (!description) return "";

  return description.replace(/\s+/g, " ").trim().slice(0, DESCRIPTION_LIMIT);
}

function getParentTagStrength(childStrength: 1 | 2 | 3): 1 | 2 | 3 {
  if (childStrength === 3) return 2;

  return childStrength;
}

function maxStrength(a: 1 | 2 | 3, b: 1 | 2 | 3): 1 | 2 | 3 {
  return Math.max(a, b) as 1 | 2 | 3;
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

const WEIGHTS_DESCRIPTION = Object.entries(CATEGORY_WEIGHTS)
  .map(([cat, weight]) => `- ${cat}: weight ${weight}`)
  .join("\n");

export async function generateGameTags(
  rawgGame: RawgGame,
): Promise<GameAiTag[]> {
  const description = compactDescription(rawgGame.description_raw);

  const response = await client.chat.completions.parse({
    model: OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content: `
          You are a precise video game taxonomy classifier.

          Your task is to assign gameplay and thematic tags that best represent the game's core identity.

          Select only the tags necessary to accurately describe the game.
          Typically this should be between ${MIN_TAGS} and ${MAX_TAGS} tags.

          CRITICAL RULES:

          1. Prioritize CORE IDENTITY over surface details.

          Focus primarily on:
          - core gameplay loop
          - gameplay structure
          - mechanics
          - progression
          - combat style
          - player experience

          Avoid tags that are technically true but not central to the experience.

          2. Use category importance as guidance:

          ${WEIGHTS_DESCRIPTION}

          Gameplay-defining categories should generally matter more than:
          - theme
          - mood
          - aesthetic
          - narrative flavor

          3. TAG STRENGTH RULES

          Each tag must include a strength value from 1 to 3.

          Strength meaning:

          3 = Core identity
          Fundamental to the game's gameplay loop or overall experience.

          2 = Strongly important
          Clearly important, but not the primary defining identity.

          1 = Supporting aspect
          Secondary, atmospheric, contextual, or lightly represented.

          IMPORTANT:
          - Strength 3 tags should be rare and highly selective
          - Most games should usually have 2-4 strength-3 tags
          - Most remaining tags should be strength 2
          - Supporting or contextual traits should usually be strength 1
          - Do not assign high strength to every tag
          - Prefer strong prioritization and clear hierarchy

          A tag should receive strength 3 only if removing it would fundamentally change the game's identity.

          4. Prefer specific tags over generic ones,
          but keep essential parent gameplay tags.

          Prefer the most distinctive and specific theme tag when clearly supported.

          Do not default to broad fantasy archetypes when a more distinctive theme tag is clearly more accurate.

          Theme examples:
          - prefer "steampunk" over broad "dark-fantasy" when more accurate
          - prefer "cyberpunk" over generic "sci-fi"
          - prefer "noir" over generic "crime"

          Parent tag examples:
          - "fps" should usually also include "shooter"
          - "jrpg" should usually also include "rpg"
          - "survival-horror" should usually also include "horror"

          5. Avoid redundant or overlapping tags unless both add meaningful information.

          6. Avoid contradictory tags.

          Examples:
          - "fast-paced" and "slow-paced"
          - "relaxing" and "tense"
          - "casual" and "challenging"

          7. Mood tags should be used sparingly.

          Only use mood tags if they are iconic or central to the experience.

          8. Prefer precision over coverage.

          It is better to omit a weak tag than include an inaccurate one.

          9. Use ONLY slugs from the provided schema.

          10. Only assign tags strongly supported by:
          - the game description
          - known gameplay
          - the game's core identity

          11. Do not infer party-based gameplay unless the player directly controls or manages multiple party members for a substantial portion of the game.

          12. Perspective and mode tags are usually supporting traits unless they fundamentally define the experience.

          Examples:
          - "first-person" in an FPS may deserve strength 2
          - "third-person" in an action RPG is often strength 1
          - "singleplayer" is usually strength 1

          13. Order tags from most defining to least defining.

          EXAMPLES:

          DOOM Eternal:
          [
            { "slug": "shooter", "strength": 3 },
            { "slug": "fps", "strength": 3 },
            { "slug": "boomer-shooter", "strength": 3 },
            { "slug": "action", "strength": 2 },
            { "slug": "fast-paced", "strength": 2 },
            { "slug": "high-reflex", "strength": 2 },
            { "slug": "arcade", "strength": 1 }
          ]

          Dark Souls:
          [
            { "slug": "souls-like", "strength": 3 },
            { "slug": "precision-combat", "strength": 3 },
            { "slug": "challenging", "strength": 3 },
            { "slug": "rpg", "strength": 2 },
            { "slug": "dark-fantasy", "strength": 2 },
            { "slug": "third-person", "strength": 1 }
          ]

          Disco Elysium:
          [
            { "slug": "crpg", "strength": 3 },
            { "slug": "dialogue-heavy", "strength": 3 },
            { "slug": "choices-matter", "strength": 3 },
            { "slug": "rpg", "strength": 2 },
            { "slug": "detective", "strength": 2 },
            { "slug": "narrative-driven", "strength": 2 },
            { "slug": "isometric", "strength": 1 }
          ]

          Return ONLY a JSON object matching the required schema.
          `,
      },
      {
        role: "user",
        content: `Title: ${rawgGame.name}\nDescription: ${description || "unavailable"}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "game_tagging",
        strict: true,
        schema: {
          type: "object",
          properties: {
            tags: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  slug: {
                    type: "string",
                    enum: TAG_SLUGS,
                  },
                  strength: {
                    type: "integer",
                    enum: [1, 2, 3],
                  },
                },
                required: ["slug", "strength"],
                additionalProperties: false,
              },
            },
          },
          required: ["tags"],
          additionalProperties: false,
        },
      },
    },
    temperature: 0.15,
  });

  const parsed = response.choices[0].message.parsed as {
    tags: {
      slug: string;
      strength: 1 | 2 | 3;
    }[];
  } | null;
  const tags = parsed?.tags;

  if (!tags || tags.length === 0) {
    throw new Error(`OpenAI error for: ${rawgGame.name}`);
  }

  const uniqueTags = Array.from(
    new Map(
      withRequiredParentTags(tags).map((tag) => [
        tag.slug,
        {
          slug: tag.slug,
          name: TAGS_AS_OBJECT[tag.slug].name,
          strength: tag.strength,
        },
      ]),
    ).values(),
  );

  return uniqueTags;
}
