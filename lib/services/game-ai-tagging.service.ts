import { CATEGORY_WEIGHTS, TAG_SLUGS, TAGS_AS_OBJECT } from "@/consts/tags";
import type { RawgGame } from "@/types/rawg";
import OpenAI from "openai";

const client = new OpenAI();

const OPENAI_MODEL = "gpt-5.4-mini";
const DESCRIPTION_LIMIT = 600;
const MIN_TAGS = 8;
const MAX_TAGS = 14;

type GameAiTag = {
  slug: string;
  name: string;
};


function compactDescription(description?: string) {
  if (!description) return "";

  return description.replace(/\s+/g, " ").trim().slice(0, DESCRIPTION_LIMIT);
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
              Select between ${MIN_TAGS} and ${MAX_TAGS} tags.

              CRITICAL RULES:

              1. Prioritize tags that define the CORE IDENTITY of the game.
              Avoid tags that are technically true but not central to the experience.

              2. Use the following Category Weights to guide importance:
              ${WEIGHTS_DESCRIPTION}

              3. Always include relevant high-priority categories when clearly supported:
              - genre
              - subgenre
              - structure

              4. Prefer specific tags over generic ones.
              Examples:
              - use "souls-like" instead of only "action"
              - use "survival-horror" instead of only "horror"
              - use "boomer-shooter" instead of only "fps"

              5. Avoid redundant or overlapping tags unless both are strongly justified.
              Examples:
              - avoid using both "fantasy" and "dark-fantasy"
              - avoid using both "multiplayer" and "online-pvp" unless both matter
              - avoid generic parent tags if a more specific tag fully describes the concept

              6. Avoid contradictory tags.
              Examples:
              - "fast-paced" and "slow-paced"
              - "relaxing" and "tense"
              - "casual" and "hardcore"

              7. Mood tags should be used sparingly.
              Only use mood tags if they are iconic or central to the game's identity.

              8. Prefer precision over coverage.

              9. Use ONLY slugs from the provided schema.

              10. Do not infer tags from weak associations or assumptions.
                Only assign tags strongly supported by the title or description.

                11. Not every category must be represented.
                It is better to omit a weak tag than include an inaccurate one.

                12. When a specific tag fully captures a concept, avoid adding its broader equivalent.

              Return ONLY a JSON array of tag slugs.
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
              items: { type: "string", enum: TAG_SLUGS },
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
    tags: string[];
  } | null;
  const slugs = parsed?.tags;

  if (!slugs || slugs.length === 0) {
    throw new Error(`OpenAI error for: ${rawgGame.name}`);
  }

  const uniqueTags = Array.from(
    new Map(
      slugs.map((slug) => [
        slug,
        {
          slug,
          name: TAGS_AS_OBJECT[slug].name,
        },
      ]),
    ).values(),
  );

  return uniqueTags;
}
