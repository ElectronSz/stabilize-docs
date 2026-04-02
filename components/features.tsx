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

const groups = [
  {
    label: "Core",
    items: [
      {
        icon: Database,
        title: "Unified API",
        desc: "One codebase runs on PostgreSQL, MySQL, and SQLite.",
      },
      {
        icon: Zap,
        title: "Type-Safe Models",
        desc: "Full TypeScript inference with the DataTypes enum.",
      },
      {
        icon: Layers,
        title: "Relationships",
        desc: "OneToOne, ManyToOne, OneToMany, ManyToMany.",
      },
      {
        icon: Clock,
        title: "Soft Deletes",
        desc: "Mark deleted without removing. Recover anytime.",
      },
    ],
  },
  {
    label: "Advanced",
    items: [
      {
        icon: GitBranch,
        title: "Versioning",
        desc: "History tracking with time-travel and rollback.",
      },
      {
        icon: Shield,
        title: "Transactions",
        desc: "Atomic operations with automatic rollback.",
      },
      {
        icon: Lock,
        title: "Optimistic Locking",
        desc: "Detect concurrent modifications automatically.",
      },
      {
        icon: Workflow,
        title: "Query Scopes",
        desc: "Reusable filters for complex queries.",
      },
    ],
  },
  {
    label: "Tooling",
    items: [
      {
        icon: Terminal,
        title: "CLI (23 commands)",
        desc: "Generate models, migrations, seeds, APIs.",
      },
      {
        icon: HardDrive,
        title: "Backup & Restore",
        desc: "Database backup with a single command.",
      },
      {
        icon: FileCode2,
        title: "API Generation",
        desc: "Scaffold REST routes from model definitions.",
      },
      {
        icon: BarChart3,
        title: "Caching Layer",
        desc: "Redis cache-aside and write-through strategies.",
      },
    ],
  },
];

export function Features() {
  return (
    <section className="relative py-20 sm:py-24 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A complete toolkit for building production apps with type-safe
            database access.
          </p>
        </div>

        <div className="space-y-12">
          {groups.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-5 pl-1">
                {group.label}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.items.map((item) => (
                  <div
                    key={item.title}
                    className="group flex items-start gap-4 p-5 rounded-2xl border border-border/40 bg-card/40 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300"
                  >
                    <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[15px] mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
