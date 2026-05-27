import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Compass,
  Flame,
  GitFork,
  Globe,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { MatchCategoryColumns } from "../_components/MatchCategoryColumns";
import { TopMatchesCarousel } from "../_components/TopMatchesCarousel";
import gothicHero from "./assets/gothic_hero.jpg";
import g1 from "./assets/g1.jpg";
import { getGothicGamesLikeData, gothicPageData } from "./data";

export const dynamic = "force-static";
export const revalidate = false;

const DNA_ICONS: Record<string, typeof Globe> = {
  globe: Globe,
  split: GitFork,
  bars: BarChart3,
  flame: Flame,
};

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games Like Gothic – Best RPGs Similar to Gothic",
  description:
    "Discover the best games like Gothic, including Risen, ELEX, Skyrim, and Kingdom Come: Deliverance. Explore immersive RPGs with factions, dangerous exploration, and meaningful progression.",
  alternates: {
    canonical: "/games-like/gothic",
  },

  openGraph: {
    title: "Games Like Gothic – Best RPGs Similar to Gothic",
    description:
      "Find immersive RPGs similar to Gothic with factions, exploration, and meaningful progression.",
    url: "https://gamematcher.app/games-like/gothic",
  },

  twitter: {
    title: "Games Like Gothic – Best Similar RPGs",
    description: "Discover immersive RPGs similar to Gothic.",
  },
};

export default async function LikeGothic() {
  const pageData = await getGothicGamesLikeData();

  if (!pageData) {
    return <div>Game not found</div>;
  }

  return (
    <div className="overflow-hidden">
      <div className="relative h-[560px] w-full px-4 pt-24 sm:px-6 md:h-[980px] md:px-6 md:pt-0 xl:px-0">
        <div className="absolute inset-0 mx-auto h-full w-full max-w-[120rem]">
          <Image
            src={gothicHero}
            alt={gothicPageData.heroAlt}
            fill
            className="absolute inset-0 h-full w-full object-cover object-[62%_top] sm:object-[58%_top] md:object-contain md:object-[right_top]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/45 via-45% to-background/15 md:bg-gradient-to-r md:from-background md:via-background/95 md:via-20% md:to-transparent md:to-35%" />
          <div className="absolute inset-0 hidden bg-gradient-to-l from-background via-background/95 via-10% to-transparent to-25% md:block" />
          <div className="absolute hidden md:block inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background via-background/90 to-transparent md:h-84" />
        </div>

        <div className="container relative mx-auto flex h-full max-w-7xl items-start md:items-center">
          <div className="mb-20 max-w-xl space-y-4 py-6 sm:mb-24 md:mb-40 md:space-y-6 md:py-10">
            <h1 className="text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl md:text-7xl">
              {gothicPageData.heroTitlePrefix}
              <br />
              <span className="gradient-text">
                {gothicPageData.baseGameName}
              </span>
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-foreground/85 sm:text-base md:max-w-xl md:text-lg">
              {gothicPageData.heroDescription}
            </p>
            <div className="flex max-w-[18rem] flex-wrap gap-2 pt-1 sm:max-w-sm md:max-w-none md:gap-2.5 md:pt-2">
              {gothicPageData.pills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-primary/50 bg-primary/20 px-3 py-1.5 text-xs font-medium text-foreground shadow-[0_4px_16px_-8px_hsl(var(--primary)/0.6)] backdrop-blur-md md:px-4 md:py-2 md:text-sm"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TopMatchesCarousel
        baseGameName={gothicPageData.baseGameName}
        games={pageData.topMatches}
      />
      <div className="px-6 xl:px-0 max-w-7xl mx-auto">
        <section className="mt-6 ">
          <div className="grid gap-4 md:grid-cols-[1fr_340px]">
            <div className="relative min-h-[250px]  overflow-hidden md:border-y border-border/50 rounded-2xl border md:min-h-[340px]">
              <div className="absolute inset-0 hidden md:block">
                <Image
                  src={g1}
                  alt="Gothic world"
                  fill
                  loading="lazy"
                  className="object-cover object-[58%_center] sm:object-center"
                />
                <div className="absolute inset-0 bg-black/35 sm:bg-black/25" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/85 to-transparent" />
                <div className="absolute inset-y-0 left-0 hidden w-[65%] bg-gradient-to-r from-[#050816] via-[#050816]/90 to-transparent sm:block" />
              </div>

              <div className="relative flex h-full max-w-xl flex-col p-5 sm:p-6 md:p-8">
                <h2 className="text-2xl font-bold leading-tight md:text-3xl">
                  Why{" "}
                  <span className="gradient-text">
                    {gothicPageData.baseGameName}
                  </span>{" "}
                  still stands out
                </h2>

                <div className="mt-5 max-w-lg space-y-4 text-sm leading-7 text-muted-foreground">
                  <p>
                    Even decades after release, Gothic remains unique thanks to
                    its immersive world design. NPCs follow daily routines,
                    factions feel believable, and exploration is driven by
                    curiosity instead of map markers and handholding systems.
                  </p>

                  <p>
                    What truly defines Gothic is its progression. You begin as a
                    powerless outsider and slowly earn your place in a harsh,
                    dangerous world where every victory, weapon, and skill
                    upgrade feels meaningful.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm sm:mx-0 md:p-6">
              <div className="relative md:hidden inset-0 h-62">
                <Image
                  src={g1}
                  alt="Gothic world"
                  fill
                  loading="lazy"
                  className="object-cover object-[58%_center] sm:object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/45 to-transparent" />{" "}
              </div>
              <div className="p-5 md:p-0">
                <h3 className="mb-5 text-xl font-bold">Gothic&apos;s DNA</h3>

                <div className="space-y-5 grid grid-cols-2 gap-4 md:block">
                  {gothicPageData.dna.map((item) => {
                    const Icon = DNA_ICONS[item.icon];

                    return (
                      <div key={item.title} className="flex gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>

                        <div>
                          <h4 className="text-sm font-bold">{item.title}</h4>

                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <MatchCategoryColumns columns={pageData.columns} />

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr]">
          <div className="rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm sm:mx-0 sm:p-6 md:p-7">
            <h2 className="mb-5 text-lg font-bold md:text-xl">
              Frequently asked questions
            </h2>
            <Accordion
              type="single"
              collapsible
              className="grid gap-2.5 sm:grid-cols-2"
            >
              {gothicPageData.faqItems.map((item, index) => (
                <AccordionItem
                  key={item.q}
                  value={`faq-${index}`}
                  className="rounded-lg border border-border/60 bg-surface/40 px-3 transition-colors duration-200 data-[state=open]:border-primary/30 data-[state=open]:bg-surface/70 sm:px-4"
                >
                  <AccordionTrigger className="gap-3 py-3 text-left text-xs font-medium leading-snug text-foreground/90 hover:no-underline md:text-sm">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 text-xs leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="z-10 mt-6 sm:px-6 md:mt-8 xl:px-0">
          <div className="flex flex-col gap-4 rounded-2xl border border-secondary/40 bg-gradient-to-r from-secondary/15 via-primary/10 to-transparent p-5 md:flex-row md:items-center md:gap-5 md:px-8 md:py-7">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary/20 md:h-12 md:w-12">
              <Compass className="h-5 w-5 text-secondary md:h-6 md:w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold md:text-xl">
                Find games that match your taste
              </h3>
              <p className="text-sm text-muted-foreground">
                Pick games and tags you like to discover similar RPGs and hidden
                gems.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.6)] transition-bounce gradient-primary hover:scale-[1.02] sm:w-auto md:px-5"
            >
              Build your own taste <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
