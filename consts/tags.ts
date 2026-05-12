import { ShortTag } from "@/lib/dto/tag.dto";

export type TagCategory =
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

export const BASE_TAG_SECTIONS = [
  {
    name: "Gameplay",
  },
  {
    name: "Style & Theme",
  },
  {
    name: "Experience",
  },
  {
    name: "Perspective",
  },
] as const;

export const DEFAULT_BASE_TAG_SECTION = BASE_TAG_SECTIONS[0].name;

export type BaseTagSection = (typeof BASE_TAG_SECTIONS)[number]["name"];

export type BaseTag = {
  slug: string;
  category: TagCategory;
  name: string;
  section: BaseTagSection;
};

export const CATEGORY_WEIGHTS: Record<TagCategory, number> = {
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

const BASE_TAGS: BaseTag[] = [
  // =========================================================
  // GAMEPLAY
  // =========================================================

  // Genres
  { slug: "action", category: "genre", name: "Action", section: "Gameplay" },
  {
    slug: "adventure",
    category: "genre",
    name: "Adventure",
    section: "Gameplay",
  },
  { slug: "rpg", category: "genre", name: "RPG", section: "Gameplay" },
  {
    slug: "strategy",
    category: "genre",
    name: "Strategy",
    section: "Gameplay",
  },
  { slug: "shooter", category: "genre", name: "Shooter", section: "Gameplay" },
  {
    slug: "simulation",
    category: "genre",
    name: "Simulation",
    section: "Gameplay",
  },
  {
    slug: "platformer",
    category: "genre",
    name: "Platformer",
    section: "Gameplay",
  },
  { slug: "racing", category: "genre", name: "Racing", section: "Gameplay" },
  { slug: "sports", category: "genre", name: "Sports", section: "Gameplay" },
  {
    slug: "fighting",
    category: "genre",
    name: "Fighting",
    section: "Gameplay",
  },
  { slug: "horror", category: "genre", name: "Horror", section: "Gameplay" },
  {
    slug: "survival",
    category: "genre",
    name: "Survival",
    section: "Gameplay",
  },
  { slug: "puzzle", category: "genre", name: "Puzzle", section: "Gameplay" },

  // Subgenres
  { slug: "jrpg", category: "subgenre", name: "JRPG", section: "Gameplay" },
  { slug: "crpg", category: "subgenre", name: "CRPG", section: "Gameplay" },
  {
    slug: "arpg",
    category: "subgenre",
    name: "Action RPG",
    section: "Gameplay",
  },
  {
    slug: "srpg",
    category: "subgenre",
    name: "Strategy RPG",
    section: "Gameplay",
  },
  {
    slug: "drpg",
    category: "subgenre",
    name: "Dungeon RPG",
    section: "Gameplay",
  },

  { slug: "fps", category: "subgenre", name: "FPS", section: "Gameplay" },
  { slug: "tps", category: "subgenre", name: "TPS", section: "Gameplay" },
  {
    slug: "boomer-shooter",
    category: "subgenre",
    name: "Boomer Shooter",
    section: "Gameplay",
  },
  {
    slug: "hero-shooter",
    category: "subgenre",
    name: "Hero Shooter",
    section: "Gameplay",
  },
  {
    slug: "looter-shooter",
    category: "subgenre",
    name: "Looter Shooter",
    section: "Gameplay",
  },
  {
    slug: "arena-shooter",
    category: "subgenre",
    name: "Arena Shooter",
    section: "Gameplay",
  },
  {
    slug: "extraction-shooter",
    category: "subgenre",
    name: "Extraction Shooter",
    section: "Gameplay",
  },
  {
    slug: "tactical-shooter",
    category: "subgenre",
    name: "Tactical Shooter",
    section: "Gameplay",
  },
  {
    slug: "bullet-hell",
    category: "subgenre",
    name: "Bullet Hell",
    section: "Gameplay",
  },

  {
    slug: "metroidvania",
    category: "subgenre",
    name: "Metroidvania",
    section: "Gameplay",
  },
  {
    slug: "soulsvania",
    category: "subgenre",
    name: "Soulsvania",
    section: "Gameplay",
  },

  {
    slug: "battle-royale",
    category: "subgenre",
    name: "Battle Royale",
    section: "Gameplay",
  },
  {
    slug: "survival-horror",
    category: "subgenre",
    name: "Survival Horror",
    section: "Gameplay",
  },

  {
    slug: "visual-novel",
    category: "subgenre",
    name: "Visual Novel",
    section: "Gameplay",
  },
  {
    slug: "walking-simulator",
    category: "subgenre",
    name: "Walking Simulator",
    section: "Gameplay",
  },

  {
    slug: "city-builder",
    category: "subgenre",
    name: "City Builder",
    section: "Gameplay",
  },
  {
    slug: "grand-strategy",
    category: "subgenre",
    name: "Grand Strategy",
    section: "Gameplay",
  },
  {
    slug: "tower-defense",
    category: "subgenre",
    name: "Tower Defense",
    section: "Gameplay",
  },
  { slug: "rts", category: "subgenre", name: "RTS", section: "Gameplay" },

  {
    slug: "auto-battler",
    category: "subgenre",
    name: "Auto Battler",
    section: "Gameplay",
  },
  { slug: "moba", category: "subgenre", name: "MOBA", section: "Gameplay" },
  {
    slug: "tcg",
    category: "subgenre",
    name: "Trading Card Game",
    section: "Gameplay",
  },

  {
    slug: "dungeon-crawler",
    category: "subgenre",
    name: "Dungeon Crawler",
    section: "Gameplay",
  },

  {
    slug: "football",
    category: "subgenre",
    name: "Football",
    section: "Gameplay",
  },

  {
    slug: "party-game",
    category: "subgenre",
    name: "Party Game",
    section: "Gameplay",
  },

  {
    slug: "point-and-click",
    category: "subgenre",
    name: "Point & Click",
    section: "Gameplay",
  },

  {
    slug: "farming-sim",
    category: "subgenre",
    name: "Farming Sim",
    section: "Gameplay",
  },

  {
    slug: "survival-crafting",
    category: "subgenre",
    name: "Survival Crafting",
    section: "Gameplay",
  },

  // Structure
  {
    slug: "roguelike",
    category: "structure",
    name: "Roguelike",
    section: "Gameplay",
  },
  {
    slug: "roguelite",
    category: "structure",
    name: "Roguelite",
    section: "Gameplay",
  },
  {
    slug: "souls-like",
    category: "structure",
    name: "Souls-like",
    section: "Gameplay",
  },
  {
    slug: "open-world",
    category: "structure",
    name: "Open World",
    section: "Gameplay",
  },
  {
    slug: "linear",
    category: "structure",
    name: "Linear",
    section: "Gameplay",
  },
  {
    slug: "sandbox",
    category: "structure",
    name: "Sandbox",
    section: "Gameplay",
  },
  {
    slug: "immersive-sim",
    category: "structure",
    name: "Immersive Sim",
    section: "Gameplay",
  },
  {
    slug: "procedural",
    category: "structure",
    name: "Procedural Generation",
    section: "Gameplay",
  },
  {
    slug: "hub-based",
    category: "structure",
    name: "Hub Based",
    section: "Gameplay",
  },
  {
    slug: "mission-based",
    category: "structure",
    name: "Mission Based",
    section: "Gameplay",
  },
  {
    slug: "branching",
    category: "structure",
    name: "Branching Paths",
    section: "Gameplay",
  },
  {
    slug: "match-based",
    category: "structure",
    name: "Match Based",
    section: "Gameplay",
  },

  // Mechanics
  {
    slug: "stealth",
    category: "mechanic",
    name: "Stealth",
    section: "Gameplay",
  },
  {
    slug: "crafting",
    category: "mechanic",
    name: "Crafting",
    section: "Gameplay",
  },
  {
    slug: "building",
    category: "mechanic",
    name: "Building",
    section: "Gameplay",
  },
  {
    slug: "exploration",
    category: "mechanic",
    name: "Exploration",
    section: "Gameplay",
  },
  { slug: "loot", category: "mechanic", name: "Loot", section: "Gameplay" },
  {
    slug: "character-builds",
    category: "mechanic",
    name: "Character Builds",
    section: "Gameplay",
  },
  {
    slug: "deckbuilder",
    category: "mechanic",
    name: "Deckbuilder",
    section: "Gameplay",
  },
  {
    slug: "permadeath",
    category: "mechanic",
    name: "Permadeath",
    section: "Gameplay",
  },
  {
    slug: "turn-based",
    category: "mechanic",
    name: "Turn-Based",
    section: "Gameplay",
  },
  {
    slug: "real-time-combat",
    category: "mechanic",
    name: "Real-Time Combat",
    section: "Gameplay",
  },
  {
    slug: "hack-and-slash",
    category: "mechanic",
    name: "Hack & Slash",
    section: "Gameplay",
  },
  { slug: "combos", category: "mechanic", name: "Combos", section: "Gameplay" },
  { slug: "parry", category: "mechanic", name: "Parry", section: "Gameplay" },
  {
    slug: "resource-management",
    category: "mechanic",
    name: "Resource Management",
    section: "Gameplay",
  },
  {
    slug: "management",
    category: "mechanic",
    name: "Management",
    section: "Gameplay",
  },
  {
    slug: "trading",
    category: "mechanic",
    name: "Trading",
    section: "Gameplay",
  },
  {
    slug: "driving",
    category: "mechanic",
    name: "Driving",
    section: "Gameplay",
  },
  {
    slug: "drifting",
    category: "mechanic",
    name: "Drifting",
    section: "Gameplay",
  },
  {
    slug: "physics",
    category: "mechanic",
    name: "Physics",
    section: "Gameplay",
  },
  {
    slug: "puzzle-solving",
    category: "mechanic",
    name: "Puzzle Solving",
    section: "Gameplay",
  },
  {
    slug: "choices-matter",
    category: "mechanic",
    name: "Choices Matter",
    section: "Gameplay",
  },
  {
    slug: "multiple-endings",
    category: "mechanic",
    name: "Multiple Endings",
    section: "Gameplay",
  },
  {
    slug: "character-customization",
    category: "mechanic",
    name: "Character Customization",
    section: "Gameplay",
  },
  {
    slug: "team-based",
    category: "mechanic",
    name: "Team Based",
    section: "Gameplay",
  },
  {
    slug: "economy",
    category: "mechanic",
    name: "Economy",
    section: "Gameplay",
  },
  {
    slug: "army-management",
    category: "mechanic",
    name: "Army Management",
    section: "Gameplay",
  },
  {
    slug: "automation",
    category: "mechanic",
    name: "Automation",
    section: "Gameplay",
  },
  {
    slug: "dialogue-heavy",
    category: "mechanic",
    name: "Dialogue Heavy",
    section: "Gameplay",
  },
  {
    slug: "tactical",
    category: "mechanic",
    name: "Tactical",
    section: "Gameplay",
  },

  // =========================================================
  // EXPERIENCE
  // =========================================================

  // Progression
  {
    slug: "grind-heavy",
    category: "progression",
    name: "Grind Heavy",
    section: "Experience",
  },
  {
    slug: "skill-tree",
    category: "progression",
    name: "Skill Tree",
    section: "Experience",
  },
  {
    slug: "buildcraft-heavy",
    category: "progression",
    name: "Buildcraft Heavy",
    section: "Experience",
  },
  {
    slug: "loot-driven",
    category: "progression",
    name: "Loot Driven",
    section: "Experience",
  },
  {
    slug: "narrative-driven",
    category: "progression",
    name: "Narrative Driven",
    section: "Experience",
  },
  {
    slug: "level-based",
    category: "progression",
    name: "Level Based",
    section: "Experience",
  },
  {
    slug: "gear-progression",
    category: "progression",
    name: "Gear Progression",
    section: "Experience",
  },

  // Mood
  { slug: "dark", category: "mood", name: "Dark", section: "Experience" },
  {
    slug: "atmospheric",
    category: "mood",
    name: "Atmospheric",
    section: "Experience",
  },
  {
    slug: "relaxing",
    category: "mood",
    name: "Relaxing",
    section: "Experience",
  },
  { slug: "chill", category: "mood", name: "Chill", section: "Experience" },
  {
    slug: "emotional",
    category: "mood",
    name: "Emotional",
    section: "Experience",
  },
  {
    slug: "immersive",
    category: "mood",
    name: "Immersive",
    section: "Experience",
  },
  { slug: "tense", category: "mood", name: "Tense", section: "Experience" },
  { slug: "scary", category: "mood", name: "Scary", section: "Experience" },
  { slug: "funny", category: "mood", name: "Funny", section: "Experience" },
  {
    slug: "addictive",
    category: "mood",
    name: "Addictive",
    section: "Experience",
  },
  {
    slug: "philosophical",
    category: "mood",
    name: "Philosophical",
    section: "Experience",
  },
  { slug: "cozy", category: "mood", name: "Cozy", section: "Experience" },
  {
    slug: "competitive",
    category: "mood",
    name: "Competitive",
    section: "Experience",
  },
  {
    slug: "family-friendly",
    category: "mood",
    name: "Family Friendly",
    section: "Experience",
  },

  // Pace
  {
    slug: "fast-paced",
    category: "pace",
    name: "Fast Paced",
    section: "Experience",
  },
  {
    slug: "slow-paced",
    category: "pace",
    name: "Slow Paced",
    section: "Experience",
  },
  {
    slug: "methodical",
    category: "pace",
    name: "Methodical",
    section: "Experience",
  },
  {
    slug: "high-reflex",
    category: "pace",
    name: "High Reflex",
    section: "Experience",
  },
  {
    slug: "challenging",
    category: "pace",
    name: "Challenging",
    section: "Experience",
  },
  { slug: "casual", category: "pace", name: "Casual", section: "Experience" },
  { slug: "arcade", category: "pace", name: "Arcade", section: "Experience" },

  // =========================================================
  // STYLE & THEME
  // =========================================================

  // Theme
  {
    slug: "fantasy",
    category: "theme",
    name: "Fantasy",
    section: "Style & Theme",
  },
  {
    slug: "dark-fantasy",
    category: "theme",
    name: "Dark Fantasy",
    section: "Style & Theme",
  },
  {
    slug: "medieval",
    category: "theme",
    name: "Medieval",
    section: "Style & Theme",
  },
  { slug: "magic", category: "theme", name: "Magic", section: "Style & Theme" },
  {
    slug: "sci-fi",
    category: "theme",
    name: "Sci-Fi",
    section: "Style & Theme",
  },
  {
    slug: "cyberpunk",
    category: "theme",
    name: "Cyberpunk",
    section: "Style & Theme",
  },
  {
    slug: "futuristic",
    category: "theme",
    name: "Futuristic",
    section: "Style & Theme",
  },
  {
    slug: "post-apocalyptic",
    category: "theme",
    name: "Post Apocalyptic",
    section: "Style & Theme",
  },
  { slug: "space", category: "theme", name: "Space", section: "Style & Theme" },
  {
    slug: "aliens",
    category: "theme",
    name: "Aliens",
    section: "Style & Theme",
  },
  {
    slug: "zombies",
    category: "theme",
    name: "Zombies",
    section: "Style & Theme",
  },
  {
    slug: "military",
    category: "theme",
    name: "Military",
    section: "Style & Theme",
  },
  { slug: "war", category: "theme", name: "War", section: "Style & Theme" },
  {
    slug: "detective",
    category: "theme",
    name: "Detective",
    section: "Style & Theme",
  },
  { slug: "crime", category: "theme", name: "Crime", section: "Style & Theme" },
  {
    slug: "mystery",
    category: "theme",
    name: "Mystery",
    section: "Style & Theme",
  },
  { slug: "noir", category: "theme", name: "Noir", section: "Style & Theme" },
  {
    slug: "western",
    category: "theme",
    name: "Western",
    section: "Style & Theme",
  },
  {
    slug: "pirates",
    category: "theme",
    name: "Pirates",
    section: "Style & Theme",
  },
  {
    slug: "mythology",
    category: "theme",
    name: "Mythology",
    section: "Style & Theme",
  },
  {
    slug: "greek-mythology",
    category: "theme",
    name: "Greek Mythology",
    section: "Style & Theme",
  },
  {
    slug: "ancient-egypt",
    category: "theme",
    name: "Ancient Egypt",
    section: "Style & Theme",
  },
  {
    slug: "ancient-greece",
    category: "theme",
    name: "Ancient Greece",
    section: "Style & Theme",
  },
  {
    slug: "norse-mythology",
    category: "theme",
    name: "Norse Mythology",
    section: "Style & Theme",
  },
  {
    slug: "superhero",
    category: "theme",
    name: "Superhero",
    section: "Style & Theme",
  },
  {
    slug: "romance",
    category: "theme",
    name: "Romance",
    section: "Style & Theme",
  },
  {
    slug: "school",
    category: "theme",
    name: "School",
    section: "Style & Theme",
  },
  {
    slug: "politics",
    category: "theme",
    name: "Politics",
    section: "Style & Theme",
  },
  {
    slug: "lovecraftian",
    category: "theme",
    name: "Lovecraftian",
    section: "Style & Theme",
  },
  {
    slug: "historical",
    category: "theme",
    name: "Historical",
    section: "Style & Theme",
  },
  {
    slug: "real-world",
    category: "theme",
    name: "Real World",
    section: "Style & Theme",
  },
  {
    slug: "organized-crime",
    category: "theme",
    name: "Organized Crime",
    section: "Style & Theme",
  },
  {
    slug: "dystopian",
    category: "theme",
    name: "Dystopian",
    section: "Style & Theme",
  },
  {
    slug: "modern",
    category: "theme",
    name: "Modern",
    section: "Style & Theme",
  },
  {
    slug: "underwater",
    category: "theme",
    name: "Underwater",
    section: "Style & Theme",
  },
  {
    slug: "samurai",
    category: "theme",
    name: "Samurai",
    section: "Style & Theme",
  },
  {
    slug: "urban-fantasy",
    category: "theme",
    name: "Urban Fantasy",
    section: "Style & Theme",
  },
  {
    slug: "steampunk",
    category: "theme",
    name: "Steampunk",
    section: "Style & Theme",
  },
  {
    slug: "vampires",
    category: "theme",
    name: "Vampires",
    section: "Style & Theme",
  },

  // Aesthetic
  {
    slug: "retro",
    category: "aesthetic",
    name: "Retro",
    section: "Style & Theme",
  },
  {
    slug: "pixel-art",
    category: "aesthetic",
    name: "Pixel Art",
    section: "Style & Theme",
  },
  {
    slug: "stylized",
    category: "aesthetic",
    name: "Stylized",
    section: "Style & Theme",
  },
  {
    slug: "realistic",
    category: "aesthetic",
    name: "Realistic",
    section: "Style & Theme",
  },
  {
    slug: "hand-drawn",
    category: "aesthetic",
    name: "Hand Drawn",
    section: "Style & Theme",
  },
  {
    slug: "anime",
    category: "aesthetic",
    name: "Anime",
    section: "Style & Theme",
  },
  {
    slug: "gothic",
    category: "aesthetic",
    name: "Gothic",
    section: "Style & Theme",
  },
  {
    slug: "cinematic",
    category: "aesthetic",
    name: "Cinematic",
    section: "Style & Theme",
  },
  {
    slug: "minimalist",
    category: "aesthetic",
    name: "Minimalist",
    section: "Style & Theme",
  },
  {
    slug: "surreal",
    category: "aesthetic",
    name: "Surreal",
    section: "Style & Theme",
  },

  // =========================================================
  // PERSPECTIVE & MODE
  // =========================================================

  // Perspective
  {
    slug: "first-person",
    category: "perspective",
    name: "First Person",
    section: "Perspective",
  },
  {
    slug: "third-person",
    category: "perspective",
    name: "Third Person",
    section: "Perspective",
  },
  {
    slug: "isometric",
    category: "perspective",
    name: "Isometric",
    section: "Perspective",
  },
  {
    slug: "top-down",
    category: "perspective",
    name: "Top Down",
    section: "Perspective",
  },
  {
    slug: "sideview",
    category: "perspective",
    name: "Side View",
    section: "Perspective",
  },

  // Mode
  {
    slug: "singleplayer",
    category: "mode",
    name: "Singleplayer",
    section: "Perspective",
  },
  {
    slug: "multiplayer",
    category: "mode",
    name: "Multiplayer",
    section: "Perspective",
  },
  { slug: "coop", category: "mode", name: "Co-op", section: "Perspective" },
  {
    slug: "online-pvp",
    category: "mode",
    name: "Online PvP",
    section: "Perspective",
  },
  {
    slug: "split-screen",
    category: "mode",
    name: "Split Screen",
    section: "Perspective",
  },
  {
    slug: "local-multiplayer",
    category: "mode",
    name: "Local Multiplayer",
    section: "Perspective",
  },
  { slug: "ranked", category: "mode", name: "Ranked", section: "Perspective" },
  {
    slug: "shared-world",
    category: "mode",
    name: "Shared World",
    section: "Perspective",
  },
  {
    slug: "drop-in-drop-out",
    category: "mode",
    name: "Drop-In / Drop-Out",
    section: "Perspective",
  },
  {
    slug: "online-pve",
    category: "mode",
    name: "Online PvE",
    section: "Perspective",
  },
];

export const DEFAULT_VISIBLE_TAG_SLUGS = [
  // Gameplay
  "rpg",
  "action",
  "adventure",
  "strategy",
  "shooter",
  "simulation",
  "survival",
  "horror",
  "platformer",
  "souls-like",
  "racing",
  "puzzle",
  "fps",
  "tps",
  "hack-and-slash",
  "moba",
  "rts",
  "open-world",
  "sandbox",
  "exploration",
  "city-builder",
  "battle-royale",
  "dungeon-crawler",
  "choices-matter",
  "party-game",
  "sports",
  "survival-horror",
  "crafting",

  // Experience

  "atmospheric",
  "immersive",
  "challenging",
  "relaxing",
  "emotional",
  "casual",
  "arcade",
  "cozy",
  "funny",
  "scary",
  "tense",
  "competitive",
  "dark",
  "family-friendly",
  "chill",
  "fast-paced",
  "slow-paced",

  // Style & Theme
  "fantasy",
  "sci-fi",
  "cyberpunk",
  "post-apocalyptic",
  "historical",
  "dark-fantasy",
  "steampunk",
  "medieval",
  "magic",
  "dystopian",
  "space",
  "military",
  "realistic",
  "stylized",
  "cinematic",
  "vampires",
  "zombies",
  "pirates",
  "western",
  "crime",
  "war",
  "organized-crime",
  "detective",
  "noir",
  "underwater",
  "mythology",
  "pixel-art",
  "gothic",
  "anime",
  
  // Perspective & Mode
  "singleplayer",
  "multiplayer",
  "coop",
  "online-pvp",
  "first-person",
  "third-person",
  "top-down",
  "isometric",
  "sideview",
  "local-multiplayer",
  "split-screen",
  "ranked",
] as const;

export const TAGS = BASE_TAGS.map((tag) => ({
  ...tag,
  defaultVisible: DEFAULT_VISIBLE_TAG_SLUGS.includes(
    tag.slug as (typeof DEFAULT_VISIBLE_TAG_SLUGS)[number],
  ),
}));

export const TAGS_AS_OBJECT = Object.fromEntries(
  TAGS.map((tag) => [
    tag.slug,
    {
      ...tag,
    },
  ]),
);

export const TAG_SLUGS = TAGS.map((tag) => tag.slug);

export function groupBaseTagsBySection(tags: ShortTag[], onlyDefault: boolean) {
  return tags.reduce(
    (acc, tag) => {
      const config = TAGS_AS_OBJECT[tag.slug];

      if (!config) return acc;

      if (onlyDefault && !config.defaultVisible) {
        return acc;
      }

      acc[config.section].push(tag);

      return acc;
    },
    Object.fromEntries(
      BASE_TAG_SECTIONS.map((section) => [section.name, [] as ShortTag[]]),
    ) as Record<BaseTagSection, ShortTag[]>,
  );
}
export function getDefaultVisibleTags(tags: ShortTag[]) {
  const tagMap = new Map(tags.map((tag) => [tag.slug, tag]));

  return DEFAULT_VISIBLE_TAG_SLUGS.map((slug) => tagMap.get(slug)).filter(
    Boolean,
  ) as ShortTag[];
}
