import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code" 

const databases = [
  {
    name: "PostgreSQL",
    description: "Full support for advanced PostgreSQL features",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    name: "MySQL",
    description: "Complete MySQL compatibility and optimization",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  {
    name: "SQLite",
    description: "Lightweight SQLite support for embedded databases",
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
]

const configExample = `
// config/database.ts
import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.Postgres, // or DBType.MySQL, DBType.SQLite
  connectionString: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/mydb",
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;
`

export function DatabaseSupport() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background pointer-events-none" />

      <div className="container relative">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-balance">One API, three databases</h2>
              <p className="text-base sm:text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
                Switch between PostgreSQL, MySQL, and SQLite without changing your code. Stabilize handles the
                differences for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {databases.map((db) => (
                <Card
                  key={db.name}
                  className="border-accent/20 bg-card/50 backdrop-blur-sm hover:border-accent/40 transition-all"
                >
                  <CardContent className="pt-6">
                    <Badge className={`mb-4 ${db.color}`}>{db.name}</Badge>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{db.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="rounded-lg border border-accent/30 bg-card/50 backdrop-blur-sm p-4 sm:p-8 shadow-xl shadow-accent/10">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Configuration Example</h3>
              <div className="overflow-x-auto">
                <CodeBlock code={configExample} language="typescript" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}