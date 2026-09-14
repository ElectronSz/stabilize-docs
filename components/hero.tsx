import { Button } from "@/components/ui/button"
import { ArrowRight, Copy, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Space background */}
      <div className="absolute inset-0 space-gradient" />
      <div className="absolute inset-0 star-field" />

      {/* Glowing orbs */}
      <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-glow" />
      <div
        className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-glow"
        style={{ animationDelay: "1s" }}
      />

      <div className="container relative py-12 sm:py-16 md:py-20">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span className="font-medium text-accent">v1.3.0</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Now with automatic versioning</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-balance">
                A Modern, Type-Safe ORM for{" "}
                <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-shimmer">
                  Bun
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto leading-relaxed">
                Lightweight, feature-rich ORM designed for performance and developer experience. Write once, run on
                PostgreSQL, MySQL, or SQLite.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
                <Button
                  size="lg"
                  asChild
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Link href="/guides">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto border-accent/30 hover:bg-accent/10 bg-transparent"
                >
                  <Link href="/docs">View Documentation</Link>
                </Button>
              </div>

              <div className="w-full max-w-2xl">
                <div className="rounded-lg border border-accent/30 bg-card/50 backdrop-blur-sm p-4 shadow-2xl shadow-accent/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-muted-foreground">Terminal</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-accent/20">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <code className="text-sm font-mono block text-left">
                    <span className="text-muted-foreground">$</span> <span className="text-accent">bun add</span>{" "}
                    <span className="text-foreground">stabilize-orm</span>
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
