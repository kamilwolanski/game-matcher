import { TagSlug } from "./tags";

export const TAG_ALIASES = {
  // ===== RPG =====
  rpg: ["rpg"],
  "role-playing-game": ["rpg"],
  roleplayinggame: ["rpg"],
  "role-playing": ["rpg"],
  "role-play": ["rpg"],
  "jeu-de-role": ["rpg"],
  "juego-de-rol": ["rpg"],
  "role-playing-game-2": ["rpg"],
  "roleplaying-game": ["rpg"],
  "party-based-rpg": ["rpg"],
  "rpg-adventure": ["rpg", "adventure"],

  // subgenres
  "strategy-rpg": ["srpg", "strategy"],
  "tactical-rpg": ["srpg", "strategy"],
  "action-rpg": ["arpg", "action"],
  actionrpg: ["arpg", "action"],
  "japanese-rpg": ["jrpg"],
  "computer-rpg": ["crpg"],
  "dungeon-rpg": ["drpg"],
  "open-world": ["open-world"],
  "souls-like": ["souls-like"],
  "choose-your-own-adventure": ["choose-your-own-adventure"],
  "text-adventure": ["text-adventure"],
  "top-down-adventure": ["top-down", "adventure"],

  // ===== FPS =====
  fps: ["fps"],
  "first-person-shooter": ["fps"],
  "first-person-shooter-2": ["fps"],
  "first-person-shooter-3": ["fps"],
  "retro-fps": ["fps"],

  // boomer
  "boomer-shooter": ["boomer-shooter"],
  "retro-shooter": ["boomer-shooter"],
  "doom-like": ["boomer-shooter"],

  // TPS
  tps: ["tps"],
  "third-person-shooter": ["tps"],
  "3rd-person-shooter": ["tps"],

  // top-down
  "top-down-shooter": ["top-down-shooter"],
  topdownshooter: ["top-down-shooter"],

  // hero
  "hero-shooter": ["hero-shooter"],
  "ability-shooter": ["hero-shooter"],

  // looter
  "looter-shooter": ["looter-shooter"],

  // battle royale
  "battle-royale": ["battle-royale"],
  "battle-royal": ["battle-royale"],

  "bullet-hell": ["bullet-hell"],

  // ===== PLATFORMER =====
  platformers: ["platformer"],
  "platformer-game": ["platformer"],

  "2d-platformer": ["platformer"],
  "2d-platformer-3": ["platformer"],
  "2d-platformer-4": ["platformer"],
  "platformer-2d": ["platformer"],

  "fps-platformer": ["platformer", "fps"],
  "platformer-shooter": ["platformer"],
  "action-platformer": ["platformer", "action"],

  // ===== PLATFORMER SUB =====
  "3d-platformer": ["3d-platformer"],
  "precision-platformer": ["precision-platformer"],

  // 🔥 KLUCZOWE
  "puzzle-platformer": ["platformer", "puzzle"],
  "puzzle-platformer-2": ["platformer", "puzzle"],

  // ===== METROIDVANIA =====
  metroidvania: ["metroidvania"],

  // ===== ROGUELIKE =====
  roguelike: ["roguelike"],
  "traditional-roguelike": ["roguelike"],
  "traditional-roguelike-2": ["roguelike"],
  "roguelike-deckbuilder": ["roguelike", "deckbuilder"],

  // ===== RACING =====
  racing: ["racing"],

  // ===== ROGUELIKE SUB =====
  roguelite: ["roguelite"],

  // ===== ACTION HYBRIDS =====
  "action-adventure": ["action-adventure"],
  "action-roguelike": ["roguelike", "action"],
  "action-roguelike-2": ["roguelike", "action"],
  "action-puzzle": ["action", "puzzle"],
  "action-strategy": ["action", "strategy"],

  // ===== TCG =====
  "trading-card-game": ["tcg"],
  "collectible-card-game": ["tcg"],

  // ===== STRATEGY =====

  // base
  "strategy-game": ["strategy"],
  "strategy-games": ["strategy"],

  // RTS
  "real-time-strategy": ["rts"],
  rts: ["rts"],

  // tower defense
  "tower-defense": ["tower-defense"],
  "tower-defence": ["tower-defense"],
  td: ["tower-defense"],

  // grand
  "grand-strategy": ["grand-strategy"],
  "grand-strategy-2": ["grand-strategy"],

  // city-builder
  "city-builder": ["city-builder"],
  // hybrids
  "strategy-puzzle": ["strategy", "puzzle"],

  // action rts
  "action-rts": ["rts", "action"],
  "action-rts-2": ["rts", "action"],

  // ===== ADVENTURE =====
  adventure: ["adventure"],
  "visual-novel": ["visual-novel"],

  // ===== SIMULATION =====
  simulation: ["simulation"],
  simuliator: ["simulation"],
  flight: ["flight"],
  "walking-simulator": ["walking-simulator"],

  // ===== SPORTS =====
  sports: ["sports"],
  football: ["football"],
  soccer: ["football"],

  // ===== ARCADE =====
  arcade: ["arcade"],
  arkada: ["arcade"],
  skateboarding: ["skateboarding"],
  skeitbording: ["skateboarding"],
  // ===== SURVIVAL-HORROR =====
  "survival-horror": ["survival-horror"],

  // ===== ACTION =====
  action: ["action"],
  // ===== MECHANIC =====
  permadeath: ["permadeath"],
  procedural: ["procedural-generation"],
  deckbuilding: ["deckbuilder"],
  "deck-building": ["deckbuilder"],
  "card-game": ["card"],
  "card-battler": ["card-battler"],
  "card-battler-2": ["card-battler"],
  "turn-based": ["turn-based"],
  "turn-based-strategy": ["strategy", "turn-based"],
  "point-click": ["point-and-click"],
  "story-rich": ["story-rich"],
  sandbox: ["sandbox"],
  "co-op": ["co-op"],
  "local-co-op": ["co-op"],
  "online-co-op": ["co-op"],
  cooperative: ["co-op"],
  stealth: ["stealth"],
  stels: ["stealth"],
  "hack-and-slash": ["hack-and-slash"],
  slesher: ["hack-and-slash"],
  swordplay: ["swordplay"],
  management: ["management"],
  "resource-management": ["resource-management"],
  driving: ["driving"],
  "online-pvp": ["online-pvp"],
  combos: ["combos"],
  pvp: ["online-pvp"],
  "split-screen": ["split-screen"],
  "sharedsplit-screen-pvp": ["split-screen"],
  "character-customization": ["character-customization"],
  "immersive-sim": ["immersive-sim"],
  "base-building": ["building"],
  exploration: ["exploration"],
  loot: ["loot"],
  trading: ["trading"],
  hacking: ["hacking"],
  linear: ["linear"],
  physics: ["physics"],
  drifting: ["drifting"],
  survival: ["survival"],
  puzzle: ["puzzle"],
  building: ["building"],
  crafting: ["crafting"],
  "choices-matter": ["choices-matter"],
  // ===== THEME =====
  pirates: ["pirates"],
  fantasy: ["fantasy"],
  "dark-fantasy": ["dark-fantasy"],
  medieval: ["medieval"],
  magic: ["magic"],
  gothic: ["gothic"],
  agriculture: ["agriculture"],
  "ancient-greece": ["ancient-greece"],
  mythology: ["mythology"],
  "greek-mythology": ["greek-mythology"],
  "norse-mythology": ["norse-mythology"],
  cyberpunk: ["cyberpunk"],
  "sci-fi": ["sci-fi"],
  futuristic: ["futuristic"],
  "post-apocalyptic": ["post-apocalyptic"],
  western: ["western"],
  zombies: ["zombies"],
  space: ["space"],
  aliens: ["aliens"],
  military: ["military"],
  war: ["war"],
  detective: ["detective"],
  crime: ["crime"],
  noir: ["noir"],
  superhero: ["superhero"],
  school: ["school"],
  romance: ["romance"],
  drama: ["drama"],
  surreal: ["surreal"],
  cars: ["cars"],
  politics: ["politics"],
  lovecraftian: ["lovecraftian"],
  nature: ["nature"],
  mystery: ["mystery"],
  horror: ["horror"],

  // ===== MOOD =====
  funny: ["funny"],
  hard: ["hard"],
  atmospheric: ["atmospheric"],
  realistic: ["realistic"],
  relaxing: ["relaxing"],
  "reality-based": ["realistic"],
  difficult: ["difficult"],
  dark: ["dark"],
  emotional: ["emotional"],
  chill: ["chill"],
  addictive: ["addictive"],
  competitive: ["competitive"],
  philosophical: ["philosophical"],

  // ===== PERSPECTIVE =====
  "first-person": ["first-person"],
  "third-person": ["third-person"],
  isometric: ["isometric"],
  "top-down": ["top-down"],

  // ===== STYLE =====
  retro: ["retro"],
  cinematic: ["cinematic"],
  "party-game": ["party-game"],
  "2d": ["2d"],
  "pixel-graphics": ["pixel-graphics"],
  "hand-drawn": ["hand-drawn"],
  stylized: ["stylized"],

  // ===== PLAYSTYLE =====
  casual: ["casual"],
  singleplayer: ["singleplayer"],
  multiplayer: ["multiplayer"],

  // ===== RUS =====
  prikliuchenie: ["adventure"],
  golovolomka: ["puzzle"],
  "bashennaia-zashchita": ["tower-defense"],
  strategiia: ["strategy"],
  pesochnitsa: ["sandbox"],
  "dlia-neskolkikh-igrokov": ["co-op"],
  "sovmestnaia-igra-po-seti": ["co-op"],
  smeshnaia: ["funny"],
  slozhnaia: ["hard"],
  "rolevaia-igra": ["rpg"],
  "rolevoi-ekshen": ["arpg", "action"],
  ekshen: ["action"],
  "otkrytyi-mir": ["open-world"],
  atmosfera: ["atmospheric"],
  fentezi: ["fantasy"],
  srednevekove: ["medieval"],
  magiia: ["magic"],
  gotika: ["gothic"],
  "ot-pervogo-litsa": ["first-person"],
  "ot-tretego-litsa": ["third-person"],
  "tiomnoe-fentezi": ["dark-fantasy"],
  "srazheniia-na-mechakh": ["swordplay"],
  menedzhment: ["management"],
  "upravlenie-resursami": ["resource-management"],
  vozhdenie: ["driving"],
  "selskoe-khoziaistvo": ["agriculture"],
  realizm: ["realistic"],
  rasslabliaiushchaia: ["relaxing"],
  "kastomizatsiia-personazha": ["character-customization"],
  gonki: ["racing"],
  detektiv: ["detective"],
  nuar: ["noir"],
} satisfies Record<string, TagSlug[]>;

export type TagAliasKey = keyof typeof TAG_ALIASES;