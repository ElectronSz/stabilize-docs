"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent text-accent-foreground font-bold text-sm group-hover:scale-105 transition-transform">
            <Zap className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg tracking-tight">Stabilize</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/docs", label: "Docs" },
            { href: "/guides", label: "Guides" },
            { href: "/api", label: "API" },
            { href: "/examples", label: "Examples" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
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
            className="hover:bg-accent/10"
          >
            <a
              href="https://github.com/ElectronSz/stabilize-orm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-[18px] w-[18px]" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
          >
            <Link href="/docs/quick-start">Get Started</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
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
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <nav className="container flex flex-col gap-1 py-4">
            {[
              { href: "/docs", label: "Docs" },
              { href: "/guides", label: "Guides" },
              { href: "/api", label: "API" },
              { href: "/examples", label: "Examples" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-3 mt-2 border-t border-border/50">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-accent/10"
              >
                <a
                  href="https://github.com/ElectronSz/stabilize-orm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
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
