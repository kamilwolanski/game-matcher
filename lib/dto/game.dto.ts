import type { Game } from "@/app/generated/prisma/client";
import type { ShortTag } from "./tag.dto";

export type GameDto = Omit<Game, "tags"> & {
  tags: ShortTag[];
};
