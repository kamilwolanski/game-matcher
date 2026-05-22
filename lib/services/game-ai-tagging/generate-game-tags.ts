import type { RawgGame } from "@/types/rawg";
import OpenAI from "openai";
import { createGameTaggingMessages } from "./prompt";
import { gameTaggingResponseFormat } from "./response-format";
import { normalizeAiTags } from "./tag-normalization";
import type { GameAiTag, GameTaggingResponse } from "./types";

const client = new OpenAI();

const OPENAI_MODEL = "gpt-5.4-mini";

export async function generateGameTags(
  rawgGame: RawgGame,
): Promise<GameAiTag[]> {
  const response = await client.chat.completions.parse({
    model: OPENAI_MODEL,
    messages: createGameTaggingMessages(
      rawgGame.name,
      rawgGame.description_raw,
    ),
    response_format: gameTaggingResponseFormat,
    temperature: 0.15,
  });

  const parsed = response.choices[0].message.parsed as
    | GameTaggingResponse
    | null;
  const tags = parsed?.tags;

  if (!tags || tags.length === 0) {
    throw new Error(`OpenAI error for: ${rawgGame.name}`);
  }

  return normalizeAiTags(tags);
}
