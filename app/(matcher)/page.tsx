import { getBaseTags } from "@/lib/services/game.service";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import { HomeInteractiveSection } from "../components/HomeInteractiveSection";

export default async function Home() {
  const ua = userAgent({ headers: await headers() });
  const isMobile = ua.device.type === "mobile";
  const baseTags = await getBaseTags();

  return (
    <>
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
    </>
  );
}
