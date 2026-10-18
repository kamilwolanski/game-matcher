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

  targetTag: "cozy" | "relaxing";

  existingStrength: number | null;

  existingTags: {
    slug: string;
    strength: number;
  }[];

  ai: ValidationResult;

  suggestedStrength: number;
};

function createMessages(
  targetTag: "cozy" | "relaxing",
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
  const cozyPrompt = `
You are calibrating the strength of the "cozy" tag for a video game.

Your task is NOT to decide whether the game has cozy elements.

Your task is to determine:
How central is "cozy" to the game's identity and player experience?

Strength meaning:

3 = Defining cozy identity
The game is strongly associated with comfort, warmth, low stress, peaceful routines, wholesome atmosphere, or emotional safety.

2 = Strong cozy presence
Clearly cozy, but not the primary defining identity.

1 = Supporting cozy aspect
Some cozy elements exist, but they are secondary.

0 = Not meaningfully cozy

IMPORTANT:

* Cozy is an EXPERIENCE tag, not just an art style.
* Farming/crafting alone does NOT automatically mean cozy.
* Pixel art alone does NOT automatically mean cozy.
* Focus on emotional comfort and overall vibe.

Examples of cozy 3:

* Stardew Valley
* Animal Crossing
* Spiritfarer
* Unpacking

Examples of cozy 2:

* Minecraft
* Slime Rancher
* Disney Dreamlight Valley

Examples of cozy 1:

* Skyrim
* Pokemon Scarlet/Violet

Examples of cozy 0:

* Dark Souls
* Doom Eternal

Be selective with strength 3.
Only assign it if cozy is one of the strongest defining identities.
`;

  const relaxingPrompt = `
You are calibrating the strength of the "relaxing" tag for a video game.

Focus on:

* pacing
* stress level
* emotional pressure
* gameplay intensity
* comfort and flow state

Strength meaning:

3 = Relaxing is a defining experience pillar
2 = Strong relaxing presence
1 = Light relaxing qualities
0 = Not meaningfully relaxing

IMPORTANT:

* Relaxing does NOT necessarily mean cozy.
* A game can be cozy but stressful.
* A game can be relaxing but not cozy.

Examples of relaxing 3:

* Stardew Valley
* PowerWash Simulator
* Euro Truck Simulator 2

Examples of relaxing 2:

* Minecraft
* House Flipper
* No Man's Sky

Examples of relaxing 1:

* Skyrim
* Zelda: Breath of the Wild

Examples of relaxing 0:

* Sekiro
* Doom Eternal
* Dead Cells

Be conservative with strength 3.
`;

  return [
    {
      role: "system" as const,
      content: targetTag === "cozy" ? cozyPrompt.trim() : relaxingPrompt.trim(),
    },
    {
      role: "user" as const,
      content: `
Game: ${game.name}

Current Tags:
${game.tags.map((t) => `- ${t.name} (${t.slug}) strength=${t.strength}`).join("\n")}

Description:
${game.description ?? "No description"}

What should the strength of the "${targetTag}" tag be?

Return:

* score from 0 to 3
* confidence from 0 to 1
* reasoning
      `.trim(),
    },
  ];
}

const validationSchema = {
  type: "json_schema",
  json_schema: {
    name: "mood_strength_validation",
    strict: true,
    schema: {
      type: "object",
      properties: {
        score: {
          type: "number",
          minimum: 0,
          maximum: 3,
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

async function validateTagStrength(
  targetTag: "cozy" | "relaxing",
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
    messages: createMessages(targetTag, game),
    response_format: validationSchema,
    temperature: 0,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Empty AI response");
  }

  return JSON.parse(content) as ValidationResult;
}

function normalizeStrength(score: number): number {
  if (score >= 2.5) return 3;
  if (score >= 1.5) return 2;
  if (score >= 0.5) return 1;

  return 0;
}

async function main() {
  console.log("Loading cozy/relaxing games...");

  const games = await prisma.game.findMany({
    where: {
      tags: {
        some: {
          tag: {
            slug: {
              in: ["cozy", "relaxing"],
            },
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
    const mappedTags = game.tags.map((t) => ({
      slug: t.tag.slug,
      name: t.tag.name,
      strength: t.strength,
    }));

    for (const targetTag of ["cozy", "relaxing"] as const) {
      const existingTag = mappedTags.find((t) => t.slug === targetTag);

      if (!existingTag) {
        continue;
      }

      console.log(`Checking ${targetTag}: ${game.name}`);

      try {
        const ai = await validateTagStrength(targetTag, {
          name: game.name,
          description: game.description,
          tags: mappedTags,
        });

        const suggestedStrength = normalizeStrength(ai.score);

        output.push({
          gameId: game.id,
          rawgId: game.rawgId,
          name: game.name,
          slug: game.slug,

          targetTag,

          existingStrength: existingTag.strength,

          existingTags: mappedTags.map((t) => ({
            slug: t.slug,
            strength: t.strength,
          })),

          ai,

          suggestedStrength,
        });

        console.log({
          game: game.name,
          targetTag,
          existing: existingTag.strength,
          suggested: suggestedStrength,
          confidence: ai.confidence,
        });
      } catch (error) {
        console.error(`Failed for ${targetTag}: ${game.name}`, error);
      }
    }
  }

  const outputPath = path.join(
    process.cwd(),
    "cozy-relaxing-strength-results.json",
  );

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`Saved results to: ${outputPath}`);

  console.log({
    total: output.length,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
