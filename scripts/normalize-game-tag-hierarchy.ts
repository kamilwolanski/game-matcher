import prisma from "@/lib/prisma";

type Strength = 1 | 2 | 3;

type RawAiTag = {
  slug: string;
  strength: Strength;
};



const MAX_STRENGTH: Partial<Record<string, Strength>> = {
  singleplayer: 2,
  multiplayer: 2,
  historical: 2,
  adventure: 2,
};

function normalizeTags(tags: RawAiTag[]): RawAiTag[] {
  const tagMap = new Map(tags.map((tag) => [tag.slug, { ...tag }]));

  const get = (slug: string) => tagMap.get(slug);

  const has = (slug: string) => tagMap.has(slug);

  const remove = (slug: string) => {
    tagMap.delete(slug);
  };

  const lower = (slug: string, amount = 1) => {
    const tag = get(slug);

    if (!tag) return;

    tag.strength = Math.max(1, tag.strength - amount) as Strength;
  };

  const ensure = (slug: string, strength: Strength) => {
    const existing = get(slug);

    if (!existing) {
      tagMap.set(slug, {
        slug,
        strength,
      });

      return;
    }

    existing.strength = Math.max(existing.strength, strength) as Strength;
  };

  // =====================================================
  // Required parent / related tags
  // =====================================================

  if (has("fps")) {
    ensure("first-person", 2);
  }

  if (has("tps")) {
    ensure("third-person", 2);
  }

  if (has("grand-strategy")) {
    ensure("strategy", 2);
  }

  if (has("tactical-shooter")) {
    ensure("shooter", 2);
  }

  if (has("survival-horror")) {
    ensure("horror", 2);
  }

  // =====================================================
  // Invalid / conflicting combinations
  // =====================================================

  if (has("mmo")) {
    remove("singleplayer");
  }

  if (has("metroidvania")) {
    remove("linear");
  }

  if (has("simulation")) {
    lower("arcade");
  }

  if (has("realistic")) {
    lower("arcade");
  }

  if (has("survival-horror")) {
    lower("cozy");
    lower("relaxing");
  }

  // =====================================================
  // Strength caps
  // =====================================================

  for (const [slug, maxStrength] of Object.entries(MAX_STRENGTH)) {
    const tag = get(slug);

    if (!tag) continue;

    if (maxStrength !== undefined && tag.strength > maxStrength) {
      tag.strength = maxStrength;
    }
  }

  // =====================================================
  // Mood balancing
  // =====================================================

  const moodTags = [
    "cozy",
    "funny",
    "relaxing",
    "emotional",
    "philosophical",
    "scary",
    "tense",
  ];

  const strongMoodTags = moodTags
    .map((slug) => get(slug))
    .filter((tag): tag is RawAiTag => !!tag && tag.strength === 3);

  if (strongMoodTags.length > 1) {
    const [, ...secondaryMoods] = strongMoodTags;

    for (const tag of secondaryMoods) {
      lower(tag.slug);
    }
  }

  // =====================================================
  // Limit amount of strength 3 tags
  // =====================================================

  const strength3Tags = Array.from(tagMap.values()).filter(
    (t) => t.strength === 3,
  );

  if (strength3Tags.length > 6) {
    const downgradePriority = [
      "singleplayer",
      "multiplayer",
      "historical",
      "fantasy",
      "sci-fi",
      "war",
      "adventure",
      "exploration",
    ];

    for (const slug of downgradePriority) {
      const tag = get(slug);

      if (tag?.strength === 3) {
        lower(slug);

        const updatedStrength3Count = Array.from(tagMap.values()).filter(
          (t) => t.strength === 3,
        ).length;

        if (updatedStrength3Count <= 6) {
          break;
        }
      }
    }
  }

  return Array.from(tagMap.values());
}

async function processGame(game: {
  id: number;
  name: string;
  tags: {
    strength: number;
    tagId: number;

    tag: {
      slug: string;
    };
  }[];
}) {
  try {
    console.log(`→ ${game.name}`);

    const normalized = normalizeTags(
      game.tags.map((t) => ({
        slug: t.tag.slug,
        strength: t.strength as Strength,
      })),
    );

    const normalizedMap = new Map(normalized.map((t) => [t.slug, t]));

    let changed = 0;

    for (const gameTag of game.tags) {
      const normalizedTag = normalizedMap.get(gameTag.tag.slug);

      if (!normalizedTag) continue;

      if (normalizedTag.strength !== gameTag.strength) {
        await prisma.gameTag.update({
          where: {
            gameId_tagId: {
              gameId: game.id,
              tagId: gameTag.tagId,
            },
          },

          data: {
            strength: normalizedTag.strength,
          },
        });

        changed++;

        console.log(
          `  ${gameTag.tag.slug}: ${gameTag.strength} -> ${normalizedTag.strength}`,
        );
      }
    }

    if (changed === 0) {
      console.log("  no changes");
    }
  } catch (error) {
    console.error(`✗ Failed: ${game.name}`);
    console.error(error);
  }
}

async function main() {
  console.log("=== NORMALIZE TAGS START ===");

  const games = await prisma.game.findMany({
    select: {
      id: true,
      name: true,

      tags: {
        select: {
          strength: true,
          tagId: true,

          tag: {
            select: {
              slug: true,
            },
          },
        },
      },
    },

    orderBy: {
      id: "asc",
    },
  });

  console.log(`Found ${games.length} games`);

  for (const game of games) {
    await processGame(game);
  }

  console.log("=== NORMALIZE TAGS FINISHED ===");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
