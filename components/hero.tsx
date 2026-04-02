"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 pointer-events-none" />
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-30" />

      <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-28 md:pt-40 md:pb-36">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-8 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-sm font-medium text-accent">v2.1.0</span>
            <span className="text-muted-foreground/60">|</span>
            <span className="text-sm text-muted-foreground">
              Backup, restore & API generation
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up leading-[1.1]">
            Build faster with{" "}
            <span className="gradient-text">Stabilize ORM</span>
          </h1>

          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 animate-slide-up leading-relaxed"
            style={{ animationDelay: "0.1s" }}
          >
            A modern, type-safe ORM for Bun with a unified API for PostgreSQL,
            MySQL, and SQLite. Define models, run migrations, and query data
            with a clean, fluent interface.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl shadow-accent/25 text-base px-8 h-12 rounded-xl"
            >
              <Link href="/docs/quick-start">
                <Zap className="mr-2 h-4 w-4" />
                Get Started
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border hover:bg-accent/5 text-base px-8 h-12 rounded-xl"
            >
              <Link href="/examples">
                View Examples
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div
            className="mt-12 flex items-center gap-6 text-sm text-muted-foreground animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-soft" />
              <span>PostgreSQL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full bg-orange-500 animate-pulse-soft"
                style={{ animationDelay: "0.5s" }}
              />
              <span>MySQL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse-soft"
                style={{ animationDelay: "1s" }}
              />
              <span>SQLite</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
