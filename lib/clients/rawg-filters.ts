import { SearchGameResult } from "../dto/search-game.dto";

const BLOCKED_PATTERNS = [
  /\bDemo\b/i,
  /\bSoundtrack\b/i,
  /\bBundle\b/i,
  /\bExpansion\b/i,
  /\bDLC\b/i,
  /\bCollection\b/i,
  /\bTrilogy\b/i,
  /\bAnthology\b/i,
];

const BLOCKED_POSITIONS = new Set<string>([
  "the-elder-scrolls-v-skyrim-special-edition",
  "the-elder-scrolls-v-skyrim-anniversary-edition",
  "the-elder-scrolls-online-tamriel-unlimited",
  "the-elder-scrolls-v-skyrim-legendary-edition",
  "the-elder-scrolls-v-skyrim-hearthfire",
  "the-elder-scrolls-v-skyrim-dawnguard",
  "the-elder-scrolls-v-skyrim-vr",
  "the-elder-scrolls-v-skyrim-dragonborn",
  "gothic-2-night-of-the-raven",
  "gothic-3-forsaken-gods",
  "gothic-3-forsaken-gods-enhanced-edition",
  "gothic-playable-teaser",
  "gothic-ii-gold-edition",
  "deus-ex-human-revolution-directors-cut",
  "deus-ex-game-of-the-year-edition",
  "mass-effect-legendary-edition",
  "bioshock-2-remastered",
  "the-elder-scrolls-iv-oblivion-game-of-the-year-edi",
  "dragon-age-origins-ultimate-edition",
  "final-fantasy-xv-windows-edition",
  "baldurs-gate-enhanced-edition",
  "evoland-legendary-edition",
  "fallout-3-game-of-the-year-edition",
  "dragons-dogma-dark-arisen",
  "titan-quest-anniversary-edition",
  "diablo-iii-ultimate-evil-edition",
  "diablo-iii-reaper-of-souls",
  "diablo-2-expansion-lord-of-destruction",
  "diablo-iii-eternal-collection",
  "diablo-immortal",
  "mass-effect-3-reckoning",
  "mass-effect-2-arrival",
  "mass-effect-3-omega",
  "mass-effect-2-firewalker",
  "mass-effect-3-leviathan",
  "mass-effect-3-retaliation",
  "mass-effect-3-earth",
  "mass-effect-2-zaeed-the-price-of-revenge",
  "mass-effect-3-n7-digital-deluxe-edition",
  "mass-effect-2-2010-edition",
  "mass-effect-bring-down-the-sky",
  "mass-effect-2-lair-of-the-shadow-brokee",
  "mass-effect-2-normandy-crash-site",
  "mass-effect-2-kasumi-stolen-memory",
  "mass-effect-3-from-ashes",
  "dark-souls-artorias-of-the-abyss",
  "mass-effect-3-tuchanka",
  "mass-effect-andromeda-deluxe-edition",
  "mass-effect-pinnacle-station",
  "mass-effect-3-citadel",
  "mass-effect-2-overlord",
  "the-elder-scrolls-4-oblivion-knights-of-the-nine",
  "the-elder-scrolls-4-shivering-isles",
  "the-elder-scrolls-3-bloodmoon",
  "the-elder-scrolls-3-tribunal",
  "galactic-civilizations-i-ultimate-edition",
  "civilization-iv-beyond-the-sword",
] as const);

function isFutureRelease(released: string | null) {
  if (!released) {
    return true;
  }

  return new Date(released) > new Date();
}

export function shouldHideGame(
  game: Omit<SearchGameResult, "image" | "rawgId">,
) {
  if (game.tba) {
    return true;
  }

  if (isFutureRelease(game.released)) {
    return true;
  }

  if (game.added < 10) {
    return true;
  }

  const blockedPattern = BLOCKED_PATTERNS.some((pattern) =>
    pattern.test(game.name),
  );

  if (blockedPattern) {
    return true;
  }

  if (BLOCKED_POSITIONS.has(game.slug)) {
    return true;
  }
}
