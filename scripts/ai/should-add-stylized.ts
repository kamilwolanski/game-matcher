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

function createStylizedMessages(
  game: {
    name: string;
    description: string | null;
    tags: {
      slug: string;
      name: string;
      strength: number;
    }[];
  },
) {
  return [
    {
      role: "system" as const,
      content: `
You are validating whether the tag "stylized" should be added to a video game.

A game should receive "stylized" if:
- it has a strong intentional visual style
- visuals are highly artistic, exaggerated, distinctive, or non-realistic
- art direction is a major identity of the game
- the visuals are memorable because of their style

Examples:
- Hades
- Cuphead
- Borderlands
- Journey
- Persona 5
- Okami
- Hi-Fi Rush
- Guilty Gear Strive

Games can be stylized through:
- cel shading
- painterly visuals
- cartoon visuals
- anime aesthetics
- surreal art direction
- heavy visual abstraction
- strong color identity

DO NOT add "stylized" if:
- the game primarily aims for realism
- visuals are generic realistic AAA graphics
- art direction is not a major identity

Return a score:
0.0 = definitely not stylized
0.25 = weak stylization
0.5 = moderate stylization
0.75 = strong stylization
1.0 = visual style is a core identity

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
  .map(
    (t) =>
      `- ${t.name} (${t.slug}) strength=${t.strength}`,
  )
  .join("\n")}

Description:
${game.description ?? "No description"}

Should this game receive the "stylized" tag?
      `.trim(),
    },
  ];
}

const validationSchema = {
  type: "json_schema",
  json_schema: {
    name: "stylized_validation",
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

async function validateStylized(
  game: {
    name: string;
    description: string | null;
    tags: {
      slug: string;
      name: string;
      strength: number;
    }[];
  },
): Promise<ValidationResult> {
  const response = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: createStylizedMessages(game),
    response_format: validationSchema,
    temperature: 0,
  });

  const content =
    response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Empty AI response");
  }

  return JSON.parse(content) as ValidationResult;
}

function shouldAddStylized(
  result: ValidationResult,
): boolean {
  return (
    result.score >= 0.8 &&
    result.confidence >= 0.8
  );
}

async function main() {
  console.log(
    "Loading candidate games for stylized enrichment...",
  );

  const games = await prisma.game.findMany({
    where: {
      AND: [
        {
          tags: {
            none: {
              tag: {
                slug: "stylized",
              },
            },
          },
        },

        // likely stylized indicators
        {
          tags: {
            some: {
              tag: {
                slug: {
                  in: [
                    "anime",
                    "pixel-art",
                    "surreal",
                    "fantasy",
                    "platformer",
                    "jrpg",
                    "arcade",
                    "fighting",
                    "visual-novel",
                    "sideview",
                    "cartoon",
                    "stylish",
                  ],
                },
              },
            },
          },
        },

        // avoid ultra realistic simulation/sports noise
        {
          tags: {
            none: {
              tag: {
                slug: {
                  in: [
                    "sports",
                    "simulation",
                    "military",
                    "real-world",
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
      const ai = await validateStylized({
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

        shouldAdd:
          shouldAddStylized(ai),
      };

      output.push(item);

      console.log({
        game: game.name,
        score: ai.score,
        confidence: ai.confidence,
        shouldAdd: item.shouldAdd,
      });
    } catch (error) {
      console.error(
        `Failed for game: ${game.name}`,
        error,
      );
    }
  }

  const outputPath = path.join(
    process.cwd(),
    "stylized-enrichment-results.json",
  );

  await fs.writeFile(
    outputPath,
    JSON.stringify(output, null, 2),
    "utf-8",
  );

  console.log(`Saved results to: ${outputPath}`);

  const addCount = output.filter(
    (x) => x.shouldAdd,
  ).length;

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