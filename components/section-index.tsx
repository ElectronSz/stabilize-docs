"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { SectionNavigation } from "@/lib/nav-manifest";

/**
 * The whole section, in reading order, shown on the section landing page.
 *
 * Pages are numbered across the section rather than per group: the number is
 * the reading position, so "start at 1 and keep going" is literally true. It
 * renders from the same navigation as the sidebar, so the two can never
 * disagree about what exists or what order it is in.
 */
export function SectionIndex({ nav }: { nav: SectionNavigation }) {
  const pathname = usePathname();

  // Only on the section landing page — every other page has the sidebar.
  if (pathname !== nav.basePath) return null;

  let position = 0;

  return (
    <section className="container pb-16">
      <div className="mx-auto max-w-4xl">
        <div className="border-t border-border/50 pt-10">
        <h2 className="text-2xl font-semibold mb-2">In this section</h2>
        <p className="text-sm text-muted-foreground mb-8">
          {nav.label} reads top to bottom. Each page also links to the next, so
          you can start at the beginning and follow along.
        </p>

        <div className="space-y-8">
          {nav.groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {group.title}
              </h3>
              <ol className="space-y-1 list-none pl-0 my-0">
                {group.items.map((item) => {
                  position += 1;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-baseline gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/5 hover:text-foreground"
                      >
                        <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground/60">
                          {position}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
