import Link from "next/link";
import { Github, Twitter, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent text-accent-foreground font-bold text-sm">
                <Zap className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">Stabilize</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A modern, type-safe ORM for Bun with unified PostgreSQL, MySQL,
              and SQLite support.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Documentation</h4>
            <ul className="space-y-2">
              {[
                { href: "/docs/quick-start", label: "Quick Start" },
                { href: "/docs/models", label: "Models" },
                { href: "/docs/query-builder", label: "Query Builder" },
                { href: "/docs/cli", label: "CLI" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2">
              {[
                { href: "/guides", label: "Guides" },
                { href: "/api", label: "API Reference" },
                { href: "/examples", label: "Examples" },
                { href: "/docs/versioning", label: "Versioning" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Community</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/ElectronSz/stabilize-orm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/th3b0tk1ll3r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Stabilize ORM. Built by{" "}
            <a
              href="https://github.com/ElectronSz"
              className="underline hover:text-foreground"
            >
              ElectronSz
            </a>
            .
          </p>
          <p className="text-xs text-muted-foreground">
            Made with care in Eswatini
          </p>
        </div>
      </div>
    </footer>
  );
}
