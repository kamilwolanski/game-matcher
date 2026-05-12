import "server-only";

import type { GameDto } from "@/lib/dto/game.dto";
import type { GameMatchDto } from "@/lib/dto/game-match.dto";
import type { ShortTag } from "@/lib/dto/tag.dto";
import { toGameDto } from "@/lib/mappers/game.mapper";
import prisma from "@/lib/prisma";
import { CATEGORY_WEIGHTS, TAGS_AS_OBJECT } from "@/consts/tags";


const SELECTED_GAME_TAG_WEIGHT = 1;
const ACTIVE_TAG_WEIGHT = 5;
const REPEATED_TAG_DECAY = 0.65;
const ACTIVE_MATCH_SHARE = 0.35;
const SPECIFIC_MATCH_SHARE = 0.15;
const MIN_TAG_RARITY = 0.15;
const MAX_TAG_RARITY = 4;
const MIN_GAMES_FOR_RARITY = 30;
const RARE_TAG_MIN_THRESHOLD = 2;
const TAG_COUNT_SMOOTHING = 2;
const SELECTED_GAME_SCORE_CURVE = 0.65;
const DEFAULT_CATEGORY_WEIGHT = 1;
const TAG_MATCH_CANDIDATE_LIMIT = 2500;
const POPULAR_DISCOVERY_CANDIDATE_LIMIT = 300;
const HIDDEN_GEM_CANDIDATE_LIMIT = 300;
const RESULTS_LIMIT = 80;
const SHARED_TRAITS_LIMIT = 6;
const MATCH_REASON_TITLE = "Matched on shared gameplay and atmosphere traits from your picks.";

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

const getTagCategoryWeight = (slug: string) => {
  const tag = TAGS_AS_OBJECT[slug];

  if (!tag) return DEFAULT_CATEGORY_WEIGHT;

  return CATEGORY_WEIGHTS[tag.category];
};

const getTagSignalWeight = (tag: ShortTag, totalGames: number) => {
  return (
    getTagRarity(tag.gamesCount, totalGames) * getTagCategoryWeight(tag.slug)
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

function getUserProfile(
  selectedGames: GameDto[],
  activeTags: ShortTag[],
  totalGames: number,
) {
  const profile = new Map<string, UserTagSignal>();
  const selectedTagOccurrences = new Map<string, number>();

  for (const tag of selectedGames.flatMap((game) => game.tags)) {
    const occurrence = (selectedTagOccurrences.get(tag.slug) ?? 0) + 1;
    const rarity = getTagRarity(tag.gamesCount, totalGames);
    const tagSignalWeight = rarity * getTagCategoryWeight(tag.slug);
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

function getScoreBreakdown(
  game: GameDto,
  userProfile: Map<string, UserTagSignal>,
  activeTags: ShortTag[],
  hasSelectedGames: boolean,
  rareTagThreshold: number,
) {
  let profileTotal = 0;
  let matchedProfileScore = 0;
  let activeTotal = 0;
  let matchedActiveScore = 0;
  let rareProfileTotal = 0;
  let matchedRareProfileScore = 0;

  const matchedSignals: UserTagSignal[] = [];
  const gameTagSlugs = new Set(game.tags.map((tag) => tag.slug));

  for (const signal of userProfile.values()) {
    profileTotal += signal.score;
    activeTotal += signal.activeScore;

    if (signal.rarity >= rareTagThreshold) {
      rareProfileTotal += signal.score;
    }

    if (gameTagSlugs.has(signal.tag.slug)) {
      matchedSignals.push(signal);
      matchedProfileScore += signal.score;
      matchedActiveScore += signal.activeScore;

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

  const profileCoverage = matchedProfileScore / profileTotal;
  const activeCoverage = activeTotal > 0 ? matchedActiveScore / activeTotal : 0;
  const hasRareProfileSignals = rareProfileTotal > 0;
  const rareTagCoverage = hasRareProfileSignals
    ? matchedRareProfileScore / rareProfileTotal
    : 0;

  if (!hasSelectedGames && activeTags.length > 0) {
    const activeTagMatches = getActiveTagMatchCount(game, activeTags);
    const activeCountCoverage = activeTagMatches / activeTags.length;
    const fullActiveMatch = activeTagMatches === activeTags.length;
    const activeBoostShare = hasRareProfileSignals ? 0.07 : 0.1;
    const rareBoostShare = hasRareProfileSignals ? 0.03 : 0;
    const similarity =
      activeCountCoverage * 0.9 +
      (fullActiveMatch
        ? activeCoverage * activeBoostShare + rareTagCoverage * rareBoostShare
        : 0);

    return {
      activeTagMatches,
      matchedSignals,
      similarity,
    };
  }

  const specificMatchShare = hasRareProfileSignals ? SPECIFIC_MATCH_SHARE : 0;
  const baseShare =
    1 - specificMatchShare - (activeTags.length > 0 ? ACTIVE_MATCH_SHARE : 0);
  const similarity =
    profileCoverage * baseShare +
    activeCoverage * ACTIVE_MATCH_SHARE +
    rareTagCoverage * specificMatchShare;

  return {
    activeTagMatches: getActiveTagMatchCount(game, activeTags),
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

  const [tagMatchGames, popularDiscoveryGames, hiddenGemGames] =
    await Promise.all([
      tagSlugs.length > 0
        ? prisma.game.findMany({
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
            take: TAG_MATCH_CANDIDATE_LIMIT,
          })
        : [],
      prisma.game.findMany({
        where: baseWhere,
        include: gameWithTagsInclude,
        orderBy: [{ added: "desc" }, { rating: "desc" }],
        take: POPULAR_DISCOVERY_CANDIDATE_LIMIT,
      }),
      prisma.game.findMany({
        where: {
          ...baseWhere,
          added: {
            not: 0,
          },
        },
        include: gameWithTagsInclude,
        orderBy: [{ added: "asc" }, { rating: "desc" }],
        take: HIDDEN_GEM_CANDIDATE_LIMIT,
      }),
    ]);

  return Array.from(
    new Map(
      [...tagMatchGames].map(
        (game) => [game.slug, game],
      ),
    ).values(),
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
  const rareTagThreshold = getProfileRareTagThreshold(userProfile);

  return games
    .map((game) => {
      const dto = toGameDto(game);
      const breakdown = getScoreBreakdown(
        dto,
        userProfile,
        activeTags,
        hasSelectedGames,
        rareTagThreshold,
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
      if (b.similarity !== a.similarity) {
        return b.similarity - a.similarity;
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
