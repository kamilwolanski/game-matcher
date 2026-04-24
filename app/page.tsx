"use client";

import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { type SearchGameResult } from "./api/search/route";
import { GameSearch } from "./components/GameSearch";

export default function Home() {
  const [selected, setSelected] = useState<SearchGameResult[]>([]);

  const addGame = (g: SearchGameResult) => {
    if (selected.length >= 5) return;
    setSelected((prev) => [...prev, g]);
  };

  const removeGame = (id: number) => {
    setSelected((prev) => prev.filter((g) => g.rawgId !== id));
  };

  return (
    <main className="relative min-h-screen mx-auto">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
      >
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-float" />
        <div
          className="absolute top-1/3 -right-32 h-112 w-md rounded-full bg-secondary/20 blur-[140px] animate-float"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/logo-transparent.png"
              alt="Game Matcher"
              width={1027}
              height={281}
              className="w-44 h-auto"
              quality={100}
              priority
            />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground glass px-3 py-1.5 rounded-full">
          <Sparkles className="h-3.5 w-3.5 text-secondary" />
          AI-powered recommendations
        </div>
      </header>

      <section className="container pt-8 md:pt-16 pb-20">
        <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
            Discover your next obsession
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
            Find games you&apos;ll{" "}
            <span className="gradient-text bg-size-[200%_auto] animate-gradient-shift">
              actually love
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us what you&apos;ve enjoyed and what you&apos;re in the mood
            for. We match you with games based on shared DNA - not generic
            charts.
          </p>
        </div>

        {/* Search */}
        <div
          className="max-w-3xl mx-auto mt-12 animate-fade-in-up"
          style={{ animationDelay: "120ms" }}
        >
          <GameSearch
            selected={selected}
            onAdd={addGame}
            onRemove={removeGame}
          />
        </div>
      </section>
    </main>
  );
}
