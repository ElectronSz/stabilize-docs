/**
 * Filesystem-derived navigation.
 *
 * The four sidebars used to each carry a hand-written array of `{ title, href }`
 * pairs. They drifted: by the time this module was written the examples sidebar
 * listed 4 of the 10 example pages, and pages added by other authors were
 * invisible until someone remembered to edit the array.
 *
 * So the *set of pages* now comes from the filesystem (this module) and only the
 * *order* and *label* come from the manifest (`lib/nav-manifest.ts`). The merge
 * rules below are what stop the drift:
 *
 *   - A page directory that exists on disk but is absent from the manifest is
 *     still rendered, under a trailing "More" group, with a title derived from
 *     its slug. A new page is never invisible, even before someone curates it.
 *   - A manifest entry whose page directory no longer exists is dropped, so a
 *     deleted page cannot leave a dead link behind.
 *   - A group whose pages are all gone disappears, so no empty headings.
 *
 * This module reads `node:fs`, so it is server-only by construction: it must be
 * called from a Server Component (the section layouts do exactly that) and only
 * its plain-data result may cross into the client sidebars.
 */

import fs from "node:fs";
import path from "node:path";

import {
  NAV_MANIFEST,
  SECTION_ORDER,
  type NavGroup,
  type NavItem,
  type NavSectionEdge,
  type NavSectionKey,
  type SectionNavigation,
} from "./nav-manifest";

export type { NavGroup, NavItem, SectionNavigation };

/** Title fallback for a page nobody has catalogued yet, e.g. `auto-migrate` -> `Auto Migrate`. */
const ACRONYMS = new Set([
  "api",
  "cli",
  "orm",
  "sql",
  "db",
  "http",
  "rest",
  "json",
  "crud",
  "id",
]);

function titleFromSlug(slug: string): string {
  if (!slug) return "Overview";
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) =>
      ACRONYMS.has(word) ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1),
    )
    .join(" ");
}

function hrefFor(basePath: string, slug: string): string {
  return slug ? `${basePath}/${slug}` : basePath;
}

/**
 * Every page that actually exists for a section, in stable on-disk order.
 * The section landing page (`app/<section>/page.tsx`) is represented as `""`.
 */
function listSlugs(section: NavSectionKey): string[] {
  const dir = path.join(process.cwd(), "app", section);

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    // A section that does not exist yet should not break the build.
    return [];
  }

  const slugs = entries
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(dir, entry.name, "page.tsx")),
    )
    .map((entry) => entry.name)
    .sort();

  if (fs.existsSync(path.join(dir, "page.tsx"))) {
    slugs.unshift("");
  }

  return slugs;
}

/**
 * The navigation for one section: manifest order and labels, reconciled against
 * what is on disk. Safe to call from a Server Component on every render — the
 * directory read is a handful of `stat`s.
 */
export function getSectionNav(section: NavSectionKey): NavGroup[] {
  const manifest = NAV_MANIFEST[section];
  const onDisk = new Set(listSlugs(section));
  const catalogued = new Set<string>();
  const groups: NavGroup[] = [];

  for (const group of manifest.groups) {
    const items: NavItem[] = [];

    for (const entry of group.items) {
      if (!onDisk.has(entry.slug)) continue; // deleted page -> drop the entry
      catalogued.add(entry.slug);
      items.push({
        title: entry.title,
        href: hrefFor(manifest.basePath, entry.slug),
        slug: entry.slug,
      });
    }

    if (items.length > 0) {
      groups.push({ title: group.title, icon: group.icon, items });
    }
  }

  const uncatalogued = [...onDisk].filter((slug) => !catalogued.has(slug)).sort();
  if (uncatalogued.length > 0) {
    groups.push({
      title: "More",
      icon: "layers",
      items: uncatalogued.map((slug) => ({
        title: titleFromSlug(slug),
        href: hrefFor(manifest.basePath, slug),
        slug,
      })),
    });
  }

  return groups;
}

/** Depth-first flattening of `getSectionNav`, which is the prev/next reading order. */
export function flattenNav(groups: NavGroup[]): NavItem[] {
  return groups.flatMap((group) => group.items);
}

/**
 * Where a reader goes when they run out of section — the neighbouring sections
 * in `SECTION_ORDER`, so a section never ends in a dead end.
 */
function getSectionEdges(section: NavSectionKey): {
  prevSection?: NavSectionEdge;
  nextSection?: NavSectionEdge;
} {
  const index = SECTION_ORDER.indexOf(section);

  const edge = (key: NavSectionKey | undefined): NavSectionEdge | undefined => {
    if (!key) return undefined;
    const manifest = NAV_MANIFEST[key];
    return { label: manifest.label, href: manifest.basePath };
  };

  return {
    prevSection: edge(index > 0 ? SECTION_ORDER[index - 1] : undefined),
    nextSection: edge(
      index >= 0 && index < SECTION_ORDER.length - 1
        ? SECTION_ORDER[index + 1]
        : undefined,
    ),
  };
}

/** Convenience for the layouts: both the grouped nav and its flat reading order. */
export function getSectionNavigation(section: NavSectionKey): SectionNavigation {
  const manifest = NAV_MANIFEST[section];
  const groups = getSectionNav(section);

  return {
    label: manifest.label,
    basePath: manifest.basePath,
    groups,
    items: flattenNav(groups),
    ...getSectionEdges(section),
  };
}

/**
 * Every route the site is expected to serve, derived the same way the navigation
 * is. Used by the route sweep script so the checklist cannot go stale either.
 */
export function listAllRoutes(): string[] {
  const routes = ["/"];

  for (const section of Object.keys(NAV_MANIFEST) as NavSectionKey[]) {
    const basePath = NAV_MANIFEST[section].basePath;
    for (const slug of listSlugs(section)) {
      routes.push(hrefFor(basePath, slug));
    }
  }

  return routes;
}
