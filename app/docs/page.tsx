import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BookOpen, Code2, Terminal, Zap } from "lucide-react"

const sections = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Learn the basics and set up your first Stabilize project",
    href: "/docs/installation",
  },
  {
    icon: Code2,
    title: "Models & Relationships",
    description: "Define your data models and establish relationships",
    href: "/docs/models",
  },
  {
    icon: Zap,
    title: "Query Builder",
    description: "Build complex queries with our fluent API",
    href: "/docs/query-builder",
  },
  {
    icon: Terminal,
    title: "CLI Reference",
    description: "Master the command-line tools for migrations and more",
    href: "/docs/cli",
  },
]

export default function DocsPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Documentation</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Everything you need to know about building with Stabilize ORM
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sections.map((section) => (
            <Card
              key={section.title}
              className="border-accent/20 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-colors group"
            >
              <CardHeader>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <section.icon className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription className="text-base">{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" asChild className="group-hover:translate-x-1 transition-transform">
                  <Link href={section.href}>
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Get up and running in minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Install Stabilize</h3>
              <div className="rounded-lg border border-accent/30 bg-secondary/50 p-4">
                <code className="text-sm font-mono">bun add stabilize-orm</code>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Configure your database</h3>
              <div className="rounded-lg border border-accent/30 bg-secondary/50 p-4 overflow-x-auto">
                <pre className="text-sm font-mono">
                  {`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.Postgres,
  connectionString: process.env.NEON_DATABASE_URL,
};`}
                </pre>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Define your first model</h3>
              <div className="rounded-lg border border-accent/30 bg-secondary/50 p-4 overflow-x-auto">
                <pre className="text-sm font-mono">
                  {`import { defineModel, DataTypes } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.Integer, required: true },
    email: { type: DataTypes.String, length: 100 },
  },
});`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
