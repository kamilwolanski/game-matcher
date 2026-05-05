export type Category =
  | "genre"
  | "subgenre"
  | "mechanic"
  | "theme"
  | "perspective"
  | "style"
  | "mood"
  | "playstyle";

export const CATEGORY_WEIGHTS: Record<Category, number> = {
  genre: 5,
  subgenre: 4,
  mechanic: 3,
  theme: 2,
  perspective: 2,
  playstyle: 2,
  style: 1,
  mood: 1,
};

export type TagSlug = keyof typeof TAGS;

export const TAGS = {
  // ===== RPG =====
  rpg: { category: "genre", name: "RPG" },
  jrpg: { category: "subgenre", name: "JRPG" },
  crpg: { category: "subgenre", name: "CRPG" },
  arpg: { category: "subgenre", name: "Action RPG" },
  srpg: { category: "subgenre", name: "Strategy RPG" },
  drpg: { category: "subgenre", name: "Dungeon RPG" },
  "souls-like": { category: "subgenre", name: "Souls-like" },
  "choose-your-own-adventure": {
    category: "subgenre",
    name: "Choose Your Own Adventure",
  },
  "text-adventure": { category: "subgenre", name: "Text Adventure" },

  // ===== SHOOTER =====
  shooter: { category: "genre", name: "Shooter" },
  fps: { category: "subgenre", name: "FPS" },
  tps: { category: "subgenre", name: "TPS" },
  "top-down-shooter": { category: "subgenre", name: "Top-Down Shooter" },

  "boomer-shooter": { category: "subgenre", name: "Boomer Shooter" },
  "hero-shooter": { category: "subgenre", name: "Hero Shooter" },
  "looter-shooter": { category: "subgenre", name: "Looter Shooter" },
  "arena-shooter": { category: "subgenre", name: "Arena Shooter" },
  "battle-royale": { category: "subgenre", name: "Battle Royale" },
  "bullet-hell": { category: "subgenre", name: "Bullet Hell" },

  // ===== PLATFORMER =====
  platformer: { category: "genre", name: "Platformer" },
  "3d-platformer": { category: "subgenre", name: "3D Platformer" },
  "precision-platformer": {
    category: "subgenre",
    name: "Precision Platformer",
  },
  metroidvania: { category: "subgenre", name: "Metroidvania" },

  // ===== STRATEGY =====
  strategy: { category: "genre", name: "Strategy" },
  rts: { category: "subgenre", name: "RTS" },
  "grand-strategy": { category: "subgenre", name: "Grand Strategy" },
  "tower-defense": { category: "subgenre", name: "Tower Defense" },
  "city-builder": { category: "subgenre", name: "City Builder" },

  // ===== ROGUELIKE =====
  roguelike: { category: "genre", name: "Roguelike" },
  roguelite: { category: "subgenre", name: "Roguelite" },

  // ===== CORE GENRES =====
  adventure: { category: "genre", name: "Adventure" },
  "visual-novel": { category: "subgenre", name: "Visual Novel" },

  // ===== CARDS =====
  tcg: { category: "subgenre", name: "Trading Card Game" },

  // ===== SIMULATION =====
  simulation: { category: "genre", name: "Simulation" },
  flight: { category: "subgenre", name: "Flight Simulator" },
  "walking-simulator": { category: "subgenre", name: "Walking Simulator" },

  // ===== SPORTS =====
  sports: { category: "genre", name: "Sports" },
  football: { category: "subgenre", name: "Football" },

  // ===== ARCADE =====
  arcade: { category: "mechanic", name: "Arcade" },
  skateboarding: { category: "subgenre", name: "Skateboarding" },

  // ===== SURVIVAL-HORROR =====
  "survival-horror": { category: "subgenre", name: "Survival Horror" },
  "action-adventure": { category: "genre", name: "Action Adventure" },

  // ===== RACING =====
  racing: { category: "genre", name: "Racing" },

  // ===== ACTION =====
  action: { category: "genre", name: "Action" },

  // ===== MECHANIC =====
  "procedural-generation": {
    category: "mechanic",
    name: "Procedural Generation",
  },
  permadeath: { category: "mechanic", name: "Permadeath" },
  deckbuilder: { category: "mechanic", name: "Deckbuilder" },
  card: { category: "mechanic", name: "Card" },
  "card-battler": { category: "mechanic", name: "Card Battler" },
  "turn-based": { category: "mechanic", name: "Turn-Based" },
  "point-and-click": { category: "mechanic", name: "Point & Click" },
  sandbox: { category: "mechanic", name: "Sandbox" },
  "co-op": { category: "mechanic", name: "Co-op" },
  "hack-and-slash": { category: "mechanic", name: "Hack & Slash" },
  swordplay: { category: "mechanic", name: "Swordplay" },
  stealth: { category: "mechanic", name: "Stealth" },
  "multiple-endings": { category: "mechanic", name: "Multiple Endings" },
  management: { category: "mechanic", name: "Management" },
  "resource-management": { category: "mechanic", name: "Resource Management" },
  driving: { category: "mechanic", name: "Driving" },
  "open-world": { category: "mechanic", name: "Open World" },
  "online-pvp": { category: "mechanic", name: "Online PvP" },
  combos: { category: "mechanic", name: "Combos" },
  "character-customization": {
    category: "mechanic",
    name: "Character Customization",
  },
  "split-screen": { category: "mechanic", name: "Split Screen" },
  crafting: { category: "mechanic", name: "Crafting" },
  building: { category: "mechanic", name: "Building" },
  exploration: { category: "mechanic", name: "Exploration" },
  "immersive-sim": { category: "mechanic", name: "Immersive Sim" },
  loot: { category: "mechanic", name: "Loot" },
  "character-builds": { category: "mechanic", name: "Character Builds" },
  trading: { category: "mechanic", name: "Trading" },
  hacking: { category: "mechanic", name: "Hacking" },
  "choices-matter": { category: "mechanic", name: "Choices Matter" },
  linear: { category: "mechanic", name: "Linear" },
  physics: { category: "mechanic", name: "Physics" },
  survival: { category: "mechanic", name: "Survival" },
  puzzle: { category: "mechanic", name: "Puzzle" },
  drifting: { category: "mechanic", name: "Drifting" },

  // ===== THEME =====
  horror: { category: "theme", name: "Horror" },
  pirates: { category: "theme", name: "Pirates" },
  "story-rich": { category: "theme", name: "Story Rich" },
  fantasy: { category: "theme", name: "Fantasy" },
  medieval: { category: "theme", name: "Medieval" },
  magic: { category: "theme", name: "Magic" },
  gothic: { category: "theme", name: "Gothic" },
  "dark-fantasy": { category: "theme", name: "Dark Fantasy" },
  agriculture: { category: "theme", name: "Agriculture" },
  "ancient-greece": { category: "theme", name: "Ancient Greece" },
  mythology: { category: "theme", name: "Mythology" },
  "greek-mythology": { category: "theme", name: "Greek Mythology" },
  "norse-mythology": { category: "theme", name: "Norse Mythology" },
  cyberpunk: { category: "theme", name: "Cyberpunk" },
  "sci-fi": { category: "theme", name: "Sci-Fi" },
  futuristic: { category: "theme", name: "Futuristic" },
  "post-apocalyptic": { category: "theme", name: "Post-apocalyptic" },
  western: { category: "theme", name: "Western" },
  zombies: { category: "theme", name: "Zombies" },
  space: { category: "theme", name: "Space" },
  aliens: { category: "theme", name: "Aliens" },
  military: { category: "theme", name: "Military" },
  war: { category: "theme", name: "War" },
  detective: { category: "theme", name: "Detective" },
  crime: { category: "theme", name: "Crime" },
  noir: { category: "theme", name: "Noir" },
  superhero: { category: "theme", name: "Superhero" },
  school: { category: "theme", name: "School" },
  romance: { category: "theme", name: "Romance" },
  drama: { category: "theme", name: "Drama" },
  surreal: { category: "theme", name: "Surreal" },
  urban: { category: "theme", name: "Urban" },
  cars: { category: "theme", name: "Cars" },
  politics: { category: "theme", name: "Politics" },
  lovecraftian: { category: "theme", name: "Lovecraftian" },
  nature: { category: "theme", name: "Nature" },
  mystery: { category: "theme", name: "Mystery" },

  // ===== STYLE =====
  retro: { category: "style", name: "Retro" },
  cinematic: { category: "style", name: "Cinematic" },
  "party-game": { category: "style", name: "Party Game" },
  "2d": { category: "style", name: "2D" },
  "pixel-graphics": { category: "style", name: "Pixel Graphics" },
  "hand-drawn": { category: "style", name: "Hand-drawn" },
  stylized: { category: "style", name: "Stylized" },

  // ===== MOOD =====
  funny: { category: "mood", name: "Funny" },
  hard: { category: "mood", name: "Hard" },
  atmospheric: { category: "mood", name: "Atmospheric" },
  realistic: { category: "mood", name: "Realistic" },
  relaxing: { category: "mood", name: "Relaxing" },
  difficult: { category: "mood", name: "Difficult" },
  dark: { category: "mood", name: "Dark" },
  emotional: { category: "mood", name: "Emotional" },
  chill: { category: "mood", name: "Chill" },
  addictive: { category: "mood", name: "Addictive" },
  competitive: { category: "mood", name: "Competitive" },
  philosophical: { category: "mood", name: "Philosophical" },

  // ===== PERSPECTIVE =====
  "first-person": { category: "perspective", name: "First Person" },
  "third-person": { category: "perspective", name: "Third Person" },
  isometric: { category: "perspective", name: "Isometric" },
  "top-down": { category: "perspective", name: "Top Down" },

  // ===== PLAYSTYLE =====
  casual: { category: "playstyle", name: "Casual" },
  singleplayer: { category: "playstyle", name: "Singleplayer" },
  multiplayer: { category: "playstyle", name: "Multiplayer" },
} satisfies Record<string, { category: Category; name: string }>;

export const TAG_ALIASES_NEW = {
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

export type TagAliasKey = keyof typeof TAG_ALIASES_NEW;
