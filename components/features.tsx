import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  Zap,
  Shield,
  GitBranch,
  Layers,
  Clock,
  Terminal,
  Code2,
  RefreshCw,
  Lock,
  Workflow,
} from "lucide-react"

const featureCategories = {
  core: [
    {
      icon: Database,
      title: "Unified API",
      description: "Write once, run on PostgreSQL, MySQL, or SQLite with a single, consistent API.",
    },
    {
      icon: Code2,
      title: "Type-Safe Models",
      description: "Programmatic model definitions with DataTypes enum for database-agnostic schemas.",
    },
    {
      icon: Zap,
      title: "Query Builder",
      description: "Fluent, chainable API for building complex queries with joins, filters, and pagination.",
    },
    {
      icon: Layers,
      title: "Advanced Relationships",
      description: "Define OneToOne, ManyToOne, OneToMany, and ManyToMany relationships with ease.",
    },
  ],
  advanced: [
    {
      icon: Clock,
      title: "Versioning & Time-Travel",
      description: "Automatic history tracking with snapshot queries, rollbacks, and audit trails.",
    },
    {
      icon: Shield,
      title: "Transactional Integrity",
      description: "Built-in support for atomic transactions with automatic rollback on failure.",
    },
    {
      icon: GitBranch,
      title: "Soft Deletes",
      description: 'Enable soft deletes for transparent "deleted" flags and safe row removal.',
    },
    {
      icon: Workflow,
      title: "Caching Support",
      description: "Built-in caching layer for improved performance and reduced database load.",
    },
  ],
  developer: [
    {
      icon: Terminal,
      title: "Full-Featured CLI",
      description: "Generate models, manage migrations, seed data, and reset your database from the command line.",
    },
    {
      icon: RefreshCw,
      title: "Lifecycle Hooks",
      description: "Run custom logic before/after create, update, delete, or save operations.",
    },
    {
      icon: Lock,
      title: "Query Scopes",
      description: "Define reusable query filters and conditions for cleaner, more maintainable code.",
    },
  ],
}

export function Features() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="container relative">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-balance">
                Everything you need to build with confidence
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
                Stabilize provides a complete toolkit for modern database operations with performance and developer
                experience at its core.
              </p>
            </div>

            <Tabs defaultValue="core" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6 sm:mb-8 bg-card/50 backdrop-blur-sm border border-accent/20">
                <TabsTrigger value="core" className="data-[state=active]:bg-accent/20">
                  Core Features
                </TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-accent/20">
                  Advanced
                </TabsTrigger>
                <TabsTrigger value="developer" className="data-[state=active]:bg-accent/20">
                  Developer Tools
                </TabsTrigger>
              </TabsList>

              <TabsContent value="core" className="mt-0">
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  {featureCategories.core.map((feature, index) => (
                    <div
                      key={feature.title}
                      className="flex-1 min-w-[260px] max-w-xs flex justify-center"
                    >
                      <Card
                        className="border-accent/20 bg-card/50 backdrop-blur-sm hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 group w-full"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CardHeader>
                          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                            <feature.icon className="h-6 w-6 text-accent" />
                          </div>
                          <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm sm:text-base leading-relaxed">
                            {feature.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="mt-0">
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  {featureCategories.advanced.map((feature, index) => (
                    <div
                      key={feature.title}
                      className="flex-1 min-w-[260px] max-w-xs flex justify-center"
                    >
                      <Card
                        className="border-accent/20 bg-card/50 backdrop-blur-sm hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 group w-full"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CardHeader>
                          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                            <feature.icon className="h-6 w-6 text-accent" />
                          </div>
                          <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm sm:text-base leading-relaxed">
                            {feature.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="developer" className="mt-0">
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  {featureCategories.developer.map((feature, index) => (
                    <div
                      key={feature.title}
                      className="flex-1 min-w-[260px] max-w-xs flex justify-center"
                    >
                      <Card
                        className="border-accent/20 bg-card/50 backdrop-blur-sm hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 group w-full"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CardHeader>
                          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                            <feature.icon className="h-6 w-6 text-accent" />
                          </div>
                          <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm sm:text-base leading-relaxed">
                            {feature.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}