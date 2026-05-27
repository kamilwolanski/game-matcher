import type { GameMatchColumn, GameMatchWithReasons } from "../_types";
import { getGameMatchGroupsForGame } from "@/lib/services/game-matcher.service";

export type GamesLikeReason = {
  icon: "globe" | "trophy" | "users" | "skull" | "compass" | "swords";
  title: string;
  description: string;
};

export const gothicPageData = {
  baseGameSlug: "gothic-1",
  baseGameName: "Gothic",
  heroAlt: "Games like Gothic",
  heroTitlePrefix: "Games Like",
  heroDescription:
    "Harsh open worlds, meaningful progression, dark fantasy atmosphere and reactive NPC worlds that react to your actions.",
  pills: ["Dark Fantasy", "Open World", "Challenging", "NPC Routines"],
  topMatches: [
    {
      slug: "gothic-2",
      reasons: [
        "Direct continuation of Gothic's world, factions, and progression systems",
        "Keeps the same dangerous exploration where weak players must survive carefully",
        "Deep faction identity with meaningful choices and roleplaying freedom",
        "Handcrafted world design packed with memorable NPCs and secrets",
      ],
    },
    {
      slug: "the-chronicles-of-myrtana-archolos",
      reasons: [
        "Famous total-conversion Gothic mod widely praised by the Gothic community",
        "Captures the atmosphere and pacing of the original Gothic better than most modern RPGs",
        "Strong focus on immersive worldbuilding and believable NPC routines",
        "Rewarding exploration with constant sense of danger and discovery",
      ],
    },
    {
      slug: "gothic-3",
      reasons: [
        "Expands Gothic into a larger sandbox while preserving player freedom",
        "Open faction conflict allows multiple playstyles and allegiances",
        "Exploration-driven progression encourages curiosity and risk-taking",
        "Maintains the rough, unforgiving spirit of the original games",
      ],
    },
    {
      slug: "kingdom-come-deliverance",
      reasons: [
        "Immersive world simulation with believable NPC behavior and schedules",
        "Brutal early-game combat makes progression feel rewarding",
        "Grounded RPG design focused on realism and player growth",
        "Freedom to solve quests in different ways without excessive handholding",
      ],
    },
    {
      slug: "kingdom-come-deliverance-ii",
      reasons: [
        "Builds on immersive simulation systems that Gothic fans often appreciate",
        "Reactive world that rewards preparation, patience, and experimentation",
        "Strong sense of realism and personal progression from weakness to competence",
        "Open-ended quest design encourages roleplaying and exploration",
      ],
    },
    {
      slug: "risen",
      reasons: [
        "Built by the original Gothic creators with very similar design philosophy",
        "Dense island world full of hidden paths, danger, and exploration rewards",
        "Faction progression strongly shapes gameplay and character identity",
        "Combat and atmosphere feel like a spiritual successor to Gothic 1",
      ],
    },
    {
      slug: "the-elder-scrolls-v-skyrim",
      reasons: [
        "Massive fantasy world designed around freedom and exploration",
        "Players can ignore the main story and create their own adventure",
        "Strong atmosphere filled with caves, ruins, factions, and secrets",
        "Progression system rewards experimentation and different playstyles",
      ],
    },
    {
      slug: "elex",
      reasons: [
        "Harsh open world where dangerous enemies exist from the very beginning",
        "Meaningful faction choices heavily impact progression and identity",
        "Exploration rewards careful preparation and curiosity",
        "Mixes Gothic-style world design with a unique sci-fi fantasy setting",
      ],
    },
    {
      slug: "dragons-dogma-2",
      reasons: [
        "Adventure-focused exploration with constant unpredictable encounters",
        "World encourages organic discovery instead of map-marker gameplay",
        "Combat feels dangerous and rewarding throughout the journey",
        "Strong sense of immersion during travel, exploration, and progression",
      ],
    },
  ],
  matchGroups: {
    atmosphere: [
      "dark-souls",
      "the-witcher",
      "arx-fatalis",
      "stalker-shadow-of-chernobyl",
    ],
    exploration: [
      "elden-ring",
      "outward",
      "two-worlds-ii",
      "dark-messiah-of-might-magic",
    ],
    choicesMatter: [
      "the-witcher-3-wild-hunt",
      "fallout-new-vegas",
      "drova-forsaken-kin-2",
      "the-witcher-2-assassins-of-kings",
    ],
  },
  dna: [
    {
      icon: "globe",
      title: "Immersive world",
      description: "A believable world that feels alive around you.",
    },
    {
      icon: "split",
      title: "Freedom & choice",
      description: "Multiple factions, paths, and ways to solve problems.",
    },
    {
      icon: "bars",
      title: "Earned progression",
      description: "Start weak and grow stronger through effort and mastery.",
    },
    {
      icon: "flame",
      title: "Dark atmosphere",
      description: "Gritty, oppressive, and instantly recognizable.",
    },
  ],
  faqItems: [
    {
      q: "What game is most similar to Gothic?",
      a: "Risen is usually considered the closest modern alternative to Gothic. It was created by the same developers and shares the same focus on factions, dangerous exploration, and earned progression.",
    },
    {
      q: "Is The Chronicles of Myrtana: Archolos worth playing?",
      a: "Yes - many Gothic fans consider Archolos one of the best total-conversion mods ever made. It perfectly captures the atmosphere, progression, and immersive world design of the original games.",
    },
    {
      q: "Are there modern RPGs like Gothic?",
      a: "Kingdom Come: Deliverance, ELEX, and Dragon’s Dogma 2 all capture different parts of Gothic’s DNA, including immersive exploration, harsh progression, and player freedom.",
    },
    {
      q: "Why do people still love Gothic?",
      a: "Gothic stands out because its world feels dangerous, believable, and immersive. The game never treats the player like a hero at the start — you have to earn your place in the world.",
    },
    {
      q: "Which RPGs have factions similar to Gothic?",
      a: "Risen, ELEX, Morrowind, and Fallout: New Vegas all feature factions that significantly affect quests, progression, and roleplaying choices.",
    },
    {
      q: "What makes Gothic different from modern RPGs?",
      a: "Unlike many modern RPGs, Gothic focuses on immersion and player-driven discovery instead of map markers, tutorials, and constant rewards.",
    },
    {
      q: "Is Risen a spiritual successor to Gothic?",
      a: "Yes. While it is not directly connected to the Gothic universe, Risen was created by Piranha Bytes and follows a very similar RPG formula.",
    },
    {
      q: "What are the best games for Gothic fans?",
      a: "Gothic 2, Archolos, Risen, Kingdom Come: Deliverance, ELEX, and Morrowind are among the most recommended games for players looking for a similar experience.",
    },
  ],
} as const;

export async function getGothicGamesLikeData() {
  const topMatchSlugs = gothicPageData.topMatches.map((match) => match.slug);
  const result = await getGameMatchGroupsForGame(gothicPageData.baseGameSlug, {
    topMatches: topMatchSlugs,
    ...gothicPageData.matchGroups,
  });

  if (!result) {
    return null;
  }

  const reasonsBySlug = new Map<string, readonly string[]>(
    gothicPageData.topMatches.map((match) => [match.slug, match.reasons]),
  );
  const topMatches: GameMatchWithReasons[] = result.groups.topMatches.map(
    (game) => ({
      ...game,
      reasons: [...(reasonsBySlug.get(game.slug) ?? [])],
    }),
  );
  const columns: GameMatchColumn[] = [
    {
      title: "Games With Gothic Atmosphere",
      games: result.groups.atmosphere,
    },
    {
      title: "Games With Gothic-Style Exploration",
      games: result.groups.exploration,
    },
    {
      title: "Games Where Choices Matter Like Gothic",
      games: result.groups.choicesMatter,
    },
  ];

  return {
    sourceGame: result.game,
    topMatches,
    columns,
  };
}
