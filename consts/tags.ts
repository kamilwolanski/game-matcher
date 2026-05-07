export type Category =
  | "genre"
  | "subgenre"
  | "structure"
  | "mechanic"
  | "theme"
  | "aesthetic"
  | "mood"
  | "perspective"
  | "mode"
  | "pace"
  | "progression";

export const CATEGORY_WEIGHTS: Record<Category, number> = {
  genre: 5,
  subgenre: 4,
  structure: 4,
  mechanic: 3,
  progression: 3,
  theme: 2,
  aesthetic: 2,
  perspective: 2,
  mode: 2,
  pace: 2,
  mood: 1,
};

export const TAGS = {
  // =========================================================
  // GENRE
  // =========================================================

  action: { category: "genre", name: "Action" },
  adventure: { category: "genre", name: "Adventure" },
  rpg: { category: "genre", name: "RPG" },
  strategy: { category: "genre", name: "Strategy" },
  shooter: { category: "genre", name: "Shooter" },
  simulation: { category: "genre", name: "Simulation" },
  platformer: { category: "genre", name: "Platformer" },
  racing: { category: "genre", name: "Racing" },
  sports: { category: "genre", name: "Sports" },
  fighting: { category: "genre", name: "Fighting" },
  horror: { category: "genre", name: "Horror" },
  survival: { category: "genre", name: "Survival" },
  puzzle: { category: "genre", name: "Puzzle" },

  // =========================================================
  // SUBGENRE
  // =========================================================

  jrpg: { category: "subgenre", name: "JRPG" },
  crpg: { category: "subgenre", name: "CRPG" },
  arpg: { category: "subgenre", name: "Action RPG" },
  srpg: { category: "subgenre", name: "Strategy RPG" },
  drpg: { category: "subgenre", name: "Dungeon RPG" },

  fps: { category: "subgenre", name: "FPS" },
  tps: { category: "subgenre", name: "TPS" },
  "boomer-shooter": {
    category: "subgenre",
    name: "Boomer Shooter",
  },
  "hero-shooter": {
    category: "subgenre",
    name: "Hero Shooter",
  },
  "looter-shooter": {
    category: "subgenre",
    name: "Looter Shooter",
  },
  "arena-shooter": {
    category: "subgenre",
    name: "Arena Shooter",
  },
  "extraction-shooter": {
    category: "subgenre",
    name: "Extraction Shooter",
  },

  metroidvania: {
    category: "subgenre",
    name: "Metroidvania",
  },

  "battle-royale": {
    category: "subgenre",
    name: "Battle Royale",
  },

  "survival-horror": {
    category: "subgenre",
    name: "Survival Horror",
  },

  "visual-novel": {
    category: "subgenre",
    name: "Visual Novel",
  },

  "walking-simulator": {
    category: "subgenre",
    name: "Walking Simulator",
  },

  "city-builder": {
    category: "subgenre",
    name: "City Builder",
  },

  "grand-strategy": {
    category: "subgenre",
    name: "Grand Strategy",
  },

  rts: {
    category: "subgenre",
    name: "RTS",
  },

  moba: {
    category: "subgenre",
    name: "MOBA",
  },

  tcg: {
    category: "subgenre",
    name: "Trading Card Game",
  },

  "dungeon-crawler": {
    category: "subgenre",
    name: "Dungeon Crawler",
  },

  football: {
    category: "subgenre",
    name: "Football",
  },

  // =========================================================
  // STRUCTURE
  // =========================================================

  roguelike: {
    category: "structure",
    name: "Roguelike",
  },

  roguelite: {
    category: "structure",
    name: "Roguelite",
  },

  "souls-like": {
    category: "structure",
    name: "Souls-like",
  },

  "open-world": {
    category: "structure",
    name: "Open World",
  },

  linear: {
    category: "structure",
    name: "Linear",
  },

  sandbox: {
    category: "structure",
    name: "Sandbox",
  },

  "immersive-sim": {
    category: "structure",
    name: "Immersive Sim",
  },

  procedural: {
    category: "structure",
    name: "Procedural Generation",
  },

  "hub-based": {
    category: "structure",
    name: "Hub Based",
  },

  "mission-based": {
    category: "structure",
    name: "Mission Based",
  },

  branching: {
    category: "structure",
    name: "Branching Paths",
  },

  "match-based": {
    category: "structure",
    name: "Match Based",
  },

  // =========================================================
  // MECHANICS
  // =========================================================

  stealth: {
    category: "mechanic",
    name: "Stealth",
  },

  crafting: {
    category: "mechanic",
    name: "Crafting",
  },

  building: {
    category: "mechanic",
    name: "Building",
  },

  exploration: {
    category: "mechanic",
    name: "Exploration",
  },

  loot: {
    category: "mechanic",
    name: "Loot",
  },

  "character-builds": {
    category: "mechanic",
    name: "Character Builds",
  },

  deckbuilder: {
    category: "mechanic",
    name: "Deckbuilder",
  },

  permadeath: {
    category: "mechanic",
    name: "Permadeath",
  },

  "turn-based": {
    category: "mechanic",
    name: "Turn-Based",
  },

  "real-time-combat": {
    category: "mechanic",
    name: "Real-Time Combat",
  },

  "hack-and-slash": {
    category: "mechanic",
    name: "Hack & Slash",
  },

  combos: {
    category: "mechanic",
    name: "Combos",
  },

  parry: {
    category: "mechanic",
    name: "Parry",
  },

  "resource-management": {
    category: "mechanic",
    name: "Resource Management",
  },

  management: {
    category: "mechanic",
    name: "Management",
  },

  trading: {
    category: "mechanic",
    name: "Trading",
  },

  driving: {
    category: "mechanic",
    name: "Driving",
  },

  drifting: {
    category: "mechanic",
    name: "Drifting",
  },

  physics: {
    category: "mechanic",
    name: "Physics",
  },

  "puzzle-solving": {
    category: "mechanic",
    name: "Puzzle Solving",
  },

  "choices-matter": {
    category: "mechanic",
    name: "Choices Matter",
  },

  "multiple-endings": {
    category: "mechanic",
    name: "Multiple Endings",
  },

  "character-customization": {
    category: "mechanic",
    name: "Character Customization",
  },

  "team-based": {
    category: "mechanic",
    name: "Team Based",
  },

  economy: {
    category: "mechanic",
    name: "Economy",
  },

  "army-management": {
    category: "mechanic",
    name: "Army Management",
  },
  // =========================================================
  // PROGRESSION
  // =========================================================

  "grind-heavy": {
    category: "progression",
    name: "Grind Heavy",
  },

  "skill-tree": {
    category: "progression",
    name: "Skill Tree",
  },

  "buildcraft-heavy": {
    category: "progression",
    name: "Buildcraft Heavy",
  },

  "loot-driven": {
    category: "progression",
    name: "Loot Driven",
  },

  "narrative-driven": {
    category: "progression",
    name: "Narrative Driven",
  },

  "level-based": {
    category: "progression",
    name: "Level Based",
  },

  "gear-progression": {
    category: "progression",
    name: "Gear Progression",
  },

  // =========================================================
  // THEME
  // =========================================================

  fantasy: {
    category: "theme",
    name: "Fantasy",
  },

  "dark-fantasy": {
    category: "theme",
    name: "Dark Fantasy",
  },

  medieval: {
    category: "theme",
    name: "Medieval",
  },

  magic: {
    category: "theme",
    name: "Magic",
  },

  "sci-fi": {
    category: "theme",
    name: "Sci-Fi",
  },

  cyberpunk: {
    category: "theme",
    name: "Cyberpunk",
  },

  futuristic: {
    category: "theme",
    name: "Futuristic",
  },

  "post-apocalyptic": {
    category: "theme",
    name: "Post Apocalyptic",
  },

  space: {
    category: "theme",
    name: "Space",
  },

  aliens: {
    category: "theme",
    name: "Aliens",
  },

  zombies: {
    category: "theme",
    name: "Zombies",
  },

  military: {
    category: "theme",
    name: "Military",
  },

  war: {
    category: "theme",
    name: "War",
  },

  detective: {
    category: "theme",
    name: "Detective",
  },

  crime: {
    category: "theme",
    name: "Crime",
  },

  mystery: {
    category: "theme",
    name: "Mystery",
  },

  noir: {
    category: "theme",
    name: "Noir",
  },

  western: {
    category: "theme",
    name: "Western",
  },

  pirates: {
    category: "theme",
    name: "Pirates",
  },

  mythology: {
    category: "theme",
    name: "Mythology",
  },

  "greek-mythology": {
    category: "theme",
    name: "Greek Mythology",
  },

  "ancient-greece": {
    category: "theme",
    name: "Ancient Greece",
  },

  "norse-mythology": {
    category: "theme",
    name: "Norse Mythology",
  },

  superhero: {
    category: "theme",
    name: "Superhero",
  },

  romance: {
    category: "theme",
    name: "Romance",
  },

  school: {
    category: "theme",
    name: "School",
  },

  politics: {
    category: "theme",
    name: "Politics",
  },

  lovecraftian: {
    category: "theme",
    name: "Lovecraftian",
  },

  historical: {
    category: "theme",
    name: "Historical",
  },

  "real-world": {
    category: "theme",
    name: "Real World",
  },

  // =========================================================
  // AESTHETIC
  // =========================================================

  retro: {
    category: "aesthetic",
    name: "Retro",
  },

  "pixel-art": {
    category: "aesthetic",
    name: "Pixel Art",
  },

  stylized: {
    category: "aesthetic",
    name: "Stylized",
  },

  realistic: {
    category: "aesthetic",
    name: "Realistic",
  },

  "hand-drawn": {
    category: "aesthetic",
    name: "Hand Drawn",
  },

  anime: {
    category: "aesthetic",
    name: "Anime",
  },

  gothic: {
    category: "aesthetic",
    name: "Gothic",
  },

  cinematic: {
    category: "aesthetic",
    name: "Cinematic",
  },

  minimalist: {
    category: "aesthetic",
    name: "Minimalist",
  },

  surreal: {
    category: "aesthetic",
    name: "Surreal",
  },

  // =========================================================
  // MOOD
  // =========================================================

  dark: {
    category: "mood",
    name: "Dark",
  },

  atmospheric: {
    category: "mood",
    name: "Atmospheric",
  },

  relaxing: {
    category: "mood",
    name: "Relaxing",
  },

  chill: {
    category: "mood",
    name: "Chill",
  },

  emotional: {
    category: "mood",
    name: "Emotional",
  },

  tense: {
    category: "mood",
    name: "Tense",
  },

  scary: {
    category: "mood",
    name: "Scary",
  },

  funny: {
    category: "mood",
    name: "Funny",
  },

  addictive: {
    category: "mood",
    name: "Addictive",
  },

  philosophical: {
    category: "mood",
    name: "Philosophical",
  },

  cozy: {
    category: "mood",
    name: "Cozy",
  },

  competitive: {
    category: "mood",
    name: "Competitive",
  },
  "family-friendly": {
    category: "mood",
    name: "Family Friendly",
  },
  // =========================================================
  // PERSPECTIVE
  // =========================================================

  "first-person": {
    category: "perspective",
    name: "First Person",
  },

  "third-person": {
    category: "perspective",
    name: "Third Person",
  },

  isometric: {
    category: "perspective",
    name: "Isometric",
  },

  "top-down": {
    category: "perspective",
    name: "Top Down",
  },

  sideview: {
    category: "perspective",
    name: "Side View",
  },

  // =========================================================
  // MODE
  // =========================================================

  singleplayer: {
    category: "mode",
    name: "Singleplayer",
  },

  multiplayer: {
    category: "mode",
    name: "Multiplayer",
  },

  coop: {
    category: "mode",
    name: "Co-op",
  },

  "online-pvp": {
    category: "mode",
    name: "Online PvP",
  },

  "split-screen": {
    category: "mode",
    name: "Split Screen",
  },

  "local-multiplayer": {
    category: "mode",
    name: "Local Multiplayer",
  },

  ranked: {
    category: "mode",
    name: "Ranked",
  },

  // =========================================================
  // PACE
  // =========================================================

  "fast-paced": {
    category: "pace",
    name: "Fast Paced",
  },

  "slow-paced": {
    category: "pace",
    name: "Slow Paced",
  },

  tactical: {
    category: "pace",
    name: "Tactical",
  },

  methodical: {
    category: "pace",
    name: "Methodical",
  },

  "high-reflex": {
    category: "pace",
    name: "High Reflex",
  },

  hardcore: {
    category: "pace",
    name: "Hardcore",
  },

  casual: {
    category: "pace",
    name: "Casual",
  },

  arcade: {
    category: "pace",
    name: "Arcade",
  },
} satisfies Record<string, { category: Category; name: string }>;

export type TagSlug = keyof typeof TAGS;
