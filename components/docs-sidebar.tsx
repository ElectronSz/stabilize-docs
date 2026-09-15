"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navIcon } from "@/components/nav-icons";
import { cn } from "@/lib/utils";
import type { NavGroup } from "@/lib/nav-manifest";

/**
 * The section's page list is resolved on the server by `lib/nav.ts` and passed
 * in as `groups`. This component renders it — it does not know what the pages
 * are, which is what keeps the navigation from drifting.
 *
 * Alignment: a group heading and its page links share one text axis. The icon
 * sits in a fixed `w-4` slot inside `px-3` and `gap-2`, so the heading label
 * begins at 12 + 16 + 8 = 36px; the links use `pl-9` (36px) to meet it. Change
 * one of those three numbers and you must change the other.
 */
export function DocsSidebar({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/50 bg-card/20 backdrop-blur-sm overflow-y-auto shrink-0 hidden md:block">
      <div className="sticky top-16 p-5 space-y-6">
        {groups.map((section) => {
          const Icon = navIcon(section.icon);

          return (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-2 px-3">
                <span className="flex w-4 shrink-0 justify-center">
                  <Icon className="h-4 w-4 text-accent" />
                </span>
                {/* `m-0`: the base layer gives `h3:not(:first-child)` a
                    `margin-top: 2em` for prose rhythm. Inside this flex row the
                    icon is the first child, so the label would pick that margin
                    up and sit 1em below the icon's centre line. */}
                <h3 className="m-0 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-0.5 list-none pl-0 my-0">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={cn(
                        "block text-sm py-1.5 pl-9 pr-3 rounded-lg transition-all duration-200",
                        pathname === item.href
                          ? "bg-accent/15 text-accent font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/5",
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
