import { Orbit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HomeInteractiveSection } from "./components/HomeInteractiveSection";
import { getBaseTags } from "@/lib/services/game.service";
import { userAgent } from "next/server";
import { headers } from "next/headers";

export default async function Home() {
  const ua = userAgent({ headers: await headers() });
  const isMobile = ua.device.type === "mobile";
  const baseTags = await getBaseTags();

  return (
    <main className="relative min-h-screen mx-auto flex flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
      >
        <div className="absolute -top-40 -left-32 hidden h-96 w-96 rounded-full bg-primary/20 blur-[120px] md:block md:animate-float" />
        <div
          className="absolute top-1/3 -right-32 hidden h-112 w-md rounded-full bg-secondary/20 blur-[140px] md:block md:animate-float"
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
              className="w-36 md:w-44 h-auto"
              priority
            />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground glass px-3 py-1.5 rounded-full">
          <Orbit className="h-3.5 w-3.5 text-secondary" />
          Semantic game matching
        </div>
      </header>

      <section className="grow pt-4 md:pt-16 pb-16 md:pb-20">
        <div className="max-w-3xl mx-auto text-center space-y-3 md:space-y-6 animate-fade-in-up">
          <h1 className="text-[2.6rem] md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
            Find games you&apos;ll{" "}
            <span className="gradient-text bg-size-[200%_auto] animate-gradient-shift">
              love
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover games that share the same vibe and gameplay traits.
          </p>
        </div>

        <HomeInteractiveSection availableTags={baseTags} isMobile={isMobile} />
      </section>

      <footer className="border-t border-border/50 mt-4 md:mt-8">
        <div className="container py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-muted-foreground">
          <div className="space-y-0.5">
            <div className="font-semibold text-foreground/90 tracking-tight">
              GameMatcher
            </div>
            <p>Semantic game discovery platform</p>
          </div>
          <div className="flex flex-col md:items-end gap-1">
            <p>
              Game data &amp; images provided by{" "}
              <a
                href="https://rawg.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary transition-smooth underline-offset-4 hover:underline"
              >
                RAWG
              </a>
            </p>
            <a
              href="mailto:hello@gamematcher.gg"
              className="hover:text-primary transition-smooth"
            >
              hello@gamematcher.app
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
