import { GameDto } from "@/lib/dto/game.dto";
import { SearchGameResult } from "@/lib/dto/search-game.dto";
import { selectGame } from "../actions/selectGame";
import { useMemo, useState, useTransition } from "react";
import { ShortTag } from "@/lib/dto/tag.dto";
import {
  DEFAULT_BASE_TAG_SECTION,
  type BaseTagSection,
} from "@/consts/base-tags";

type TagWithCount = ShortTag & {
  count: number;
};

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
  selectedSearchResults: SearchGameResult[];
  selectedGames: GameDto[];
  activeTagSection: BaseTagSection;
  activeTags: ShortTag[];
  suggestedTags: ShortTag[];
  canSearch: boolean;
  selectTagSection: (section: BaseTagSection) => void;
  addGame: (game: SearchGameResult) => void;
  removeGame: (id: number) => void;
  toggleTag: (tag: ShortTag) => void;
}

function useGameSelection(availableTags: ShortTag[]): GameSelectionState {
  const [selectedSearchResults, setSelectedSearchResults] = useState<
    SearchGameResult[]
  >([]);
  const [selectedGames, setSelectedGames] = useState<GameDto[]>([]);
  const [activeTagSection, setActiveTagSection] = useState<BaseTagSection>(
    DEFAULT_BASE_TAG_SECTION,
  );
  const [selectedTags, setSelectedTags] = useState<ShortTag[]>([]);
  const [randomSeed] = useState(Math.random);
  const [, startSelectTransition] = useTransition();

  const suggestedTags = useMemo(
    () => getSuggestedTags(selectedGames, availableTags, randomSeed),
    [selectedGames, availableTags, randomSeed],
  );
  const visibleTagSlugs = useMemo(
    () =>
      new Set([
        ...availableTags.map((tag) => tag.slug),
        ...suggestedTags.map((tag) => tag.slug),
      ]),
    [availableTags, suggestedTags],
  );
  const activeTags = useMemo(
    () => selectedTags.filter((tag) => visibleTagSlugs.has(tag.slug)),
    [selectedTags, visibleTagSlugs],
  );
  const canSearch = selectedGames.length > 0 || activeTags.length > 0;

  const selectTagSection = (section: BaseTagSection) => {
    setActiveTagSection(section);
  };

  const addGame = (game: SearchGameResult) => {
    const alreadySelected = selectedSearchResults.some(
      (g) => g.rawgId === game.rawgId,
    );
    if (selectedSearchResults.length >= 5 || alreadySelected) return;

    setSelectedSearchResults((prev) => [...prev, game]);

    startSelectTransition(async () => {
      try {
        const fullGame = await selectGame(game.rawgId);
        setSelectedGames((prev) => [...prev, fullGame]);
      } catch (error) {
        console.error("Error selecting game:", error);
        setSelectedSearchResults((prev) =>
          prev.filter((g) => g.rawgId !== game.rawgId),
        );
      }
    });
  };

  const removeGame = (id: number) => {
    setSelectedSearchResults((prev) =>
      prev.filter((game) => game.rawgId !== id),
    );
    setSelectedGames((prev) => {
      const nextSelectedGames = prev.filter((game) => game.rawgId !== id);
      const nextSuggestedTags = getSuggestedTags(
        nextSelectedGames,
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

      return nextSelectedGames;
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
    selectedSearchResults,
    selectedGames,
    activeTagSection,
    activeTags,
    suggestedTags,
    canSearch,
    selectTagSection,
    addGame,
    removeGame,
    toggleTag,
  };
}

export default useGameSelection;
