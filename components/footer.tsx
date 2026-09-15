import Link from "next/link";
import { GitHubMark, XMark } from "@/components/brand-icons";

const columns = [
  {
    heading: "Documentation",
    links: [
      { href: "/docs/quick-start", label: "Quick Start" },
      { href: "/docs/models", label: "Models" },
      { href: "/docs/query-builder", label: "Query Builder" },
      { href: "/docs/cli", label: "CLI" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/api", label: "API Reference" },
      { href: "/examples", label: "Examples" },
      { href: "/docs/versioning", label: "Versioning" },
    ],
  },
];

const linkClass =
  "text-small text-muted-foreground hover:text-accent-subtle-foreground transition-colors";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/60 bg-card/30 backdrop-blur-sm">
      <div className="container section-tight">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto">
          <div className="md:col-span-1">
            {/* Same wordmark as the header: "Stabilize" in ink, "ORM"
                muted beside it on a shared baseline. There is no logo
                image anywhere on the site — keep it that way. */}
            <Link
              href="/"
              className="flex items-baseline gap-1.5 mb-4 group w-fit"
            >
              <span className="text-body font-semibold tracking-tight text-foreground group-hover:opacity-80 transition-opacity">
                Stabilize
              </span>
              <span className="text-body font-normal tracking-tight text-muted-foreground group-hover:opacity-80 transition-opacity">
                ORM
              </span>
            </Link>
            <p className="text-small text-muted-foreground leading-relaxed">
              A modern, type-safe ORM for Bun with unified PostgreSQL, MySQL,
              SQLite, and SQL Server support.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h4 className="text-small font-semibold mb-3">{column.heading}</h4>
              <ul className="space-y-2 list-none p-0 m-0">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-small font-semibold mb-3">Community</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li>
                <a
                  href="https://github.com/ElectronSz/stabilize-orm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} flex items-center gap-2`}
                >
                  <GitHubMark className="h-4 w-4" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/th3b0tk1ll3r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} flex items-center gap-2`}
                >
                  <XMark className="h-4 w-4" /> X
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-5xl">
          <p className="text-micro text-muted-foreground">
            &copy; {new Date().getFullYear()} Stabilize ORM. Built by{" "}
            <a
              href="https://github.com/ElectronSz"
              className="underline hover:text-accent-subtle-foreground"
            >
              ElectronSz
            </a>
            .
          </p>
          <p className="text-micro text-muted-foreground">
            Made with care in Eswatini
          </p>
        </div>
      </div>
    </footer>
  );
}
