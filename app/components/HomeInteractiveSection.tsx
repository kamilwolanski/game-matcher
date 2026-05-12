"use client";

import { useState } from "react";
import { GameSearch } from "./GameSearch";
import { type ShortTag } from "@/lib/dto/tag.dto";
import { GameMatchDto } from "@/lib/dto/game-match.dto";
import { GameDetailsModal } from "./GameDetailsModal";
import useGameSelection from "../hooks/useGameSelection/useGameSelection";
import { useGameMatching } from "../hooks/useGameMatching";
import { FindGamesButton } from "./FindGamesButton";
import { GameMatchResults } from "./GameMatchResults";
import { TagSelector } from "./TagSelector";

type Props = {
  availableTags: ShortTag[];
};

export function HomeInteractiveSection({ availableTags }: Props) {
  const {
    activeTagSection,
    activeTags,
    suggestedTags,
    canSearch,
    isAnalyzing,
    pickedGames,
    atLimit,
    selectTagSection,
    addGame,
    removeGame,
    toggleTag,
    clearAllTags,
    retry,
  } = useGameSelection(availableTags);

  const pickedReadyGames = pickedGames
    .filter((pg) => pg.status === "ready")
    .map((g) => g.data);
  const { matchedGames, isMatchingPending, resultsRef, findMatches } =
    useGameMatching(pickedReadyGames, activeTags);

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
        className="max-w-4xl mx-auto mt-12 animate-fade-in-up pb-12"
        style={{ animationDelay: "120ms" }}
      >
        <GameSearch
          pickedGames={pickedGames}
          atLimit={atLimit}
          onAdd={addGame}
          onRemove={removeGame}
          onRetry={retry}
        />
      </div>

      <section className="pb-12">
        <div className="max-w-4xl mx-auto">
          <TagSelector
            tags={availableTags}
            activeSection={activeTagSection}
            activeTags={activeTags}
            suggestedTags={suggestedTags}
            onSectionChange={selectTagSection}
            onToggle={toggleTag}
            clearAllTags={clearAllTags}
          />
        </div>
      </section>
      <section className="pb-24">
        <FindGamesButton
          canSearch={canSearch}
          isAnalyzing={isAnalyzing}
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
