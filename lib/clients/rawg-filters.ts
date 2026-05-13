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
  "half-life-2-deathmatch",
  "dear-esther-landmark-edition",
  "darksiders-ii-deathinitive-edition",
  "borderlands-game-of-the-year-enhanced",
  "dark-souls-prepare-to-die-edition",
  "sid-meiers-civilization-iii-complete",
  "mafia-ii-definitive-edition",
  "tomb-raider-anniversary",
  "shadowrun-dragonfall-dc",
  "galactic-civilizations-ii-ultimate-edition",
  "warhammer-40000-dawn-of-war-game-of-the-year-editi",
  "star-wars-the-force-unleashed-ultimate-sith-editio",
  "bulletstorm-full-clip-edition",
  "teleglitch-die-more-edition",
  "tomb-raider-goty",
  "batman-arkham-city-goty",
  "injustice-gods-among-us-ultimate-edition",
  "mortal-kombat-komplete-edition",
  "hard-reset-extended-edition",
  "enslaved-odyssey-to-the-west-premium-edition",
  "jagged-alliance-1-gold-edition",
  "devil-may-cry-4-special-edition",
  "wasteland-2-directors-cut",
  "assassins-creed-directors-cut-edition",
  "baldurs-gate-ii-ee",
  "the-secret-of-monkey-island-special-edition",
  "sonic-adventure-dx",
  "star-wars-empire-at-war-gold-pack",
  "dead-island-definitive-edition",
  "mafia-iii-definitive-edition",
  "shadowrun-hong-kong-extended-edition",
  "planescape-torment-enhanced-edition",
  "broken-sword-1-dc-espanol",
  "state-of-decay-yose",
  "deadly-premonition-the-directors-cut",
  "sam-max-301-the-penal-zone",
  "dishonored-definitive-edition",
  "castlevania-lords-of-shadow-ultimate-edition",
  "the-whispered-world-special-edition",
  "just-cause-2-multiplayer-mod",
  "new-beginning-a",
  "death-stranding-directors-cut",
  "divinity-original-sin-ii-definitive-edition",
  "darwin-project-open-beta",
  "nioh-complete-edition-ren-wang-complete-edition",
  "painkiller-black-edition",
  "broken-sword-ii-the-smoking-mirror",
  "disco-elysium-final-cut",
  "unreal-tournament-game-of-the-year-edition",
  "tree-of-savior-english-ver",
  "recore-definitive-edition-2",
  "blackgate-deluxe-ed",
  "portal-2-sixense-perceptual-pack",
  "the-witcher-3-game-of-the-year",
  "heroes-of-might-and-magic-3-complete",
  "age-of-mythology-extended-edition",
  "arma-gold-edition",
  "dead-rising-3-apocalypse-edition",
  "europa-universalis-iii-complete",
  "hotline-miami-2-wrong-number-digital-comic",
  "neighbours-from-hell-compilation",
  "rise-of-nations-extended-edition",
  "fahrenheit-indigo-prophecy",
  'assassins-creed-liberation-hd',
  "radical-roach-deluxe-edition",
  "anomaly-warzone-earth-mobile-campaign",
  "ace-combat-assault-horizon-enhanced-edition",
  "kingdom-hearts-hd-1525-remix",
  "tales-of-vesperia-definitive-edition",
  "another-world-20th",
  "day-of-defeat-source",
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
