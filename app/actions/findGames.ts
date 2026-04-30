"use server";

import { GameDto } from "@/lib/dto/game.dto";
import { ShortTag } from "@/lib/dto/tag.dto";
import { findMatchingGames } from "@/lib/services/game-matcher.service";

export async function findGames(
  selectedGames: GameDto[],
  activeTags: ShortTag[],
) {
  return findMatchingGames(selectedGames, activeTags);
}
