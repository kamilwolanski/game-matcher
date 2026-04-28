"use client";

import { useState, useTransition } from "react";
import { type SearchGameResult } from "../api/search/route";
import { GameSearch } from "./GameSearch";
// import { TagSelector } from "./TagSelector";
// import { findGames } from "../actions/findGames";
import { Sparkles } from "lucide-react";
import { selectGame } from "../actions/selectGame";
import { Tag } from "../generated/prisma/client";
import { TagSelector } from "./TagSelector";
import { ShortTag } from "@/lib/getRandomTags";

type Props = {
  availableTags: ShortTag[]; // przychodzi z serwera (page.tsx)
};

export function HomeInteractiveSection({ availableTags }: Props) {
  const [selected, setSelected] = useState<SearchGameResult[]>([]);
  const [activeTags, setActiveTags] = useState<ShortTag[]>([]);
  const [results, setResults] = useState(null);
  const [pending, startTransition] = useTransition();

  const addGame = (g: SearchGameResult) => {
    if (selected.length >= 5) return;
    setSelected((prev) => [...prev, g]);
    startTransition(async () => {
      try {
        await selectGame(g.rawgId);
      } catch (error) {
        console.error("Error selecting game:", error);
      }
    });
  };

  const removeGame = (id: number) => {
    setSelected((prev) => prev.filter((g) => g.rawgId !== id));
  };

  const toggleTag = (tag: ShortTag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  //   const handleFindGames = () => {
  //     startTransition(async () => {
  //       const data = await findGames({
  //         gameIds: selected.map((g) => g.rawgId),
  //         tags: activeTags,
  //       });
  //       setResults(data);
  //     });
  //   };

  const canSearch = selected.length > 0;

  console.log('activeTags', activeTags);

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
            // suggested={[]} // tu możesz derivować z selected
            onToggle={toggleTag}
          />
        </div>
      </section>

      {/* {canSearch && (
        <div className="flex justify-center animate-fade-in-up">
          <button
            onClick={handleFindGames}
            disabled={pending}
            className="gradient-primary px-8 py-3 rounded-full font-semibold text-primary-foreground shadow-lg disabled:opacity-60 transition-smooth"
          >
            {pending ? "Finding..." : "Find Games"}
          </button>
        </div>
      )} */}

      {/* {results && <ResultsSection results={results} />} */}
    </div>
  );
}
