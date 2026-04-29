import type { Tag } from "@/app/generated/prisma/client";

export type ShortTag = Pick<Tag, "slug" | "name">;
