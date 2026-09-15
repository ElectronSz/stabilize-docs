"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { SectionNavigation } from "@/lib/nav-manifest";

/**
 * Where am I? Home / Section / Group / Page.
 *
 * The trail is derived from the same navigation the sidebar renders, so the
 * group name shown here always matches the heading the reader just scrolled
 * past in the sidebar.
 */
export function NavBreadcrumb({ nav }: { nav: SectionNavigation }) {
  const pathname = usePathname();

  const current = nav.items.find((item) => item.href === pathname);
  const group = nav.groups.find((candidate) =>
    candidate.items.some((item) => item.href === pathname),
  );
  const isSectionRoot = pathname === nav.basePath;

  return (
    <div className="border-b border-border/50 bg-card/10">
      <div className="container py-3">
        <div className="mx-auto max-w-4xl">
        <Breadcrumb>
          {/* `list-none pl-0 my-0`: the base layer in app/globals.css gives
              `ol`/`ul` prose list styling (markers + 1.5rem padding-inline-start),
              which the shadcn primitives do not opt out of. */}
          <BreadcrumbList className="list-none pl-0 my-0">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              {isSectionRoot ? (
                <BreadcrumbPage>{nav.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={nav.basePath}>{nav.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {group && !isSectionRoot ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="text-muted-foreground">{group.title}</span>
                </BreadcrumbItem>
              </>
            ) : null}

            {current && !isSectionRoot ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{current.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
        </div>
      </div>
    </div>
  );
}
