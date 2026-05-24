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

function createRealTimeCombatMessages(game: {
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
You are validating whether the tag "real-time-combat" should be added to a video game.

A game should receive "real-time-combat" if:
- combat happens actively in real time
- timing/reactions/positioning matter
- combat is a central gameplay pillar
- gameplay heavily involves active combat systems

Examples:
- Dark Souls
- Elden Ring
- Devil May Cry
- Nioh
- Final Fantasy VII Rebirth
- Street Fighter 6
- Mortal Kombat 1
- Age of Mythology

DO NOT classify as real-time-combat if:
- combat is turn-based
- combat is minimal
- gameplay is mostly management/simulation
- gameplay is primarily puzzle/platforming
- gameplay is menu-driven

Very important:
Shooter gameplay alone is NOT enough.
The tag should represent meaningful active combat systems.
Pure FPS/TPS combat should usually NOT receive this tag.
Prioritize melee/action combat systems.

Return a score:
0.0 = definitely should NOT have real-time-combat
0.25 = weak fit
0.5 = partial/hybrid fit
0.75 = strong fit
1.0 = core gameplay identity

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

Should this game receive the "real-time-combat" tag?
      `.trim(),
    },
  ];
}

const validationSchema = {
  type: "json_schema",
  json_schema: {
    name: "real_time_combat_validation",
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

async function validateRealTimeCombat(game: {
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
    messages: createRealTimeCombatMessages(game),
    response_format: validationSchema,
    temperature: 0,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Empty AI response");
  }

  return JSON.parse(content) as ValidationResult;
}

function shouldAddRealTimeCombat(result: ValidationResult): boolean {
  return result.score >= 0.8 && result.confidence >= 0.8;
}

async function main() {
  console.log("Loading candidate games for real-time-combat enrichment...");

  const games = await prisma.game.findMany({
    where: {
      AND: [
        {
          tags: {
            none: {
              tag: {
                slug: "real-time-combat",
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
                    "action",
                    "arpg",
                    "hack-and-slash",
                    "souls-like",
                    "fighting",
                    "jrpg",
                    "rpg",
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
                    "turn-based",
                    "deckbuilder",
                    "city-builder",
                    "colony-management",
                    "factory-management",
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
      const ai = await validateRealTimeCombat({
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

        shouldAdd: shouldAddRealTimeCombat(ai),
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
    "real-time-combat-enrichment-results.json",
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
