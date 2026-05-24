import fs from "node:fs/promises";
import path from "node:path";

import OpenAI from "openai";
import prisma from "@/lib/prisma";

const client = new OpenAI();

const OPENAI_MODEL = "gpt-5.4-mini";

type ValidationResult = {
  score: number;
  confidence: number;
  reasoning: string;
};

type OutputItem = {
  gameId: number;
  rawgId: number;
  name: string;
  slug: string;

  battleRoyaleStrength: number;

  existingTags: {
    slug: string;
    strength: number;
  }[];

  ai: ValidationResult;

  shouldRemove: boolean;
};

function createBattleRoyaleValidationMessages(game: {
  name: string;
  description: string | null;
  tags: {
    slug: string;
    name: string;
    strength: number;
  }[];
}) {
  return [
    {
      role: "system" as const,
      content: `
You are validating whether the tag "battle-royale" actually fits a video game.

A battle royale game usually includes:
- many players competing in one match
- last-player-standing gameplay
- shrinking play zone
- elimination-based match structure
- PvP survival combat
- match-based multiplayer sessions

Examples:
- Fortnite
- PUBG
- Apex Legends
- Warzone

DO NOT classify a game as battle royale if it only has:
- combat
- arenas
- fighting
- action gameplay
- multiplayer
- survival
- tournaments
- side modes

Very important:
Many action games contain combat or PvP without being battle royale.

Return a score:
0.0 = definitely not battle royale
0.25 = tiny/minor BR elements
0.5 = hybrid/mixed BR systems
0.75 = strong BR identity
1.0 = core battle royale game

Be conservative.
If uncertain, prefer LOWER scores.
      `.trim(),
    },
    {
      role: "user" as const,
      content: `
Game: ${game.name}

Current Tags:
${game.tags
  .map((t) => `- ${t.name} (${t.slug}) strength=${t.strength}`)
  .join("\n")}

Description:
${game.description ?? "No description"}

Does the "battle-royale" tag fit this game?
      `.trim(),
    },
  ];
}

const validationSchema = {
  type: "json_schema",
  json_schema: {
    name: "battle_royale_validation",
    strict: true,
    schema: {
      type: "object",
      properties: {
        score: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
        confidence: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
        reasoning: {
          type: "string",
        },
      },
      required: ["score", "confidence", "reasoning"],
      additionalProperties: false,
    },
  },
} as const;

async function validateBattleRoyaleTag(game: {
  name: string;
  description: string | null;
  tags: {
    slug: string;
    name: string;
    strength: number;
  }[];
}): Promise<ValidationResult> {
  const response = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: createBattleRoyaleValidationMessages(game),
    response_format: validationSchema,
    temperature: 0,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Empty AI response");
  }

  return JSON.parse(content) as ValidationResult;
}

function shouldRemoveBattleRoyaleTag(result: ValidationResult): boolean {
  return result.score <= 0.1 && result.confidence >= 0.9;
}

async function main() {
  console.log("Loading games with battle-royale tag...");

  const games = await prisma.game.findMany({
    where: {
      tags: {
        some: {
          tag: {
            slug: "battle-royale",
          },
        },
      },
    },

    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },

    orderBy: {
      id: "asc",
    },
  });

  console.log(`Found ${games.length} games`);

  const output: OutputItem[] = [];

  for (const game of games) {
    console.log(`Checking: ${game.name}`);

    const mappedTags = game.tags.map((t) => ({
      slug: t.tag.slug,
      name: t.tag.name,
      strength: t.strength,
    }));

    const battleRoyaleTag = mappedTags.find((t) => t.slug === "battle-royale");

    if (!battleRoyaleTag) {
      continue;
    }

    try {
      const ai = await validateBattleRoyaleTag({
        name: game.name,
        description: game.description,
        tags: mappedTags,
      });

      const item: OutputItem = {
        gameId: game.id,
        rawgId: game.rawgId,
        name: game.name,
        slug: game.slug,

        battleRoyaleStrength: battleRoyaleTag.strength,

        existingTags: mappedTags.map((t) => ({
          slug: t.slug,
          strength: t.strength,
        })),

        ai,

        shouldRemove: shouldRemoveBattleRoyaleTag(ai),
      };

      output.push(item);

      console.log({
        game: game.name,
        score: ai.score,
        confidence: ai.confidence,
        shouldRemove: item.shouldRemove,
      });
    } catch (error) {
      console.error(`Failed for game: ${game.name}`, error);
    }
  }

  const outputPath = path.join(
    process.cwd(),
    "battle-royale-validation-results.json",
  );

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`Saved results to: ${outputPath}`);

  const removeCount = output.filter((x) => x.shouldRemove).length;

  console.log({
    total: output.length,
    shouldRemove: removeCount,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
