import Link from "next/link";
import Image from "next/image";
import { Orbit } from "lucide-react";
// import Navbar from "../components/Nav/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div
        aria-hidden
        className="app-background pointer-events-none fixed inset-0 z-0"
      />
      <div className="relative z-10 max-w-7xl px-6 xl:px-0 min-h-screen mx-auto flex flex-col">
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

          {/* <Navbar /> */}

          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground glass px-3 py-1.5 rounded-full">
            <Orbit className="h-3.5 w-3.5 text-secondary" />
            Semantic game matching
          </div>
        </header>
        <main className="grow">{children}</main>
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
                href="mailto:hello@gamematcher.app"
                className="hover:text-primary transition-smooth"
              >
                hello@gamematcher.app
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
