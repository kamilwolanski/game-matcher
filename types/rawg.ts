export type RawgTag = {
  id: number;
  name: string;
  slug: string;
  language: string;
  games_count: number;
};

export type RawgGenre = {
  id: number;
  name: string;
  slug: string;
};

export type RawgTagLike = {
  slug: string;
  name: string;
};

export type RawgGame = {
  id: number;
  name: string;
  slug: string;

  description_raw?: string;
  background_image?: string;

  rating?: number;
  added?: number;

  released?: string;

  platforms?: {
    platform: {
      name: string;
    };
  }[];

  tags: RawgTag[];
  genres: RawgGenre[];
};

export type RawgSearchGame = {
  id: number;
  name: string;
  background_image: string | null;
  released: string | null;
};
