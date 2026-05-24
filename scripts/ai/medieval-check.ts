import fs from "node:fs/promises";
import path from "node:path";

import OpenAI from "openai";
import prisma from "@/lib/prisma";

const client = new OpenAI();

const OPENAI_MODEL = "gpt-5.4-mini";

type MedievalValidationResult = {
  score: number;
  confidence: number;
  reasoning: string;
};

type OutputItem = {
  gameId: number;
  rawgId: number;
  name: string;
  slug: string;

  medievalStrength: number;

  existingTags: {
    slug: string;
    strength: number;
  }[];

  ai: MedievalValidationResult;

  shouldRemove: boolean;
};

function createMedievalValidationMessages(game: {
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
You are validating whether the tag "medieval" actually fits a video game.

Your task:
Determine whether the game meaningfully contains medieval themes, aesthetics, setting, technology level, or fantasy identity.

A medieval game usually includes:
- swords
- knights
- castles
- feudal societies
- medieval fantasy
- low-tech worlds
- armor/shields/bows
- kingdoms

DO NOT classify as medieval if the game is:
- futuristic sci-fi
- modern military
- mech-based
- cyberpunk
- space-themed
- contemporary
- only dark/gritty

Very important:
Many games may contain combat or dark atmosphere without being medieval.

Return a score:
0.0 = definitely not medieval
0.25 = very weak medieval elements
0.5 = mixed/partial medieval influence
0.75 = strongly medieval-inspired
1.0 = core medieval identity

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

Does the "medieval" tag fit this game?
      `.trim(),
    },
  ];
}

const medievalValidationSchema = {
  type: "json_schema",
  json_schema: {
    name: "medieval_validation",
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

async function validateMedievalTag(game: {
  name: string;
  description: string | null;
  tags: {
    slug: string;
    name: string;
    strength: number;
  }[];
}): Promise<MedievalValidationResult> {
  const response = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: createMedievalValidationMessages(game),
    response_format: medievalValidationSchema,
    temperature: 0,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Empty AI response");
  }

  return JSON.parse(content) as MedievalValidationResult;
}

function shouldRemoveMedievalTag(result: MedievalValidationResult): boolean {
  return result.score <= 0.1 && result.confidence >= 0.9;
}

async function main() {
  console.log("Loading games with medieval tag...");

  const games = await prisma.game.findMany({
    where: {
      tags: {
        some: {
          tag: {
            slug: "medieval",
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

    const medievalTag = mappedTags.find((t) => t.slug === "medieval");

    if (!medievalTag) {
      continue;
    }

    try {
      const ai = await validateMedievalTag({
        name: game.name,
        description: game.description,
        tags: mappedTags,
      });

      const item: OutputItem = {
        gameId: game.id,
        rawgId: game.rawgId,
        name: game.name,
        slug: game.slug,

        medievalStrength: medievalTag.strength,

        existingTags: mappedTags.map((t) => ({
          slug: t.slug,
          strength: t.strength as number,
        })),

        ai,

        shouldRemove: shouldRemoveMedievalTag(ai),
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
    "medieval-validation-results.json",
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
