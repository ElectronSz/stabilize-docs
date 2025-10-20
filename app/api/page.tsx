import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Code2, Database, FileCode, GitBranch, Layers, Terminal } from "lucide-react"

const apiSections = [
  {
    icon: Database,
    title: "Stabilize Class",
    description: "Core Stabilize class for database connections and repository management",
    href: "/api/orm",
  },
  {
    icon: Layers,
    title: "Repository",
    description: "Repository pattern for data access and manipulation",
    href: "/api/repository",
  },
  {
    icon: Code2,
    title: "Query Builder",
    description: "Fluent API for building complex database queries",
    href: "/api/query-builder",
  },
  {
    icon: FileCode,
    title: "Model Definition",
    description: "Define models with columns, relationships, and options",
    href: "/api/model",
  },
  {
    icon: GitBranch,
    title: "Data Types",
    description: "Available data types for model columns",
    href: "/api/data-types",
  },
  {
    icon: Terminal,
    title: "CLI Commands",
    description: "Command-line interface reference",
    href: "/api/cli",
  },
]

export default function ApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">API Reference</h1>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl">
              Complete API documentation for Stabilize ORM
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiSections.map((section) => (
              <Link key={section.title} href={section.href}>
                <Card className="border-accent/20 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-all h-full group">
                  <CardHeader>
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <section.icon className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription className="text-base">{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
