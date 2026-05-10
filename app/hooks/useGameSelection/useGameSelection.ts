import { GameDto } from "@/lib/dto/game.dto";
import { SearchGameResult } from "@/lib/dto/search-game.dto";
import { getOrCreateGame } from "../../actions/getOrCreateGame";
import { useMemo, useState, useTransition } from "react";
import { ShortTag } from "@/lib/dto/tag.dto";
import {
  DEFAULT_BASE_TAG_SECTION,
  type BaseTagSection,
} from "@/consts/base-tags";
import { GameState, TagWithCount } from "./useGameSelection.types";

function getSuggestedTags(
  selectedGames: GameDto[],
  availableTags: ShortTag[],
  randomSeed: number,
) {
  const tagCounts = new Map<string, TagWithCount>();

  for (const tag of selectedGames.flatMap((game) => game.tags)) {
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
}

export interface GameSelectionState {
  pickedGames: GameState[];
  activeTagSection: BaseTagSection;
  activeTags: ShortTag[];
  suggestedTags: ShortTag[];
  canSearch: boolean;
  isAnalyzing: boolean;
  atLimit: boolean;
  selectTagSection: (section: BaseTagSection) => void;
  addGame: (game: SearchGameResult) => void;
  removeGame: (id: number) => void;
  toggleTag: (tag: ShortTag) => void;
  retry: (game: SearchGameResult) => void;
}

export const MAX_GAMES = 5;

function useGameSelection(availableTags: ShortTag[]): GameSelectionState {
  const [pickedGames, setPickedGames] = useState<GameState[]>([]);
  const [activeTagSection, setActiveTagSection] = useState<BaseTagSection>(
    DEFAULT_BASE_TAG_SECTION,
  );
  const [selectedTags, setSelectedTags] = useState<ShortTag[]>([]);
  const [randomSeed] = useState(Math.random);
  const [, startSelectTransition] = useTransition();

  const readyGames = useMemo(() => {
    return pickedGames.filter((pg) => pg.status === "ready").map((g) => g.data);
  }, [pickedGames]);

  const suggestedTags = useMemo(
    () => getSuggestedTags(readyGames, availableTags, randomSeed),
    [readyGames, availableTags, randomSeed],
  );
  const visibleTagSlugs = useMemo(
    () =>
      new Set([
        ...availableTags.map((tag) => tag.slug),
        ...suggestedTags.map((tag) => tag.slug),
      ]),
    [availableTags, suggestedTags],
  );
  const suggestedTagSlugsKey = suggestedTags.map((t) => t.slug).join(",");

  const stableSuggestedTags = useMemo(
    () => suggestedTags,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [suggestedTagSlugsKey],
  );
  const activeTags = useMemo(
    () => selectedTags.filter((tag) => visibleTagSlugs.has(tag.slug)),
    [selectedTags, visibleTagSlugs],
  );

  const canSearch =
    (pickedGames.length > 0 &&
      pickedGames.every((pc) => pc.status !== "analyzing")) ||
    (activeTags.length > 0 &&
      pickedGames.every((pc) => pc.status !== "analyzing"));

  const isAnalyzing = pickedGames.some((pg) => pg.status === "analyzing");

  const selectTagSection = (section: BaseTagSection) => {
    setActiveTagSection(section);
  };

  const atLimit = pickedGames.length >= MAX_GAMES;

  const addGame = (game: SearchGameResult) => {
    const alreadySelected = pickedGames.some((g) => g.rawgId === game.rawgId);
    if (atLimit || alreadySelected) return;
    setPickedGames((prev) => [
      ...prev,
      { rawgId: game.rawgId, status: "analyzing", data: game },
    ]);

    selectGame(game);
  };

  const retry = (game: SearchGameResult) => {
    setPickedGames((prev) => {
      const filtered = prev.filter((g) => g.rawgId !== game.rawgId);
      const newState: GameState[] = [
        ...filtered,
        { rawgId: game.rawgId, status: "analyzing", data: game },
      ];

      return newState;
    });

    selectGame(game);
  };

  const selectGame = (game: SearchGameResult) => {
    startSelectTransition(async () => {
      try {
        const fullGame = await getOrCreateGame(game.rawgId);

        if (!fullGame) {
          throw new Error("Failed to load game");
        }
        setPickedGames((prev) => {
          const filtered = prev.filter((g) => g.rawgId !== fullGame.rawgId);
          const newState: GameState[] = [
            ...filtered,
            { rawgId: fullGame.rawgId, status: "ready", data: fullGame },
          ];
          return newState;
        });
      } catch (error) {
        console.error("Error selecting game:", error);
        setPickedGames((prev) => {
          const filtered = prev.filter((g) => g.rawgId !== game.rawgId);
          const newState: GameState[] = [
            ...filtered,
            {
              rawgId: game.rawgId,
              status: "failed",
              data: game,
            },
          ];

          return newState;
        });
      }
    });
  };

  const removeGame = (id: number) => {
    setPickedGames((prev) => {
      const nextPickedGames = prev.filter((g) => g.rawgId !== id);
      const nextReadyGames = nextPickedGames
        .filter((g) => g.status === "ready")
        .map((x) => x.data);
      const nextSuggestedTags = getSuggestedTags(
        nextReadyGames,
        availableTags,
        randomSeed,
      );

      const nextVisibleTagSlugs = new Set([
        ...availableTags.map((tag) => tag.slug),
        ...nextSuggestedTags.map((tag) => tag.slug),
      ]);

      setSelectedTags((prevTags) =>
        prevTags.filter((tag) => nextVisibleTagSlugs.has(tag.slug)),
      );

      return nextPickedGames;
    });
  };

  const toggleTag = (tag: ShortTag) => {
    setSelectedTags((prev) => {
      const isActive = prev.some((activeTag) => activeTag.slug === tag.slug);

      return isActive
        ? prev.filter((activeTag) => activeTag.slug !== tag.slug)
        : [...prev, tag];
    });
  };

  return {
    activeTagSection,
    activeTags,
    suggestedTags: stableSuggestedTags,
    canSearch,
    isAnalyzing,
    pickedGames,
    atLimit,
    selectTagSection,
    addGame,
    removeGame,
    toggleTag,
    retry,
  };
}

export default useGameSelection;
