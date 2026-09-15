# Stabilize ORM — Documentation Site

<div align="left">
  <img src="./public/logo_both-transparent.png" alt="Stabilize ORM Logo" width="250" />
</div>

The documentation website for **Stabilize ORM** — a modern, type-safe ORM for
Bun, Node.js and Deno with support for SQLite, MySQL, PostgreSQL and SQL Server.

This is a Next.js App Router site (Next 15, React 19, Tailwind v4, shadcn/ui
over Radix). It is a **private, unpublishable package**: it renders the docs, it
is not the library.

## How it relates to the library

This directory is a sibling of the ORM itself:

```
stabilize/                 <- the library (stabilize-orm) and its git repo
├── src/  tests/  stabilize-cli/  ...
└── stabilize-docs/        <- you are here
```

The site does not import the library. It has no dependency on `stabilize-orm`,
no build step that reads the library's source, and no type coupling to it — the
API reference is written prose and code samples under `app/api/`. That is
deliberate: the docs build stays fast and independent, and a change to the
library cannot break the site's build.

The one thing shared is the parent's tooling, and that has been a problem — see
**Linting** below.

## Running it

Requires [Bun](https://bun.sh). This project uses **`bun.lockb` as its only
lockfile**; there is no `package-lock.json`, `yarn.lock` or `pnpm-lock.yaml`, and
`package-lock.json`/`pnpm-lock.yaml` should not be reintroduced.

```bash
bun install
bun run dev          # dev server on http://localhost:3000
```

```bash
bun run build        # production build
bun run start        # serve the production build
```

### Scripts

| Script | What it does |
| --- | --- |
| `bun run dev` | Next dev server with Fast Refresh |
| `bun run build` | Production build into `.next` |
| `bun run start` | Serve the production build |
| `bun run clean` | Delete `.next` (use before reporting a build problem) |
| `bun run lint` | ESLint over the project, using this project's own config |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run verify:routes` | Request **every** route and report the status of each |

## Navigation

The sidebars are **derived from the filesystem**, not hand-maintained, because
hand-maintained lists drifted: the examples sidebar was listing 4 of that
section's 10 pages.

- `lib/nav-manifest.ts` — the single source of truth for **reading order and
  titles**. One entry per section, grouped, in the order a reader should meet
  the pages.
- `lib/nav.ts` — reads the section directory from disk and merges it with the
  manifest. A page added by anyone appears in the navigation without an edit;
  a manifest entry whose page was deleted is dropped instead of becoming a dead
  link; anything uncatalogued lands in a trailing **More** group rather than
  going invisible.
- Each section `layout.tsx` resolves that on the server and hands plain data to
  the client sidebar, breadcrumb, section index and prev/next pager.

To add a page: create `app/<section>/<slug>/page.tsx`, then add its title to the
matching group in `lib/nav-manifest.ts`. If you skip the second step the page
still renders in the **More** group — the navigation cannot silently lose it.

### Where a section starts and where it goes

| Section | Path | Reads as |
| --- | --- | --- |
| Documentation | `/docs` | The learning track, install → model → query → harden → observe → ship |
| API Reference | `/api` | The reference track, same subject order as `/docs` |
| Guides | `/guides` | Task-shaped walkthroughs, broad to narrow |
| Examples | `/examples` | Smallest working snippet up to a full application |

Each page ends with prev/next along that order, and each section landing page
carries a numbered index of the whole section.

## Linting

`bun run lint` uses this project's own `eslint.config.mjs`. Keep it that way:
with no local ESLint config, `eslint` walks up to the parent ORM repo and picks
up **the library's** `.eslintrc.json`, so the docs get linted with rules that
belong to a different package and cannot be seen from here.

`next build` does not run ESLint (`eslint.ignoreDuringBuilds` in
`next.config.mjs`, with the reasoning inline in that file). Run `bun run lint`
and `bun run typecheck` instead — the build stays fast and independent, and lint
stays a real, separately-reportable check.

## Building alongside other work

Two builds sharing one `.next` overwrite each other's chunks; a `next start`
serving the result then fails at request time with
`Cannot find module './NNNN.js'`. If you need a build you can trust while
someone else is building, give it its own directory:

```bash
NEXT_DIST_DIR=.next-verify bun run build
NEXT_DIST_DIR=.next-verify bun run start
BASE_URL=http://localhost:3000 bun run verify:routes
```

## Find the source

[GitHub: ElectronSz/stabilize-orm](https://github.com/ElectronSz/stabilize-orm)
