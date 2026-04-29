"use client";

import { useMemo, useState, useTransition } from "react";
import { GameSearch } from "./GameSearch";
import { selectGame } from "../actions/selectGame";
import { TagSelector } from "./TagSelector";
import { type GameDto } from "@/lib/dto/game.dto";
import { type SearchGameResult } from "@/lib/dto/search-game.dto";
import { type ShortTag } from "@/lib/dto/tag.dto";

type Props = {
  availableTags: ShortTag[];
};

type TagWithCount = ShortTag & {
  count: number;
};

export function HomeInteractiveSection({ availableTags }: Props) {
  const [selected, setSelected] = useState<SearchGameResult[]>([]);
  const [selectedGames, setSelectedGames] = useState<GameDto[]>([]);
  const [activeTags, setActiveTags] = useState<ShortTag[]>([]);
  const [randomSeed] = useState(Math.random);
  const [, startTransition] = useTransition();

  const addGame = (game: SearchGameResult) => {
    const isAlreadySelected = selected.some((g) => g.rawgId === game.rawgId);

    if (selected.length >= 5 || isAlreadySelected) return;

    setSelected((prev) => [...prev, game]);

    startTransition(async () => {
      try {
        const selectedGame = await selectGame(game.rawgId);
        setSelectedGames((prev) => [...prev, selectedGame]);
      } catch (error) {
        console.error("Error selecting game:", error);
      }
    });
  };

  const removeGame = (id: number) => {
    setSelected((prev) => prev.filter((game) => game.rawgId !== id));
    setSelectedGames((prev) => prev.filter((game) => game.rawgId !== id));
  };

  const toggleTag = (tag: ShortTag) => {
    setActiveTags((prev) => {
      const isActive = prev.some((activeTag) => activeTag.slug === tag.slug);

      return isActive
        ? prev.filter((activeTag) => activeTag.slug !== tag.slug)
        : [...prev, tag];
    });
  };

  const suggestedTags = useMemo(() => {
    const availableSlugs = new Set(availableTags.map((tag) => tag.slug));
    const tagCounts = new Map<string, TagWithCount>();

    for (const tag of selectedGames.flatMap((game) => game.tags)) {
      if (availableSlugs.has(tag.slug)) continue;

      const existingTag = tagCounts.get(tag.slug);

      if (existingTag) {
        existingTag.count += 1;
      } else {
        tagCounts.set(tag.slug, { ...tag, count: 1 });
      }
    }

    const sortedTags = Array.from(tagCounts.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });

    const topTags = sortedTags.slice(0, 4);
    const remainingTags = sortedTags.slice(4);
    const randomIndex = Math.floor(randomSeed * remainingTags.length);
    const randomTag = remainingTags[randomIndex];

    return randomTag ? [...topTags, randomTag] : topTags;
  }, [availableTags, randomSeed, selectedGames]);

  return (
    <div>
      <div
        className="max-w-4xl mx-auto mt-12 animate-fade-in-up pb-20"
        style={{ animationDelay: "120ms" }}
      >
        <GameSearch selected={selected} onAdd={addGame} onRemove={removeGame} />
      </div>

      <section className="container pb-12">
        <div className="max-w-4xl mx-auto">
          <TagSelector
            tags={availableTags}
            active={activeTags}
            suggested={suggestedTags}
            onToggle={toggleTag}
          />
        </div>
      </section>
    </div>
  );
}
