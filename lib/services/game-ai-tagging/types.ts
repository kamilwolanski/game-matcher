export type TagStrength = 1 | 2 | 3;

export type GameAiTag = {
  slug: string;
  name: string;
  strength: TagStrength;
};

export type RawAiTag = Pick<GameAiTag, "slug" | "strength">;

export type GameTaggingResponse = {
  tags: RawAiTag[];
};
