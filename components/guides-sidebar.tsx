"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { navIcon } from "@/components/nav-icons"
import { cn } from "@/lib/utils"
import type { NavGroup } from "@/lib/nav-manifest"

/**
 * Entries are derived from the filesystem by `lib/nav.ts` and passed in as
 * `groups` — see `lib/nav-manifest.ts` for the ordering this renders.
 *
 * Alignment: the heading icon occupies a fixed `w-4` slot inside `px-3` with
 * `gap-2`, putting the heading label at 12 + 16 + 8 = 36px; the links use
 * `pl-9` (36px) so section titles line up with the page titles beneath them.
 */
export function GuidesSidebar({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-accent/20 bg-card/30 backdrop-blur-sm overflow-y-auto">
      <div className="sticky top-16 p-6 space-y-6">
        {groups.map((section) => {
          const Icon = navIcon(section.icon)

          return (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-3 px-3">
                <span className="flex w-4 shrink-0 justify-center">
                  <Icon className="h-4 w-4 text-accent" />
                </span>
                {/* `m-0`: the base layer gives `h3:not(:first-child)` a
                    `margin-top: 2em` for prose rhythm. Inside this flex row the
                    icon is the first child, so the label would pick that margin
                    up and sit 1em below the icon's centre line. */}
                <h3 className="m-0 font-semibold text-sm text-foreground">{section.title}</h3>
              </div>
              <ul className="space-y-2 list-none pl-0 my-0">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={cn(
                        "block text-sm py-1.5 pl-9 pr-3 rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-accent/20 text-accent font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
