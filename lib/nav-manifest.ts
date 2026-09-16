/**
 * Single source of truth for the docs site's information architecture.
 *
 * This file answers two questions and nothing else:
 *   1. In what order should a reader meet these pages?
 *   2. What is each page called in the navigation?
 *
 * It deliberately does NOT answer "which pages exist" — `lib/nav.ts` reads the
 * section directory from disk for that. The two are merged at build time, so a
 * page added by anyone (or deleted by anyone) shows up in the navigation
 * without an edit here, and a page listed here that no longer exists is
 * dropped rather than becoming a dead link.
 *
 * `slug` is the directory name under `app/<section>/`. The empty string `""`
 * is the section's own landing page (`app/<section>/page.tsx`).
 */

export type NavSectionKey = "docs" | "api" | "guides" | "examples";

export type NavIconName =
  | "rocket"
  | "layers"
  | "database"
  | "wrench"
  | "activity"
  | "terminal"
  | "server"
  | "braces"
  | "settings"
  | "shield"
  | "lightbulb"
  | "badge-check"
  | "arrow-right-left"
  | "blocks"
  | "refresh-cw"
  | "app-window";

export type NavManifestItem = {
  /** Directory name under `app/<section>/`; `""` is the section landing page. */
  slug: string;
  /** Navigation + prev/next label. */
  title: string;
};

export type NavManifestGroup = {
  title: string;
  icon: NavIconName;
  items: NavManifestItem[];
};

export type NavManifestSection = {
  /** Human label used in breadcrumbs. */
  label: string;
  /** URL prefix, no trailing slash. */
  basePath: string;
  groups: NavManifestGroup[];
};

/**
 * Resolved navigation types.
 *
 * These live here rather than in `lib/nav.ts` on purpose: this module imports
 * nothing, so client components can import these types without any chance of
 * pulling `node:fs` into the browser bundle.
 */
export type NavItem = {
  title: string;
  href: string;
  /** Directory name under `app/<section>/`; `""` for the section landing page. */
  slug: string;
};

export type NavGroup = {
  title: string;
  icon: NavIconName;
  items: NavItem[];
};

/** A neighbouring section, used to carry prev/next across a section boundary. */
export type NavSectionEdge = {
  label: string;
  href: string;
};

/** What a section layout hands to its sidebar, breadcrumb, index and pager. */
export type SectionNavigation = {
  label: string;
  basePath: string;
  groups: NavGroup[];
  /** Depth-first reading order — the prev/next sequence. */
  items: NavItem[];
  /** The section a reader came from, if any — the pager's "previous" at the top edge. */
  prevSection?: NavSectionEdge;
  /** The section a reader should go on to — the pager's "next" at the bottom edge. */
  nextSection?: NavSectionEdge;
};

export const NAV_MANIFEST: Record<NavSectionKey, NavManifestSection> = {
  /**
   * The learning track. Reading order is the teaching order:
   * install it -> model it -> query it -> harden it -> observe it -> ship it.
   */
  docs: {
    label: "Documentation",
    basePath: "/docs",
    groups: [
      {
        title: "Getting Started",
        icon: "rocket",
        items: [
          { slug: "", title: "Introduction" },
          { slug: "installation", title: "Installation" },
          { slug: "quick-start", title: "Quick Start" },
          { slug: "configuration", title: "Configuration" },
        ],
      },
      {
        title: "Core Concepts",
        icon: "layers",
        items: [
          { slug: "models", title: "Models" },
          { slug: "data-types", title: "Data Types" },
          { slug: "validation", title: "Validation" },
          { slug: "relationships", title: "Relationships" },
          { slug: "many-to-many", title: "Many-to-Many" },
          { slug: "query-builder", title: "Query Builder" },
          { slug: "transactions", title: "Transactions" },
        ],
      },
      {
        title: "Querying Data",
        icon: "database",
        items: [
          { slug: "pagination", title: "Pagination" },
          { slug: "aggregates", title: "Aggregates" },
          { slug: "helpers", title: "Helper Methods" },
        ],
      },
      {
        title: "Advanced",
        icon: "wrench",
        items: [
          { slug: "versioning", title: "Versioning & Time Travel" },
          { slug: "optimistic-locking", title: "Optimistic Locking" },
          { slug: "hooks", title: "Lifecycle Hooks" },
          { slug: "soft-deletes", title: "Soft Deletes" },
          { slug: "encryption", title: "Column Encryption" },
          { slug: "metadata", title: "Model Metadata" },
          { slug: "scopes", title: "Query Scopes" },
          { slug: "caching", title: "Caching" },
        ],
      },
      {
        title: "Observability",
        icon: "activity",
        items: [
          { slug: "logging", title: "Logging" },
          { slug: "events", title: "Events" },
          { slug: "retry-and-pooling", title: "Retry & Pooling" },
        ],
      },
      {
        title: "CLI",
        icon: "terminal",
        items: [
          { slug: "cli", title: "CLI Reference" },
          { slug: "migrations", title: "Migrations" },
          { slug: "auto-migrate", title: "AutoMigrate" },
          { slug: "seeding", title: "Database Seeding" },
        ],
      },
      {
        title: "Database Support",
        icon: "server",
        items: [
          { slug: "postgresql", title: "PostgreSQL" },
          { slug: "mysql", title: "MySQL and MariaDB" },
          { slug: "sqlite", title: "SQLite" },
          { slug: "mssql", title: "SQL Server" },
          { slug: "mongodb", title: "MongoDB" },
        ],
      },
    ],
  },

  /**
   * The reference track. Same subject order as `docs` so a topic sits in the
   * same relative position in both sections — learn it in /docs, look it up in
   * /api.
   */
  api: {
    label: "API Reference",
    basePath: "/api",
    groups: [
      {
        title: "Core API",
        icon: "braces",
        items: [
          { slug: "", title: "Overview" },
          { slug: "orm", title: "Stabilize Class" },
          { slug: "repository", title: "Repository" },
          { slug: "query-builder", title: "Query Builder" },
          { slug: "transactions", title: "Transactions" },
        ],
      },
      {
        title: "Configuration",
        icon: "settings",
        items: [
          { slug: "model", title: "Model Definition" },
          { slug: "data-types", title: "Data Types" },
        ],
      },
      {
        title: "Querying",
        icon: "database",
        items: [
          { slug: "pagination", title: "Pagination" },
          { slug: "aggregates", title: "Aggregates" },
          { slug: "helpers", title: "Helper Methods" },
        ],
      },
      {
        title: "Data Integrity",
        icon: "shield",
        items: [
          { slug: "validation", title: "Validation" },
          { slug: "optimistic-locking", title: "Optimistic Locking" },
          { slug: "many-to-many", title: "Many-to-Many" },
          { slug: "soft-deletes", title: "Soft Deletes" },
        ],
      },
      {
        title: "Observability",
        icon: "activity",
        items: [
          { slug: "logging", title: "Logging" },
          { slug: "events", title: "Events" },
          { slug: "retry-and-pooling", title: "Retry & Pooling" },
        ],
      },
      {
        title: "CLI",
        icon: "terminal",
        items: [{ slug: "cli", title: "CLI Commands" }],
      },
    ],
  },

  /** Task-shaped walkthroughs. Broad to narrow, ending in whole applications. */
  guides: {
    label: "Guides",
    basePath: "/guides",
    groups: [
      {
        title: "Getting Started",
        icon: "lightbulb",
        items: [
          { slug: "", title: "Overview" },
          { slug: "getting-started", title: "Getting Started Guide" },
          { slug: "database-setup", title: "Database Setup Guide" },
        ],
      },
      {
        title: "Best Practices",
        icon: "badge-check",
        items: [
          { slug: "performance", title: "Performance Optimization" },
          { slug: "security", title: "Security Best Practices" },
        ],
      },
      {
        title: "Advanced",
        icon: "arrow-right-left",
        items: [{ slug: "migrations", title: "Migration Strategies" }],
      },
    ],
  },

  /** Learn by example. Smallest working snippet up to a full application. */
  examples: {
    label: "Examples",
    basePath: "/examples",
    groups: [
      {
        title: "Fundamentals",
        icon: "blocks",
        items: [
          { slug: "", title: "Overview" },
          { slug: "crud", title: "Basic CRUD Operations" },
          { slug: "relationships", title: "Working with Relationships" },
          { slug: "query-builder", title: "Query Builder Deep Dive" },
        ],
      },
      {
        title: "Data & Lifecycle",
        icon: "refresh-cw",
        items: [
          { slug: "versioning", title: "Versioning & Time-Travel" },
          { slug: "soft-deletes", title: "Soft Deletes & Recovery" },
          { slug: "hooks", title: "Hooks & Lifecycle Events" },
        ],
      },
      {
        title: "Full Applications",
        icon: "app-window",
        items: [
          { slug: "caching", title: "Caching & Performance" },
          { slug: "rest-api", title: "REST API with Express" },
          { slug: "ecommerce", title: "E-Commerce Store" },
        ],
      },
    ],
  },
};

/**
 * The order the site presents its four sections in — matching the header
 * (Docs, Guides, API, Examples) and read as a progression: learn it, do it,
 * look it up, copy it.
 *
 * This drives prev/next across section boundaries, so finishing the last page
 * of a section offers the start of the next one instead of a dead end.
 */
export const SECTION_ORDER: NavSectionKey[] = ["docs", "guides", "api", "examples"];
