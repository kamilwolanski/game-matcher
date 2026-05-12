import { SearchGameResult } from "../dto/search-game.dto";

const BLOCKED_KEYWORDS = [
  "special-edition",
  "complete-edition",
  "goty",
  "game-of-the-year",
  "gold-edition",
  "ultimate-edition",
  "definitive-edition",
  "enhanced-edition",
  "directors-cut",
  "director-s-cut",
  "bundle",
  "demo",
  "soundtrack",
  "expansion",
  "dlc",
  "collection",
  "trilogy",
  "anthology",
  "remastered-collection",
];

function isFutureRelease(released: string | null) {
  if (!released) {
    return true;
  }

  return new Date(released) > new Date();
}

export function shouldHideGame(game: Omit<SearchGameResult, 'image' | 'rawgId'>) {
  if (game.tba) {
    return true;
  }

  if (isFutureRelease(game.released)) {
    return true;
  }

  if (game.added < 10) {
    return true;
  }

  return BLOCKED_KEYWORDS.some((keyword) => game.slug.includes(keyword));
}
