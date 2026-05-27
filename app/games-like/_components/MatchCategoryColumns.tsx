"use client";

import { useState } from "react";

import { GameCard } from "@/app/components/GameCard";
import { GameDetailsModal } from "@/app/components/GameDetailsModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import type { GameMatchDto } from "@/lib/dto/game-match.dto";
import type { GameMatchColumn } from "../_types";
type Props = {
  columns: GameMatchColumn[];
};

export function MatchCategoryColumns({ columns }: Props) {
  const [selectedGame, setSelectedGame] = useState<GameMatchDto | null>(null);

  return (
    <>
      <section className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {columns.map((col) => (
          <div
            key={col.title}
            className="min-w-0 md:mx-0 rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold leading-tight md:text-base">
                {col.title}
              </h3>
            </div>
            <Carousel
              opts={{ align: "start", dragFree: true }}
              className="relative overflow-hidden"
            >
              <CarouselContent>
                {col.games.map((game, index) => (
                  <CarouselItem
                    key={game.id}
                    className="basis-1/2 pl-4 sm:basis-1/3 lg:basis-1/2 xl:basis-1/3"
                  >
                    <GameCard
                      game={game}
                      index={index}
                      onClick={() => setSelectedGame(game)}
                      carouselMode
                      showTags={false}
                      showPlatforms={false}
                      showBar={false}
                      showSimilarity={false}
                      showVisibleDescription={false}
                      gameNameSize="xs"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="right-0 h-8 w-8 border-border/60 bg-background/80 backdrop-blur-md" />
              <CarouselPrevious className="left-0 h-8 w-8 border-border/60 bg-background/80 backdrop-blur-md" />
            </Carousel>
          </div>
        ))}
      </section>

      <GameDetailsModal
        open={selectedGame !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedGame(null);
          }
        }}
        game={selectedGame}
        showSimilarity={false}
        showWhyMatch={false}
      />
    </>
  );
}
