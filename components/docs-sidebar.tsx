"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Book, Rocket, Zap, Terminal } from "lucide-react";

const docsSections = [
  {
    title: "Getting Started",
    icon: Rocket,
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Configuration", href: "/docs/configuration" },
    ],
  },
  {
    title: "Core Concepts",
    icon: Book,
    items: [
      { title: "Models", href: "/docs/models" },
      { title: "Relationships", href: "/docs/relationships" },
      { title: "Query Builder", href: "/docs/query-builder" },
      { title: "Transactions", href: "/docs/transactions" },
    ],
  },
  {
    title: "Advanced",
    icon: Zap,
    items: [
      { title: "Versioning", href: "/docs/versioning" },
      { title: "Lifecycle Hooks", href: "/docs/hooks" },
      { title: "Soft Deletes", href: "/docs/soft-deletes" },
      { title: "Query Scopes", href: "/docs/scopes" },
      { title: "Caching", href: "/docs/caching" },
    ],
  },
  {
    title: "CLI",
    icon: Terminal,
    items: [
      { title: "Overview", href: "/docs/cli" },
      { title: "Migrations", href: "/docs/migrations" },
      { title: "Seeding", href: "/docs/seeding" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/50 bg-card/20 backdrop-blur-sm overflow-y-auto shrink-0 hidden md:block">
      <div className="sticky top-16 p-5 space-y-6">
        {docsSections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-2 px-3">
              <section.icon className="h-3.5 w-3.5 text-accent" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h3>
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block text-sm py-1.5 px-3 rounded-lg transition-all duration-200",
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
        ))}
      </div>
    </aside>
  );
}
