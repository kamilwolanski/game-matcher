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
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(game.name));
}
