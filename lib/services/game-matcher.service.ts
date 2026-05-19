import "server-only";

import type { GameDto } from "@/lib/dto/game.dto";
import type { GameMatchDto } from "@/lib/dto/game-match.dto";
import type { ShortTag } from "@/lib/dto/tag.dto";
import { toGameDto } from "@/lib/mappers/game.mapper";
import embeddings from "@/data/embeddings.json";
import prisma from "@/lib/prisma";
import { CATEGORY_WEIGHTS, TAGS_AS_OBJECT } from "@/consts/tags";

const SELECTED_GAME_TAG_WEIGHT = 1;
const ACTIVE_TAG_WEIGHT = 2;
const REPEATED_TAG_DECAY = 0.5;
const ULTRA_RARE_DAMPING_START = 2.5;
const ULTRA_RARE_DAMPING_CURVE = 0.55;
const TASTE_SOFTMAX_TEMPERATURE = 0.18;
const SPECIFIC_MATCH_SHARE = 0.15;
const MIN_TAG_RARITY = 0.15;
const MAX_TAG_RARITY = 4;
const MIN_GAMES_FOR_RARITY = 30;
const RARE_TAG_MIN_THRESHOLD = 2;
const TAG_COUNT_SMOOTHING = 2;
const SELECTED_GAME_SCORE_CURVE = 0.65;
const DEFAULT_CATEGORY_WEIGHT = 1;
const RESULTS_LIMIT = 80;
const SHARED_TRAITS_LIMIT = 6;
const CONFLICT_PENALTY_SHARE = 0.22;
const MISSING_ACTIVE_TAG_PENALTY_SHARE = 0.15;
const ACTIVE_ONLY_MISSING_ACTIVE_TAG_PENALTY_SHARE = 0.08;
const CANDIDATE_NOISE_PENALTY_SHARE = 0.05;
const ACTIVE_ONLY_CANDIDATE_NOISE_PENALTY_SHARE = 0.025;
const ACTIVE_ONLY_PRIMARY_MATCH_SHARE = 0.45;
const ACTIVE_ONLY_WEIGHTED_COVERAGE_SHARE = 0.25;
const ACTIVE_ONLY_MATCH_STRENGTH_SHARE = 0.15;
const ACTIVE_ONLY_COUNT_COVERAGE_SHARE = 0.1;
const ACTIVE_ONLY_FULL_MATCH_BONUS_SHARE = 0.05;
const EMBEDDING_THRESHOLD = 0.6;
const EMBEDDING_RELATION_SCALE = 0.5;
const PARTIAL_MATCH_SCALE = 0.7;
const MATCH_REASON_TITLE =
  "Matched on shared gameplay and atmosphere traits from your picks.";

const STRENGTH_WEIGHTS = {
  1: 0.45,
  2: 1,
  3: 1.8,
} as const;

const TAG_CONFLICTS: Record<string, readonly string[]> = {
  "fast-paced": ["slow-paced", "methodical"],
  "slow-paced": ["fast-paced", "high-reflex", "arcade"],
  methodical: ["fast-paced", "arcade"],
  "high-reflex": ["slow-paced", "relaxing", "cozy"],
  relaxing: ["tense", "scary", "competitive", "high-reflex"],
  chill: ["tense", "scary", "competitive"],
  cozy: ["tense", "scary", "competitive"],
  tense: ["relaxing", "chill", "cozy"],
  scary: ["relaxing", "chill", "cozy", "family-friendly"],
  casual: ["challenging", "competitive", "high-reflex"],
  challenging: ["casual", "relaxing"],
  competitive: ["relaxing", "chill", "cozy", "family-friendly"],
  "family-friendly": ["scary", "dark", "gothic"],
  linear: ["open-world", "sandbox"],
  "open-world": ["linear"],
  sandbox: ["linear"],
  singleplayer: ["online-pvp", "ranked", "moba", "battle-royale"],
  multiplayer: ["walking-simulator", "visual-novel"],
};

const TAG_RELATIONS: Record<string, Record<string, number>> = {
  // "boomer-shooter": {
  //   retro: 0.35,
  //   fps: 0.45,
  //   "fast-paced": 0.3,
  //   "dungeon-crawler": 0.2,
  //   fantasy: 0.25,
  //   magic: 0.25,
  // },
  // "dungeon-crawler": {
  //   exploration: 0.35,
  //   backtracking: 0.35,
  //   fantasy: 0.2,
  // },
  // magic: {
  //   fantasy: 0.3,
  //   "dark-fantasy": 0.2,
  // },
  // "dark-fantasy": {
  //   fantasy: 0.25,
  //   dark: 0.25,
  //   horror: 0.2,
  // },
  // "immersive-sim": {
  //   stealth: 0.35,
  //   exploration: 0.25,
  //   "choices-matter": 0.25,
  //   "first-person": 0.2,
  // },
};

type UserTagSignal = {
  tag: ShortTag;
  rarity: number;
  score: number;
  activeScore: number;
};

type TasteProfile = {
  signals: Map<string, UserTagSignal>;
};

type ProfileScoreBreakdown = {
  activeTagMatches: number;
  matchedSignals: UserTagSignal[];
  similarity: number;
};

type ScoredGame = GameDto & {
  activeTagMatches: number;
  similarity: number;
  matchReason: GameMatchDto["matchReason"];
};

const gameWithTagsInclude = {
  tags: {
    include: {
      tag: true,
    },
  },
} as const;

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function debugTagSimilarity(tagA: string, tagB: string) {
  const embeddingA = embeddings[tagA as keyof typeof embeddings];

  const embeddingB = embeddings[tagB as keyof typeof embeddings];

  if (!embeddingA || !embeddingB) {
    console.log("Missing embedding");
    return;
  }

  const similarity = cosineSimilarity(embeddingA, embeddingB);

  console.log({
    tagA,
    tagB,
    similarity,
  });
}

function getTagStrengthWeight(strength?: 1 | 2 | 3) {
  if (!strength) return 1;

  return STRENGTH_WEIGHTS[strength];
}


function getTagRelationScore(sourceSlug: string, targetSlug: string) {
  // exact manual relation ma priorytet
  const manual = TAG_RELATIONS[sourceSlug]?.[targetSlug];

  if (manual) {
    return manual;
  }

  const sourceEmbedding = embeddings[sourceSlug as keyof typeof embeddings];

  const targetEmbedding = embeddings[targetSlug as keyof typeof embeddings];

  if (!sourceEmbedding || !targetEmbedding) {
    return 0;
  }

  const similarity = cosineSimilarity(sourceEmbedding, targetEmbedding);

  if (similarity < EMBEDDING_THRESHOLD) {
    return 0;
  }

  return similarity * EMBEDDING_RELATION_SCALE;
}

function getTasteAggregationWeights(profileCount: number) {
  switch (profileCount) {
    case 1:
      return {
        top: 0.7,
        softmax: 0.2,
        average: 0.1,
      };

    case 2:
      return {
        top: 0.6,
        softmax: 0.3,
        average: 0.1,
      };

    case 3:
      return {
        top: 0.5,
        softmax: 0.35,
        average: 0.15,
      };

    default:
      return {
        top: 0.45,
        softmax: 0.4,
        average: 0.15,
      };
  }
}

function getActiveMatchShare(selectedGamesCount: number) {
  if (selectedGamesCount === 0) {
    return 1;
  }

  if (selectedGamesCount === 1) {
    return 0.12;
  }

  if (selectedGamesCount === 2) {
    return 0.08;
  }

  return 0.05;
}

const getTagCategoryWeight = (slug: string) => {
  const tag = TAGS_AS_OBJECT[slug];

  if (!tag) return DEFAULT_CATEGORY_WEIGHT;

  return CATEGORY_WEIGHTS[tag.category];
};

const getTagSignalWeight = (tag: ShortTag, totalGames: number) => {
  return (
    getTagRarity(tag.gamesCount, totalGames) *
    getTagCategoryWeight(tag.slug) *
    getTagStrengthWeight(tag.strength)
  );
};

const getDampenedTagRarity = (rarity: number) => {
  if (rarity <= ULTRA_RARE_DAMPING_START) return rarity;

  return (
    ULTRA_RARE_DAMPING_START +
    Math.pow(rarity - ULTRA_RARE_DAMPING_START, ULTRA_RARE_DAMPING_CURVE)
  );
};

const getSelectedGameTagSignalWeight = (tag: ShortTag, totalGames: number) => {
  const rarity = getTagRarity(tag.gamesCount, totalGames);

  return (
    getDampenedTagRarity(rarity) *
    getTagCategoryWeight(tag.slug) *
    getTagStrengthWeight(tag.strength)
  );
};

const getTagRarity = (count: number, totalGames: number) => {
  if (totalGames <= 0) return MIN_TAG_RARITY;
  if (totalGames < MIN_GAMES_FOR_RARITY) return 1;

  const normalizedCount = Math.min(Math.max(count, 0), totalGames);
  const rarity = Math.log(
    (totalGames + TAG_COUNT_SMOOTHING) /
      (normalizedCount + TAG_COUNT_SMOOTHING),
  );

  return Math.min(MAX_TAG_RARITY, Math.max(MIN_TAG_RARITY, rarity));
};

function applyAffinityBonuses(
  similarity: number,
  candidateGame: GameDto,
  selectedGames: GameDto[],
) {
  const selectedSeriesSlugs = new Set(
    selectedGames.map((game) => game.seriesSlug).filter(Boolean),
  );

  const selectedDeveloperSlugs = new Set(
    selectedGames.map((game) => game.developerSlug).filter(Boolean),
  );

  const hasSameSeries =
    candidateGame.seriesSlug &&
    selectedSeriesSlugs.has(candidateGame.seriesSlug);

  const hasSameDeveloper =
    candidateGame.developerSlug &&
    selectedDeveloperSlugs.has(candidateGame.developerSlug);

  if (hasSameSeries) {
    similarity += (1 - similarity) * 0.35;
  }

  if (similarity > 0.45 && hasSameDeveloper) {
    similarity += (1 - similarity) * 0.08;
  }

  return clampSimilarity(similarity);
}

function curveSimilarity(score: number) {
  return Math.pow(Math.min(Math.max(score, 0), 1), SELECTED_GAME_SCORE_CURVE);
}

function clampSimilarity(score: number) {
  return Math.min(Math.max(score, 0), 1);
}

function getCandidateMatchQuality(strength?: 1 | 2 | 3) {
  if (!strength) return 1;

  return 0.5 + getTagStrengthWeight(strength) / (2 * STRENGTH_WEIGHTS[3]);
}

function getSelectedGameProfile(game: GameDto, totalGames: number) {
  const profile = new Map<string, UserTagSignal>();
  const selectedTagOccurrences = new Map<string, number>();

  const tagWeights = game.tags.map((tag) => ({
    tag,
    rarity: getTagRarity(tag.gamesCount, totalGames),
    weight: getSelectedGameTagSignalWeight(tag, totalGames),
  }));

  const gameWeightTotal = tagWeights.reduce(
    (total, tagWeight) => total + tagWeight.weight,
    0,
  );

  if (gameWeightTotal === 0) return profile;

  for (const tagWeight of tagWeights) {
    const occurrence =
      (selectedTagOccurrences.get(tagWeight.tag.slug) ?? 0) + 1;
    const repeatedTagWeight = 1 / Math.pow(occurrence, REPEATED_TAG_DECAY);
    const score =
      (tagWeight.weight / gameWeightTotal) *
      SELECTED_GAME_TAG_WEIGHT *
      repeatedTagWeight;
    const existing = profile.get(tagWeight.tag.slug);

    selectedTagOccurrences.set(tagWeight.tag.slug, occurrence);
    profile.set(tagWeight.tag.slug, {
      tag: tagWeight.tag,
      rarity: tagWeight.rarity,
      score: (existing?.score ?? 0) + score,
      activeScore: 0,
    });
  }

  return profile;
}

function getTasteProfiles(selectedGames: GameDto[], totalGames: number) {
  return selectedGames
    .map((game) => ({
      signals: getSelectedGameProfile(game, totalGames),
    }))
    .filter((profile) => profile.signals.size > 0);
}

function getActiveTagsProfile(activeTags: ShortTag[], totalGames: number) {
  const profile = new Map<string, UserTagSignal>();

  for (const tag of activeTags) {
    const rarity = getTagRarity(tag.gamesCount, totalGames);
    const score = rarity * getTagCategoryWeight(tag.slug) * ACTIVE_TAG_WEIGHT;
    const existing = profile.get(tag.slug);

    profile.set(tag.slug, {
      tag,
      rarity,
      score: (existing?.score ?? 0) + score,
      activeScore: (existing?.activeScore ?? 0) + score,
    });
  }

  return profile;
}

function getProfileRareTagThreshold(profiles: Map<string, UserTagSignal>[]) {
  const rarities = profiles
    .flatMap((profile) => Array.from(profile.values()))
    .map((signal) => signal.rarity)
    .toSorted((a, b) => a - b);

  if (rarities.length === 0) return MAX_TAG_RARITY;

  const upperQuartileIndex = Math.floor(rarities.length * 0.75);

  return Math.max(
    RARE_TAG_MIN_THRESHOLD,
    rarities[Math.min(upperQuartileIndex, rarities.length - 1)],
  );
}

function getConflictPenalty(
  userProfile: Map<string, UserTagSignal>,
  gameTagsMap: Map<string, ShortTag>,
  profileTotal: number,
) {
  if (profileTotal === 0) return 0;

  let conflictScore = 0;

  for (const signal of userProfile.values()) {
    const conflictingSlugs = TAG_CONFLICTS[signal.tag.slug];
    if (!conflictingSlugs) continue;

    const strongestConflict = conflictingSlugs.reduce((max, slug) => {
      const tag = gameTagsMap.get(slug);

      return tag ? Math.max(max, getTagStrengthWeight(tag.strength)) : max;
    }, 0);

    if (strongestConflict > 0) {
      conflictScore += signal.score * strongestConflict;
    }
  }

  return clampSimilarity(conflictScore / profileTotal) * CONFLICT_PENALTY_SHARE;
}

function getMissingActiveTagPenalty(
  activeTags: ShortTag[],
  activeTagMatches: number,
) {
  if (activeTags.length === 0) return 0;

  const missingShare = 1 - activeTagMatches / activeTags.length;

  return missingShare * MISSING_ACTIVE_TAG_PENALTY_SHARE;
}

function getCandidateNoisePenalty(
  game: GameDto,
  userProfile: Map<string, UserTagSignal>,
  matchedSignals: UserTagSignal[],
  totalGames: number,
) {
  if (matchedSignals.length === 0) return 0;

  const weights = game.tags.reduce(
    (acc, tag) => {
      const weight = getTagSignalWeight(tag, totalGames);

      return {
        total: acc.total + weight,
        unmatched: userProfile.has(tag.slug)
          ? acc.unmatched
          : acc.unmatched + weight,
      };
    },
    { total: 0, unmatched: 0 },
  );

  if (weights.total === 0) return 0;

  return (weights.unmatched / weights.total) * CANDIDATE_NOISE_PENALTY_SHARE;
}

function getStrongestActiveTagCoverage(
  userProfile: Map<string, UserTagSignal>,
  matchedSignals: UserTagSignal[],
) {
  const strongestActiveScore = Array.from(userProfile.values()).reduce(
    (max, signal) => Math.max(max, signal.activeScore),
    0,
  );

  if (strongestActiveScore === 0) return 0;

  const strongestMatchedActiveScore = matchedSignals.reduce(
    (max, signal) => Math.max(max, signal.activeScore),
    0,
  );

  return strongestMatchedActiveScore / strongestActiveScore;
}

function getProfileMatchBreakdown(
  game: GameDto,
  userProfile: Map<string, UserTagSignal>,
  rareTagThreshold: number,
  totalGames: number,
): ProfileScoreBreakdown {
  let profileTotal = 0;
  let matchedProfileScore = 0;
  let rareProfileTotal = 0;
  let matchedRareProfileScore = 0;

  const matchedSignals: UserTagSignal[] = [];
  const gameTagsMap = new Map(game.tags.map((tag) => [tag.slug, tag]));

  for (const signal of userProfile.values()) {
    profileTotal += signal.score;

    if (signal.rarity >= rareTagThreshold) {
      rareProfileTotal += signal.score;
    }
    const matchedTag = gameTagsMap.get(signal.tag.slug);

    if (matchedTag) {
      matchedSignals.push(signal);

      const candidateMatchQuality = getCandidateMatchQuality(
        matchedTag.strength,
      );

      const weightedMatchScore = signal.score * candidateMatchQuality;

      matchedProfileScore += weightedMatchScore;

      if (signal.rarity >= rareTagThreshold) {
        matchedRareProfileScore += signal.score;
      }
    } else {
      let bestRelationScore = 0;

      for (const candidateTag of game.tags) {
        const relationScore = getTagRelationScore(
          signal.tag.slug,
          candidateTag.slug,
        );

        if (relationScore <= 0) continue;

        const candidateStrength = getTagStrengthWeight(candidateTag.strength);

        const partialScore =
          relationScore * candidateStrength * PARTIAL_MATCH_SCALE;

        bestRelationScore = Math.max(bestRelationScore, partialScore);
      }

      if (bestRelationScore > 0) {
        matchedProfileScore += signal.score * bestRelationScore;

        if (signal.rarity >= rareTagThreshold) {
          matchedRareProfileScore += signal.score * bestRelationScore;
        }
      }
    }
  }

  if (profileTotal === 0) {
    return {
      activeTagMatches: 0,
      matchedSignals,
      similarity: 0,
    };
  }

  const profileCoverage = Math.min(1, matchedProfileScore / profileTotal);
  const hasRareProfileSignals = rareProfileTotal > 0;
  const rareTagCoverage = hasRareProfileSignals
    ? matchedRareProfileScore / rareProfileTotal
    : 0;
  const conflictPenalty = getConflictPenalty(
    userProfile,
    gameTagsMap,
    profileTotal,
  );
  const candidateNoisePenalty = getCandidateNoisePenalty(
    game,
    userProfile,
    matchedSignals,
    totalGames,
  );
  const specificMatchShare = hasRareProfileSignals ? SPECIFIC_MATCH_SHARE : 0;
  const baseShare = 1 - specificMatchShare;
  const similarity =
    profileCoverage * baseShare +
    rareTagCoverage * specificMatchShare -
    conflictPenalty -
    candidateNoisePenalty;

  return {
    activeTagMatches: 0,
    matchedSignals,
    similarity: clampSimilarity(similarity),
  };
}

function getActiveProfileBreakdown(
  game: GameDto,
  activeProfile: Map<string, UserTagSignal>,
  activeTags: ShortTag[],
  totalGames: number,
): ProfileScoreBreakdown {
  let activeTotal = 0;
  let matchedActiveScore = 0;
  let matchedActiveStrengthScore = 0;

  const matchedSignals: UserTagSignal[] = [];
  const gameTagsMap = new Map(game.tags.map((tag) => [tag.slug, tag]));

  for (const signal of activeProfile.values()) {
    activeTotal += signal.activeScore;

    const matchedTag = gameTagsMap.get(signal.tag.slug);

    if (matchedTag) {
      matchedSignals.push(signal);

      matchedActiveScore += signal.activeScore;

      matchedActiveStrengthScore +=
        signal.activeScore * getTagStrengthWeight(matchedTag.strength);
    } else {
      let bestRelationScore = 0;

      for (const candidateTag of game.tags) {
        const relationScore = getTagRelationScore(
          signal.tag.slug,
          candidateTag.slug,
        );

        if (relationScore <= 0) {
          continue;
        }

        const candidateStrength = getTagStrengthWeight(candidateTag.strength);

        const partialScore =
          relationScore * candidateStrength * PARTIAL_MATCH_SCALE;

        bestRelationScore = Math.max(bestRelationScore, partialScore);
      }

      if (bestRelationScore > 0) {
        matchedSignals.push(signal);

        matchedActiveScore += signal.activeScore * bestRelationScore;

        matchedActiveStrengthScore += signal.activeScore * bestRelationScore;
      }
    }

  }

  if (activeTotal === 0) {
    return {
      activeTagMatches: 0,
      matchedSignals,
      similarity: 0,
    };
  }

  const activeCoverage = matchedActiveScore / activeTotal;
  const activeStrengthCoverage =
    matchedActiveStrengthScore / (activeTotal * STRENGTH_WEIGHTS[3]);
  const activeTagMatches = getActiveTagMatchCount(game, activeTags);
  const activeCountCoverage = activeTagMatches / activeTags.length;
  const fullActiveMatch = activeTagMatches === activeTags.length;
  const strongestActiveTagCoverage = getStrongestActiveTagCoverage(
    activeProfile,
    matchedSignals,
  );
  const conflictPenalty = getConflictPenalty(
    activeProfile,
    gameTagsMap,
    activeTotal,
  );
  const missingActiveTagPenalty =
    getMissingActiveTagPenalty(activeTags, activeTagMatches) *
    (ACTIVE_ONLY_MISSING_ACTIVE_TAG_PENALTY_SHARE /
      MISSING_ACTIVE_TAG_PENALTY_SHARE);
  const candidateNoisePenalty =
    getCandidateNoisePenalty(game, activeProfile, matchedSignals, totalGames) *
    (ACTIVE_ONLY_CANDIDATE_NOISE_PENALTY_SHARE / CANDIDATE_NOISE_PENALTY_SHARE);
  const similarity =
    strongestActiveTagCoverage * ACTIVE_ONLY_PRIMARY_MATCH_SHARE +
    activeCoverage * ACTIVE_ONLY_WEIGHTED_COVERAGE_SHARE +
    activeStrengthCoverage * ACTIVE_ONLY_MATCH_STRENGTH_SHARE +
    activeCountCoverage * ACTIVE_ONLY_COUNT_COVERAGE_SHARE +
    (fullActiveMatch ? ACTIVE_ONLY_FULL_MATCH_BONUS_SHARE : 0) -
    conflictPenalty -
    candidateNoisePenalty -
    missingActiveTagPenalty;

  return {
    activeTagMatches,
    matchedSignals,
    similarity: clampSimilarity(similarity),
  };
}

function aggregateTasteSimilarities(similarities: number[]) {
  if (similarities.length === 0) return 0;

  const strongestMatch = Math.max(...similarities);
  const averageMatch =
    similarities.reduce((total, similarity) => total + similarity, 0) /
    similarities.length;
  const softmaxWeights = similarities.map((similarity) =>
    Math.exp((similarity - strongestMatch) / TASTE_SOFTMAX_TEMPERATURE),
  );
  const softmaxTotal = softmaxWeights.reduce(
    (total, weight) => total + weight,
    0,
  );
  const softmaxMatch =
    softmaxTotal > 0
      ? similarities.reduce(
          (total, similarity, index) =>
            total + similarity * softmaxWeights[index],
          0,
        ) / softmaxTotal
      : strongestMatch;
  const weights = getTasteAggregationWeights(similarities.length);

  return (
    strongestMatch * weights.top +
    softmaxMatch * weights.softmax +
    averageMatch * weights.average
  );
  // return (
  //   strongestMatch * TASTE_TOP_MATCH_SHARE +
  //   softmaxMatch * TASTE_SOFTMAX_MATCH_SHARE +
  //   averageMatch * TASTE_AVERAGE_MATCH_SHARE
  // );
}

function mergeMatchedSignals(...signalGroups: UserTagSignal[][]) {
  const signalsBySlug = new Map<string, UserTagSignal>();

  for (const signal of signalGroups.flat()) {
    const existing = signalsBySlug.get(signal.tag.slug);

    if (
      !existing ||
      signal.score + signal.activeScore > existing.score + existing.activeScore
    ) {
      signalsBySlug.set(signal.tag.slug, signal);
    }
  }

  return Array.from(signalsBySlug.values());
}

function getScoreBreakdown(
  game: GameDto,
  tasteProfiles: TasteProfile[],
  activeProfile: Map<string, UserTagSignal>,
  activeTags: ShortTag[],
  rareTagThreshold: number,
  totalGames: number,
): ProfileScoreBreakdown {
  const activeBreakdown = getActiveProfileBreakdown(
    game,
    activeProfile,
    activeTags,
    totalGames,
  );

  if (tasteProfiles.length === 0) {
    return {
      ...activeBreakdown,
      similarity: curveSimilarity(activeBreakdown.similarity),
    };
  }

  const tasteBreakdowns = tasteProfiles.map((profile) =>
    getProfileMatchBreakdown(
      game,
      profile.signals,
      rareTagThreshold,
      totalGames,
    ),
  );
  const bestTasteBreakdown = tasteBreakdowns.reduce(
    (best, breakdown) =>
      breakdown.similarity > best.similarity ? breakdown : best,
    tasteBreakdowns[0],
  );
  const tasteSimilarity = aggregateTasteSimilarities(
    tasteBreakdowns.map((breakdown) => breakdown.similarity),
  );
  const activeTagPenalty = getMissingActiveTagPenalty(
    activeTags,
    activeBreakdown.activeTagMatches,
  );
  const hasActiveTags = activeTags.length > 0;
  const activeMatchShare = getActiveMatchShare(tasteProfiles.length);
  const similarity =
    tasteSimilarity * (hasActiveTags ? 1 - activeMatchShare : 1) +
    activeBreakdown.similarity * (hasActiveTags ? activeMatchShare : 0) -
    activeTagPenalty;

  return {
    activeTagMatches: activeBreakdown.activeTagMatches,
    matchedSignals: mergeMatchedSignals(
      bestTasteBreakdown.matchedSignals,
      activeBreakdown.matchedSignals,
    ),
    similarity: curveSimilarity(similarity),
  };
}

function getActiveTagMatchCount(game: GameDto, activeTags: ShortTag[]) {
  if (activeTags.length === 0) return 0;

  const gameTagSlugs = new Set(game.tags.map((tag) => tag.slug));

  return activeTags.filter((tag) => gameTagSlugs.has(tag.slug)).length;
}

function getSharedTraits(matchedSignals: UserTagSignal[], totalGames: number) {
  return matchedSignals
    .toSorted((a, b) => {
      if (b.activeScore !== a.activeScore) {
        return b.activeScore - a.activeScore;
      }

      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return (
        getTagSignalWeight(b.tag, totalGames) -
        getTagSignalWeight(a.tag, totalGames)
      );
    })
    .slice(0, SHARED_TRAITS_LIMIT)
    .map((signal) => signal.tag);
}

async function getCandidateGames(tagSlugs: string[], selectedGames: GameDto[]) {
  const excludedSlugs = selectedGames.map((game) => game.slug);
  const baseWhere = {
    slug: {
      notIn: excludedSlugs,
    },
  };

  const tagMatchGames =
    tagSlugs.length > 0
      ? await prisma.game.findMany({
          where: {
            ...baseWhere,
            tags: {
              some: {
                tag: {
                  slug: {
                    in: tagSlugs,
                  },
                },
              },
            },
          },
          include: gameWithTagsInclude,
        })
      : [];

  return Array.from(
    new Map([...tagMatchGames].map((game) => [game.slug, game])).values(),
  );
}

function toGameMatchDto(game: ScoredGame): GameMatchDto {
  return {
    id: game.id,
    rawgId: game.rawgId,
    name: game.name,
    slug: game.slug,
    description: game.description,
    image: game.image,
    metacritic: game.metacritic,
    rating: game.rating,
    added: game.added,
    platforms: game.platforms,
    released: game.released,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
    tags: game.tags,
    similarity: game.similarity,
    matchReason: game.matchReason,
    developerSlug: game.developerSlug,
    developerName: game.developerName,
    developerGamesCount: game.developerGamesCount,
    seriesName: game.seriesName,
    seriesSlug: game.seriesSlug,
  };
}

export async function findMatchingGames(
  selectedGames: GameDto[],
  activeTags: ShortTag[],
) {
  const tagSlugSet = new Set<string>([
    ...selectedGames.flatMap((game) => game.tags).map((tag) => tag.slug),
    ...activeTags.map((tag) => tag.slug),
  ]);
  const tagSlugs = Array.from(tagSlugSet);
  const [games, totalGames] = await Promise.all([
    getCandidateGames(tagSlugs, selectedGames),
    prisma.game.count(),
  ]);
  const tasteProfiles = getTasteProfiles(selectedGames, totalGames);
  const activeProfile = getActiveTagsProfile(activeTags, totalGames);
  const rareTagThreshold = getProfileRareTagThreshold([
    ...tasteProfiles.map((profile) => profile.signals),
    activeProfile,
  ]);

  return games
    .map((game) => {
      const dto = toGameDto(game);
      const breakdown = getScoreBreakdown(
        dto,
        tasteProfiles,
        activeProfile,
        activeTags,
        rareTagThreshold,
        totalGames,
      );

      const similarity = applyAffinityBonuses(
        breakdown.similarity,
        dto,
        selectedGames,
      );

      return {
        ...dto,
        activeTagMatches: breakdown.activeTagMatches,
        similarity: similarity,
        matchReason: {
          title: MATCH_REASON_TITLE,
          tags: getSharedTraits(breakdown.matchedSignals, totalGames),
        },
      };
    })
    .sort((a, b) => {
      const similarityDiff =
        Math.round(b.similarity * 100) - Math.round(a.similarity * 100);

      if (similarityDiff !== 0) {
        return similarityDiff;
      }

      const metacriticDiff = (b.metacritic ?? 0) - (a.metacritic ?? 0);

      if (metacriticDiff !== 0) {
        return metacriticDiff;
      }

      if (b.activeTagMatches !== a.activeTagMatches) {
        return b.activeTagMatches - a.activeTagMatches;
      }

      return (b.added ?? 0) - (a.added ?? 0);
    })
    .filter((g) => g.similarity > 0.1)
    .slice(0, RESULTS_LIMIT)
    .map(toGameMatchDto);
}
