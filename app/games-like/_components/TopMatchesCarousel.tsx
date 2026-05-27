"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { GameCard } from "@/app/components/GameCard";
import { GameDetailsModal } from "@/app/components/GameDetailsModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import type { GameMatchWithReasons } from "../_types";

type Props = {
  baseGameName: string;
  games: GameMatchWithReasons[];
};

export function TopMatchesCarousel({ baseGameName, games }: Props) {
  const [selectedGame, setSelectedGame] = useState<GameMatchWithReasons | null>(
    null,
  );

  return (
    <>
      <section className="relative z-10 -mt-14 mx-auto max-w-7xl px-4 sm:px-6 md:-mt-40 xl:px-0">
        <div className="-mx-4 rounded-none border-y border-border/40 bg-gradient-to-b from-card/60 to-card/10 px-4 py-5 backdrop-blur-sm sm:mx-0 sm:rounded-2xl sm:border md:p-8">
          <div className="mb-4 flex items-center justify-between md:mb-6">
            <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary/15 md:h-9 md:w-9">
                <Sparkles className="h-4 w-4 text-secondary" />
              </div>
              <h2 className="min-w-0 text-xl font-bold leading-tight md:text-3xl">
                Top matches for{" "}
                <span className="gradient-text">{baseGameName}</span>
              </h2>
            </div>
          </div>

          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="relative"
          >
            <CarouselContent className="-ml-4 md:-ml-5">
              {games.map((game, index) => (
                <CarouselItem
                  key={game.id}
                  className="basis-1/2 pl-4 sm:basis-65 md:pl-5"
                >
                  <GameCard
                    game={game}
                    index={index}
                    onClick={() => setSelectedGame(game)}
                    carouselMode
                    showTags={false}
                    reasons={game.reasons}
                    showBar={false}
                    topMatches
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 h-10 w-10 border-border/60 bg-background/80 backdrop-blur-md hover:bg-background md:inline-flex" />
            <CarouselNext className="right-2 h-10 w-10 border-border/60 bg-background/80 backdrop-blur-md hover:bg-background md:inline-flex" />
          </Carousel>
        </div>
      </section>

      <GameDetailsModal
        open={selectedGame !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedGame(null);
          }
        }}
        game={selectedGame}
        showWhyMatch={false}
      />
    </>
  );
}
