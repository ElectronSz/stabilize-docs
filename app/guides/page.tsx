import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BookOpen, Database, Rocket, Shield, Zap } from "lucide-react"

const guides = [
  {
    icon: Rocket,
    title: "Getting Started Guide",
    description: "Complete walkthrough from installation to your first query",
    href: "/guides/getting-started",
    difficulty: "Beginner",
  },
  {
    icon: Database,
    title: "Database Setup",
    description: "Configure PostgreSQL, MySQL, or SQLite for your project",
    href: "/guides/database-setup",
    difficulty: "Beginner",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Tips and techniques for optimizing query performance",
    href: "/guides/performance",
    difficulty: "Advanced",
  },
  {
    icon: Shield,
    title: "Security Best Practices",
    description: "Secure your application against common vulnerabilities",
    href: "/guides/security",
    difficulty: "Intermediate",
  },
  {
    icon: BookOpen,
    title: "Migration Strategies",
    description: "Learn how to manage database migrations effectively",
    href: "/guides/migrations",
    difficulty: "Intermediate",
  },
]

export default function GuidesPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Guides</h1>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl">
            Step-by-step tutorials and best practices for building with Stabilize ORM
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Card
              key={guide.title}
              className="border-accent/20 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-all group"
            >
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <guide.icon className="h-6 w-6 text-accent" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                </div>
                <div className="mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      guide.difficulty === "Beginner"
                        ? "bg-green-500/20 text-green-400"
                        : guide.difficulty === "Intermediate"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {guide.difficulty}
                  </span>
                </div>
                <CardDescription className="text-base">{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" asChild className="group-hover:translate-x-1 transition-transform w-full">
                  <Link href={guide.href}>
                    Read Guide
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
