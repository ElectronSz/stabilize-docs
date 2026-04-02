import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Shield, Zap } from "lucide-react";

const databases = [
  {
    name: "PostgreSQL",
    icon: Database,
    description:
      "Full support for advanced features, JSONB, and connection pooling.",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  {
    name: "MySQL",
    icon: Shield,
    description:
      "Complete MySQL compatibility with connection pool management.",
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  {
    name: "SQLite",
    icon: Zap,
    description:
      "Lightweight embedded database perfect for development and testing.",
    color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  },
];

export function DatabaseSupport() {
  return (
    <section className="relative py-20 sm:py-24 md:py-28">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
            Databases
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            One API, three databases
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Switch between PostgreSQL, MySQL, and SQLite by changing a single
            config line. Your code stays the same.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {databases.map((db) => (
            <Card
              key={db.name}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 group"
            >
              <CardContent className="p-6 flex flex-col items-start">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 group-hover:bg-accent/20 transition-colors shrink-0">
                  <db.icon className="h-6 w-6 text-accent" />
                </div>
                <Badge className={`mb-2 ${db.color}`}>{db.name}</Badge>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {db.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
