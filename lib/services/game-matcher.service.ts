import "server-only";

import type { GameDto } from "@/lib/dto/game.dto";
import type { GameMatchDto } from "@/lib/dto/game-match.dto";
import type { ShortTag } from "@/lib/dto/tag.dto";
import { toGameDto } from "@/lib/mappers/game.mapper";
import prisma from "@/lib/prisma";
import { CATEGORY_WEIGHTS, TAGS_AS_OBJECT } from "@/consts/tags";

const SELECTED_GAME_TAG_WEIGHT = 1;
const ACTIVE_TAG_WEIGHT = 2;
const ACTIVE_MATCH_SHARE = 0.20;
const REPEATED_TAG_DECAY = 0.65;
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
const MISSING_ACTIVE_TAG_PENALTY_SHARE = 0.25;
const ACTIVE_ONLY_MISSING_ACTIVE_TAG_PENALTY_SHARE = 0.08;
const CANDIDATE_NOISE_PENALTY_SHARE = 0.10;
const ACTIVE_ONLY_CANDIDATE_NOISE_PENALTY_SHARE = 0.025;
const ACTIVE_ONLY_PRIMARY_MATCH_SHARE = 0.45;
const ACTIVE_ONLY_WEIGHTED_COVERAGE_SHARE = 0.25;
const ACTIVE_ONLY_MATCH_STRENGTH_SHARE = 0.15;
const ACTIVE_ONLY_COUNT_COVERAGE_SHARE = 0.10;
const ACTIVE_ONLY_FULL_MATCH_BONUS_SHARE = 0.05;
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

type UserTagSignal = {
  tag: ShortTag;
  rarity: number;
  score: number;
  activeScore: number;
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

function getTagStrengthWeight(strength?: 1 | 2 | 3) {
  if (!strength) return 1;

  return STRENGTH_WEIGHTS[strength];
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

function curveSimilarity(score: number) {
  return Math.pow(Math.min(Math.max(score, 0), 1), SELECTED_GAME_SCORE_CURVE);
}

function clampSimilarity(score: number) {
  return Math.min(Math.max(score, 0), 1);
}

function getUserProfile(
  selectedGames: GameDto[],
  activeTags: ShortTag[],
  totalGames: number, // 1389
) {
  const profile = new Map<string, UserTagSignal>();
  const selectedTagOccurrences = new Map<string, number>();

  for (const tag of selectedGames.flatMap((game) => game.tags)) {
    const occurrence = (selectedTagOccurrences.get(tag.slug) ?? 0) + 1; // 1

    const rarity = getTagRarity(tag.gamesCount, totalGames);

    const tagSignalWeight =
      rarity *
      getTagCategoryWeight(tag.slug) *
      getTagStrengthWeight(tag.strength); 

    const repeatedTagWeight =
      SELECTED_GAME_TAG_WEIGHT / Math.pow(occurrence, REPEATED_TAG_DECAY); 

    const score = tagSignalWeight * repeatedTagWeight; 

    const existing = profile.get(tag.slug);

    selectedTagOccurrences.set(tag.slug, occurrence);
    profile.set(tag.slug, {
      tag,
      rarity,
      score: (existing?.score ?? 0) + score,
      activeScore: existing?.activeScore ?? 0,
    });
  }

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

function getProfileRareTagThreshold(userProfile: Map<string, UserTagSignal>) {
  const rarities = Array.from(userProfile.values())
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

function getScoreBreakdown(
  game: GameDto,
  userProfile: Map<string, UserTagSignal>,
  activeTags: ShortTag[],
  hasSelectedGames: boolean,
  rareTagThreshold: number,
  totalGames: number,
) {
  let profileTotal = 0; // 15.339498328763304 + ...
  let matchedProfileScore = 0;
  let activeTotal = 0;
  let matchedActiveScore = 0;
  let matchedActiveStrengthScore = 0;
  let rareProfileTotal = 0; /// rpg rarity nie trafia
  let matchedRareProfileScore = 0;

  const matchedSignals: UserTagSignal[] = [];
  const gameTagsMap = new Map(game.tags.map((tag) => [tag.slug, tag]));

  for (const signal of userProfile.values()) {
    profileTotal += signal.score;
    activeTotal += signal.activeScore;

    if (signal.rarity >= rareTagThreshold) {
      rareProfileTotal += signal.score;
    }
    const matchedTag = gameTagsMap.get(signal.tag.slug);
    if (matchedTag) {
      matchedSignals.push(signal);

      const candidateStrengthWeight = getTagStrengthWeight(matchedTag.strength);

      const weightedMatchScore =
        signal.score * ((1 + candidateStrengthWeight) / 2);

      matchedProfileScore += weightedMatchScore;
      matchedActiveScore += signal.activeScore;
      matchedActiveStrengthScore +=
        signal.activeScore * candidateStrengthWeight;

      if (signal.rarity >= rareTagThreshold) {
        matchedRareProfileScore += signal.score;
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
  const activeCoverage = activeTotal > 0 ? matchedActiveScore / activeTotal : 0;
  const activeStrengthCoverage =
    activeTotal > 0
      ? matchedActiveStrengthScore / (activeTotal * STRENGTH_WEIGHTS[3])
      : 0;
  const hasRareProfileSignals = rareProfileTotal > 0;
  const rareTagCoverage = hasRareProfileSignals
    ? matchedRareProfileScore / rareProfileTotal
    : 0;
  const activeTagMatches = getActiveTagMatchCount(game, activeTags);
  const conflictPenalty = getConflictPenalty(
    userProfile,
    gameTagsMap,
    profileTotal,
  );
  const missingActiveTagPenalty = getMissingActiveTagPenalty(
    activeTags,
    activeTagMatches,
  );
  const candidateNoisePenalty = getCandidateNoisePenalty(
    game,
    userProfile,
    matchedSignals,
    totalGames,
  );
  const totalPenalty =
    conflictPenalty + missingActiveTagPenalty + candidateNoisePenalty;

  if (!hasSelectedGames && activeTags.length > 0) {
    const activeCountCoverage = activeTagMatches / activeTags.length;
    const fullActiveMatch = activeTagMatches === activeTags.length;
    const strongestActiveTagCoverage = getStrongestActiveTagCoverage(
      userProfile,
      matchedSignals,
    );
    const activeOnlyMissingPenalty = getMissingActiveTagPenalty(
      activeTags,
      activeTagMatches,
    ) *
      (ACTIVE_ONLY_MISSING_ACTIVE_TAG_PENALTY_SHARE /
        MISSING_ACTIVE_TAG_PENALTY_SHARE);
    const activeOnlyNoisePenalty =
      candidateNoisePenalty *
      (ACTIVE_ONLY_CANDIDATE_NOISE_PENALTY_SHARE /
        CANDIDATE_NOISE_PENALTY_SHARE);
    const similarity =
      strongestActiveTagCoverage * ACTIVE_ONLY_PRIMARY_MATCH_SHARE +
      activeCoverage * ACTIVE_ONLY_WEIGHTED_COVERAGE_SHARE +
      activeStrengthCoverage * ACTIVE_ONLY_MATCH_STRENGTH_SHARE +
      activeCountCoverage * ACTIVE_ONLY_COUNT_COVERAGE_SHARE +
      (fullActiveMatch ? ACTIVE_ONLY_FULL_MATCH_BONUS_SHARE : 0) -
      conflictPenalty -
      activeOnlyNoisePenalty -
      activeOnlyMissingPenalty;

    return {
      activeTagMatches,
      matchedSignals,
      similarity: curveSimilarity(similarity),
    };
  }
  const specificMatchShare = hasRareProfileSignals ? SPECIFIC_MATCH_SHARE : 0;
  const baseShare =
    1 - specificMatchShare - (activeTags.length > 0 ? ACTIVE_MATCH_SHARE : 0);
  const similarity =
    profileCoverage * baseShare +
    activeCoverage * ACTIVE_MATCH_SHARE +
    rareTagCoverage * specificMatchShare -
    totalPenalty;

  return {
    activeTagMatches,
    matchedSignals,
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
  const hasSelectedGames = selectedGames.length > 0;
  const [games, totalGames] = await Promise.all([
    getCandidateGames(tagSlugs, selectedGames),
    prisma.game.count(),
  ]);
  const userProfile = getUserProfile(selectedGames, activeTags, totalGames);
  const rareTagThreshold = getProfileRareTagThreshold(userProfile); // 2.7269186854065928

  return games
    .map((game) => {
      const dto = toGameDto(game);
      const breakdown = getScoreBreakdown(
        dto,
        userProfile,
        activeTags,
        hasSelectedGames,
        rareTagThreshold,
        totalGames,
      );

      return {
        ...dto,
        activeTagMatches: breakdown.activeTagMatches,
        similarity: breakdown.similarity,
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
