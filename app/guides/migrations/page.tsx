import { CodeBlock } from "@/components/code-block";
import { BookOpen } from "lucide-react";

export default function MigrationsGuidePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-10 w-10 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Migration Strategies
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Learn how to manage database schema changes effectively with Stabilize
          ORM
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">CLI Commands</h2>
            <CodeBlock
              code="bunx stabilize-cli generate:migration User"
              language="bash"
            />
            <CodeBlock code="bunx stabilize-cli migrate" language="bash" />
            <CodeBlock
              code="bunx stabilize-cli migrate:rollback"
              language="bash"
            />
            <CodeBlock
              code="bunx stabilize-cli migrate:fresh --force"
              language="bash"
            />
            <CodeBlock code="bunx stabilize-cli status" language="bash" />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Programmatic Migration</h2>
            <CodeBlock
              filename="scripts/migrate.ts"
              language="typescript"
              code={`import { generateMigration, runMigrations, DBType } from "stabilize-orm";
import { User } from "./models/User";

// Generate migration from model
const migration = await generateMigration(User, "create_users", DBType.SQLite);
console.log("SQL:", migration.up[0]);

// Run migrations
await runMigrations(
  { type: DBType.SQLite, connectionString: "./data/app.db" },
  [migration]
);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">What Gets Generated</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Table creation with correct column types per database</li>
              <li>
                Auto-increment primary key for <code>id</code> columns
              </li>
              <li>
                NOT NULL for <code>required</code> columns
              </li>
              <li>
                UNIQUE for <code>unique</code> columns
              </li>
              <li>DEFAULT values and expressions</li>
              <li>
                Timestamp columns from <code>timestamps</code> config
              </li>
              <li>
                History table if <code>versioned: true</code>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Always review generated migrations before running</li>
              <li>Test migrations on a copy of production data</li>
              <li>Never modify existing migrations after deployment</li>
              <li>
                Use <code>migrate:fresh</code> only in development
              </li>
              <li>Back up your database before production migrations</li>
              <li>
                Use <code>status</code> to check which migrations are applied
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
