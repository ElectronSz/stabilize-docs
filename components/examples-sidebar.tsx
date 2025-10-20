"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText } from "lucide-react"

const examplesSections = [
  {
    title: "Examples",
    icon: FileText,
    items: [
      { title: "Overview", href: "/examples" },
      { title: "CRUD Operations", href: "/examples/crud" },
      { title: "Relationships", href: "/examples/relationships" },
      { title: "Versioning", href: "/examples/versioning" },
    ],
  },
]

export function ExamplesSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-accent/20 bg-card/30 backdrop-blur-sm overflow-y-auto">
      <div className="sticky top-16 p-6 space-y-6">
        {examplesSections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-3">
              <section.icon className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-sm text-foreground">{section.title}</h3>
            </div>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block text-sm py-1.5 px-3 rounded-md transition-colors",
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
        ))}
      </div>
    </aside>
  )
}
