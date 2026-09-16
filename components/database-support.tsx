import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MongoDBMark,
  MySQLMark,
  PostgreSQLMark,
  SQLiteMark,
  SqlServerMark,
} from "@/components/brand-icons";

/* The five engines are deliberately NOT hue-coded — a coloured badge per
   database is exactly the "AI tag" look we removed. They share one
   outline treatment instead, and the identity is carried by the label
   and the icon above it. */
const BADGE = "border-border bg-transparent text-foreground";

const databases = [
  {
    name: "PostgreSQL",
    icon: PostgreSQLMark,
    description:
      "Full support for advanced features, JSONB, and connection pooling.",
    color: BADGE,
  },
  {
    name: "MySQL",
    icon: MySQLMark,
    description:
      "Complete MySQL compatibility with connection pool management.",
    color: BADGE,
  },
  {
    name: "SQLite",
    icon: SQLiteMark,
    description:
      "Lightweight embedded database perfect for development and testing.",
    color: BADGE,
  },
  {
    name: "SQL Server",
    icon: SqlServerMark,
    description:
      "Microsoft SQL Server, with MERGE-based upserts and IDENTITY keys.",
    color: BADGE,
  },
  {
    name: "MongoDB",
    icon: MongoDBMark,
    description:
      "Document storage through the same repository API, with joins replaced by withRelations().",
    color: BADGE,
  },
];

export function DatabaseSupport() {
  return (
    <section className="relative section">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-small font-semibold text-accent uppercase tracking-widest mb-3">
            Databases
          </p>
          <h2 className="text-h2 mb-4">One API, five databases</h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Switch between PostgreSQL, MySQL, SQLite, SQL Server, and MongoDB by
            changing a single config line. Your code stays the same.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {databases.map((db) => (
            <Card
              key={db.name}
              className="border-border/60 bg-card/50 backdrop-blur-sm hover:border-accent/40 hover:bg-accent-subtle/40 transition-colors duration-300 group"
            >
              <CardContent className="p-6 flex flex-col items-start">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-subtle group-hover:bg-accent/15 transition-colors shrink-0">
                  {/* Real product mark, filled with currentColor so it
                      stays neutral ink in both themes. */}
                  <db.icon className="h-6 w-6 text-accent" />
                </div>
                <Badge variant="outline" className={`mb-2 ${db.color}`}>
                  {db.name}
                </Badge>
                <p className="text-small text-muted-foreground leading-relaxed">
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
