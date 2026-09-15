"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { SectionNavigation } from "@/lib/nav-manifest";

/**
 * Previous / next along the reading order.
 *
 * `nav.items` is the depth-first flattening of the sidebar, so the order a
 * reader moves through here is exactly the order the sidebar presents — one
 * ordering principle, two ways to travel it.
 *
 * At the two ends of a section the pager crosses into the neighbouring section
 * defined by `SECTION_ORDER`, so the last page of /docs offers the start of
 * /guides rather than stopping. That is the "what to read next" the site was
 * missing.
 */
export function PagePager({ nav }: { nav: SectionNavigation }) {
  const pathname = usePathname();
  const index = nav.items.findIndex((item) => item.href === pathname);

  if (index === -1) return null;

  const previousPage = index > 0 ? nav.items[index - 1] : undefined;
  const nextPage = index < nav.items.length - 1 ? nav.items[index + 1] : undefined;

  // Only fall back to the neighbouring section when this section has run out.
  const previous = previousPage
    ? { href: previousPage.href, title: previousPage.title, isSection: false }
    : nav.prevSection
      ? { href: nav.prevSection.href, title: nav.prevSection.label, isSection: true }
      : undefined;

  const next = nextPage
    ? { href: nextPage.href, title: nextPage.title, isSection: false }
    : nav.nextSection
      ? { href: nav.nextSection.href, title: nav.nextSection.label, isSection: true }
      : undefined;

  if (!previous && !next) return null;

  return (
    <nav aria-label="Page navigation" className="container pb-16">
      <div className="mx-auto max-w-4xl">
        <div className="mt-16 pt-8 border-t border-border/50 grid gap-4 sm:grid-cols-2">
        {previous ? (
          <Link
            href={previous.href}
            className="group rounded-lg border border-border/50 p-4 transition-colors hover:border-accent/50 hover:bg-accent/5"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="h-3 w-3" />
              {previous.isSection ? "Previous section" : "Previous"}
            </span>
            <span className="mt-1 block text-sm font-medium group-hover:text-accent">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link
            href={next.href}
            className="group rounded-lg border border-border/50 p-4 text-right transition-colors hover:border-accent/50 hover:bg-accent/5 sm:col-start-2"
          >
            <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              {next.isSection ? "Next section" : "Next"}
              <ArrowRight className="h-3 w-3" />
            </span>
            <span className="mt-1 block text-sm font-medium group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        ) : null}
        </div>
      </div>
    </nav>
  );
}
