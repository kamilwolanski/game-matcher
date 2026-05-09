"use server";

import { getOrCreateGameByRawgId } from "@/lib/services/game.service";

export async function getOrCreateGame(rawgId: number) {
  return getOrCreateGameByRawgId(rawgId);
}
