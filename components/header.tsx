"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { GitHubMark, NpmMark } from "@/components/brand-icons";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/guides", label: "Guides" },
  { href: "/api", label: "API" },
  { href: "/examples", label: "Examples" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-baseline gap-1.5 rounded-lg group"
        >
          <span className="text-body font-semibold tracking-tight text-foreground group-hover:opacity-80 transition-opacity">
            Stabilize
          </span>
          <span className="text-body font-normal tracking-tight text-muted-foreground group-hover:opacity-80 transition-opacity">
            ORM
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-small font-medium text-muted-foreground hover:text-accent-subtle-foreground hover:bg-accent-subtle rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-accent-subtle hover:text-accent-subtle-foreground"
            title="stabilize-orm on npm"
          >
            <a
              href="https://www.npmjs.com/package/stabilize-orm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <NpmMark className="h-[18px] w-[18px]" />
              <span className="sr-only">npm package</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-accent-subtle hover:text-accent-subtle-foreground"
          >
            <a
              href="https://github.com/ElectronSz/stabilize-orm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubMark className="h-[18px] w-[18px]" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/docs/quick-start">Get Started</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-accent-subtle"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-small font-medium text-muted-foreground hover:text-accent-subtle-foreground hover:bg-accent-subtle rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-3 mt-2 border-t border-border/60">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-accent-subtle hover:text-accent-subtle-foreground"
                title="stabilize-orm on npm"
              >
                <a
                  href="https://www.npmjs.com/package/stabilize-orm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <NpmMark className="h-5 w-5" />
                  <span className="sr-only">npm package</span>
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-accent-subtle hover:text-accent-subtle-foreground"
              >
                <a
                  href="https://github.com/ElectronSz/stabilize-orm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubMark className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button
                asChild
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link
                  href="/docs/quick-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
