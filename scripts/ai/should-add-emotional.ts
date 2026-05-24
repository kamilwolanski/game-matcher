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

  existingTags: {
    slug: string;
    strength: number;
  }[];

  ai: ValidationResult;

  shouldAdd: boolean;
};

function createEmotionalMessages(game: {
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
You are validating whether the tag "emotional" should be added to a video game.

A game should receive "emotional" if emotional impact is a major part of the experience.

Examples of emotional experiences:
- sadness
- grief
- empathy
- emotional attachment
- melancholic atmosphere
- emotionally heavy storytelling
- emotionally moving character relationships

Examples of games that fit:
- To the Moon
- Spiritfarer
- OMORI
- What Remains of Edith Finch
- Life is Strange
- Before Your Eyes

Very important:
DO NOT add this tag simply because:
- the game has a story
- characters die
- the game is dramatic
- the game has cutscenes
- the game has cinematic presentation

The emotional impact must be a core identity of the game.

Return a score:
0.0 = definitely not emotional
0.25 = weak emotional elements
0.5 = moderate emotional identity
0.75 = strong emotional identity
1.0 = emotional impact is central to the experience

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

Should this game receive the "emotional" tag?
      `.trim(),
    },
  ];
}

const validationSchema = {
  type: "json_schema",
  json_schema: {
    name: "emotional_validation",
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

async function validateEmotional(game: {
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
    messages: createEmotionalMessages(game),
    response_format: validationSchema,
    temperature: 0,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Empty AI response");
  }

  return JSON.parse(content) as ValidationResult;
}

function shouldAddEmotional(result: ValidationResult): boolean {
  return result.score >= 0.8 && result.confidence >= 0.8;
}

async function main() {
  console.log("Loading candidate games for emotional enrichment...");

  const games = await prisma.game.findMany({
    where: {
      AND: [
        {
          tags: {
            none: {
              tag: {
                slug: "emotional",
              },
            },
          },
        },

        {
          tags: {
            some: {
              tag: {
                slug: {
                  in: [
                    "narrative-driven",
                    "philosophical",
                    "visual-novel",
                    "walking-simulator",
                    "romance",
                  ],
                },
              },
            },
          },
        },

        {
          tags: {
            none: {
              tag: {
                slug: {
                  in: [
                    "competitive",
                    "battle-royale",
                    "sports",
                    "racing",
                    "arcade",
                  ],
                },
              },
            },
          },
        },
      ],
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

    try {
      const ai = await validateEmotional({
        name: game.name,
        description: game.description,
        tags: mappedTags,
      });

      const item: OutputItem = {
        gameId: game.id,
        rawgId: game.rawgId,
        name: game.name,
        slug: game.slug,

        existingTags: mappedTags.map((t) => ({
          slug: t.slug,
          strength: t.strength,
        })),

        ai,

        shouldAdd: shouldAddEmotional(ai),
      };

      output.push(item);

      console.log({
        game: game.name,
        score: ai.score,
        confidence: ai.confidence,
        shouldAdd: item.shouldAdd,
      });
    } catch (error) {
      console.error(`Failed for game: ${game.name}`, error);
    }
  }

  const outputPath = path.join(
    process.cwd(),
    "emotional-enrichment-results.json",
  );

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`Saved results to: ${outputPath}`);

  const addCount = output.filter((x) => x.shouldAdd).length;

  console.log({
    total: output.length,
    shouldAdd: addCount,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
