import { Card, CardContent } from "@/components/ui/card";
import {
  Database,
  Shield,
  GitBranch,
  Layers,
  Clock,
  Terminal,
  Zap,
  Workflow,
  HardDrive,
  FileCode2,
  BarChart3,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Unified API",
    description:
      "One codebase runs on PostgreSQL, MySQL, and SQLite with zero changes.",
  },
  {
    icon: Zap,
    title: "Type-Safe Models",
    description:
      "Define schemas with the DataTypes enum. Full TypeScript inference throughout.",
  },
  {
    icon: Layers,
    title: "Relationships",
    description:
      "OneToOne, ManyToOne, OneToMany, and ManyToMany with automatic joins.",
  },
  {
    icon: GitBranch,
    title: "Versioning",
    description:
      "Automatic history tracking with time-travel queries and rollback support.",
  },
  {
    icon: Clock,
    title: "Soft Deletes",
    description:
      "Mark records as deleted without removing them. Recover anytime.",
  },
  {
    icon: Shield,
    title: "Transactions",
    description:
      "Atomic operations with automatic rollback across all supported databases.",
  },
  {
    icon: Terminal,
    title: "CLI Tools",
    description:
      "Generate models, migrations, seeds, and REST APIs from the command line.",
  },
  {
    icon: Workflow,
    title: "Query Scopes",
    description:
      "Define reusable query filters and chain them for complex queries.",
  },
  {
    icon: Lock,
    title: "Optimistic Locking",
    description:
      "Detect concurrent modifications and prevent data conflicts automatically.",
  },
  {
    icon: HardDrive,
    title: "Backup & Restore",
    description: "Database backup and restore with a single CLI command.",
  },
  {
    icon: FileCode2,
    title: "API Generation",
    description:
      "Scaffold complete REST API routes from your model definitions.",
  },
  {
    icon: BarChart3,
    title: "Caching Layer",
    description:
      "Redis-backed caching with cache-aside and write-through strategies.",
  },
];

export function Features() {
  return (
    <section className="relative py-20 sm:py-24 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete toolkit for building production applications with
            type-safe database access.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/40 hover:bg-accent/5 transition-all duration-300"
            >
              <CardContent className="p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
