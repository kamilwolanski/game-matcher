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


