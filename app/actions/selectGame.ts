"use server";

import { selectGameByRawgId } from "@/lib/services/game.service";

export async function selectGame(rawgId: number) {
  return selectGameByRawgId(rawgId);
}
