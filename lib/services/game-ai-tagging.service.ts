import {
  CATEGORY_WEIGHTS,
  TAGS,
  type TagSlug,
} from "@/consts/tags";
import type { RawgGame } from "@/types/rawg";
import OpenAI from "openai";

const client = new OpenAI();

const OPENAI_MODEL = "gpt-5.4-mini";
const DESCRIPTION_LIMIT = 600;
const MIN_TAGS = 8;
const MAX_TAGS = 14;

type GameAiTag = {
  slug: TagSlug;
  name: string;
};

const TAG_SLUGS = Object.keys(TAGS) as TagSlug[];

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
        content: `You are a precise video game taxonomy classifier. 
        Select between ${MIN_TAGS} and ${MAX_TAGS} tags.
        
        CRITICAL RULES:
        1. Use the following Category Weights to prioritize your selection. Higher weight means the category is more essential to defining the game:
        ${WEIGHTS_DESCRIPTION}
        
        2. Always ensure core categories (genre, subgenre, structure) are represented if the description allows.
        3. Only use lower-weighted tags (like mood) as "fillers" to reach the minimum tag count or if they are exceptionally iconic for the title.
        4. Use ONLY slugs from the provided schema.`,
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
    tags: TagSlug[];
  } | null;
  const slugs = parsed?.tags;

  if (!slugs || slugs.length === 0) {
    throw new Error(`OpenAI error for: ${rawgGame.name}`);
  }

  return slugs.map((slug) => ({
    slug,
    name: TAGS[slug].name,
  }));
}
