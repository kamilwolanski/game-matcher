import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gamematcher.app"),

  title: "Game Matcher — Find Similar Games Based on Your Taste",

  description:
    "Discover games similar to your favorites using AI-powered semantic matching, gameplay traits, genres, and player taste profiles.",

  openGraph: {
    title: "Game Matcher — Find Similar Games Based on Your Taste",
    description:
      "Find games you'll love using AI-powered semantic game matching and gameplay trait analysis.",
    url: "https://gamematcher.app",
    siteName: "Game Matcher",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Game Matcher",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Game Matcher — Find Similar Games Based on Your Taste",
    description:
      "Discover games similar to your favorites using AI-powered semantic matching and gameplay traits.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  appleWebApp: {
    title: "Game Matcher",
    capable: true,
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full">
        <div aria-hidden className="app-background pointer-events-none fixed inset-0 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 xl:px-0">
          {children}
        </div>
      </body>
    </html>
  );
}
