import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Nav/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>

      <div className="flex flex-col min-h-screen">
        <header className="top-0 z-40 w-full py-6 backdrop-blur-xl transition-colors absolute inset-x-0 border-b border-border/20 bg-background/20 supports-[backdrop-filter]:bg-background/10">
          <div className="max-w-7xl px-6 xl:px-0 mx-auto flex items-center justify-between">
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
            <Navbar />
          </div>
        </header>
        <main className="grow">
          <section className="h-full w-full ">{children}</section>
        </main>
        <footer className="border-t border-border/50 mt-4 md:mt-8 px-6 ">
          <div className="container max-w-7xl mx-auto py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-muted-foreground">
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
