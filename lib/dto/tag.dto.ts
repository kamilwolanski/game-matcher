import type { Tag } from "@/app/generated/prisma/client";

export type ShortTag = Pick<Tag, "slug" | "name" | "gamesCount"> & {
    strength?: 1 | 2 | 3
};
