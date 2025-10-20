import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Code2, Database, FileCode, GitBranch, Layers, Zap } from "lucide-react"

const examples = [
  {
    icon: Database,
    title: "Basic CRUD Operations",
    description: "Create, read, update, and delete records with simple examples",
    href: "/examples/crud",
    tags: ["Beginner", "Repository"],
  },
  {
    icon: Layers,
    title: "Working with Relationships",
    description: "Define and query one-to-many and many-to-many relationships",
    href: "/examples/relationships",
    tags: ["Intermediate", "Relations"],
  },
 
  {
    icon: GitBranch,
    title: "Versioning & Time-Travel",
    description: "Track changes and query historical data",
    href: "/examples/versioning",
    tags: ["Advanced", "Versioning"],
  },

 
]

export default function ExamplesPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Examples</h1>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl">
            Practical code examples to help you get started with Stabilize ORM
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example) => (
            <Card
              key={example.title}
              className="border-accent/20 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-all group"
            >
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <example.icon className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">{example.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mb-2">
                  {example.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <CardDescription className="text-base">{example.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" asChild className="group-hover:translate-x-1 transition-transform w-full">
                  <Link href={example.href}>
                    View Example
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
