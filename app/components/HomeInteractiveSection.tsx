"use client";

import { useState } from "react";
import { GameSearch } from "./GameSearch";
import { TagSelector } from "./TagSelector";
import { type ShortTag } from "@/lib/dto/tag.dto";
import { GameMatchDto } from "@/lib/dto/game-match.dto";
import { GameDetailsModal } from "./GameDetailsModal";
import useGameSelection from "../hooks/useGameSelection";
import { useGameMatching } from "../hooks/useGameMatching";
import { FindGamesButton } from "./FindGamesButton";
import { GameMatchResults } from "./GameMatchResults";

type Props = {
  availableTags: ShortTag[];
};

export function HomeInteractiveSection({ availableTags }: Props) {
  const {
    selectedSearchResults,
    selectedGames,
    activeTags,
    suggestedTags,
    canSearch,
    addGame,
    removeGame,
    toggleTag,
  } = useGameSelection(availableTags);

  const { matchedGames, isMatchingPending, resultsRef, findMatches } =
    useGameMatching(selectedGames, activeTags);

  const [modal, setModal] = useState<{
    open: boolean;
    game: GameMatchDto | null;
  }>({
    open: false,
    game: null,
  });

  return (
    <div>
      <div
        className="max-w-4xl mx-auto mt-12 animate-fade-in-up pb-20"
        style={{ animationDelay: "120ms" }}
      >
        <GameSearch
          selected={selectedSearchResults}
          onAdd={addGame}
          onRemove={removeGame}
        />
      </div>

      <section className="pb-12">
        <div className="max-w-4xl mx-auto">
          <TagSelector
            tags={availableTags}
            active={activeTags}
            suggested={suggestedTags}
            onToggle={toggleTag}
          />
        </div>
      </section>
      <section className="pb-24">
        <FindGamesButton
          canSearch={canSearch}
          isMatchingPending={isMatchingPending}
          onFind={findMatches}
        />
      </section>
      <GameMatchResults
        matchedGames={matchedGames}
        isMatchingPending={isMatchingPending}
        resultsRef={resultsRef}
        onGameClick={(game) => setModal({ open: true, game })}
      />

      <GameDetailsModal
        open={modal.open}
        onOpenChange={(v) => setModal((m) => ({ ...m, open: v }))}
        game={modal.game}
      />
    </div>
  );
}
