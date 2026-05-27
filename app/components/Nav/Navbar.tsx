"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import NavLink from "./NavLink";

const links = [
  { href: "/", label: "Discover", exact: true },
  { href: "/games-like/gothic", label: "Games Like" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <nav className="hidden items-center gap-10 text-sm md:flex">
        {links.map((link) => (
          <NavLink key={link.href} href={link.href} exact={link.exact}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/45 text-foreground shadow-[0_8px_24px_-16px_hsl(var(--primary)/0.7)] backdrop-blur-md transition-smooth hover:bg-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 md:hidden"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div
        id="mobile-navigation"
        className={cn(
          "absolute right-0 top-12 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border/70 bg-popover/95 p-2 shadow-[0_24px_60px_-24px_hsl(222_47%_2%/0.9)] backdrop-blur-xl transition-smooth md:hidden",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-smooth",
                  active
                    ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {link.label}
                {active && (
                  <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_12px_hsl(var(--secondary)/0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
