import { CodeBlock } from "@/components/code-block"
import { BookOpen } from "lucide-react"

export default function MigrationsGuidePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-10 w-10 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold">Migration Strategies</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Learn how to manage database schema changes effectively with Stabilize ORM
        </p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Why Use Migrations?</h2>
            <p className="text-muted-foreground mb-4">
              Migrations provide a version-controlled way to manage database schema changes. They allow you to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Track schema changes over time</li>
              <li>Collaborate with team members safely</li>
              <li>Deploy schema changes consistently across environments</li>
              <li>Rollback changes if needed</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Creating Your First Migration</h2>
            <p className="text-muted-foreground mb-4">Generate a new migration file:</p>
            <CodeBlock code="stabilize-cli generate migration User" language="bash" />
            <p className="text-muted-foreground my-4">
              This creates a timestamped file in the <code>migrations</code> directory:
            </p>
            <CodeBlock
              filename="migrations/20240115120000_users.ts"
              code={`import { Migration } from "stabilize-orm";

export const up: Migration = async (orm) => {
  await orm.rawQuery(\`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  \`);
};

export const down: Migration = async (orm) => {
  await orm.rawQuery("DROP TABLE IF EXISTS users");
};`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Running Migrations</h2>
            <CodeBlock code="stabilize-cli migrate" language="bash" />
            <p className="text-muted-foreground my-4">
              This runs all pending migrations in order. Stabilize tracks which migrations have been applied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Rolling Back Migrations</h2>
            <CodeBlock code="stabilize-cli migration:rollback" language="bash" />
            <p className="text-muted-foreground my-4">
              Rolls back the last batch of migrations using the <code>down</code> function.
            </p>
          </section>

         

          <section>
            <h2 className="text-2xl font-bold mb-4">Migration Best Practices</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                Always write both <code>up</code> and <code>down</code> functions
              </li>
              <li>Test migrations on a copy of production data</li>
              <li>Keep migrations small and focused</li>
              <li>Never modify existing migrations after they've been deployed</li>
              <li>Use transactions for data migrations</li>
              <li>Add indexes in separate migrations for large tables</li>
              <li>Document complex migrations with comments</li>
              <li>Back up your database before running migrations in production</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Migration failed mid-way</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  If a migration fails, manually fix the database state and mark the migration as complete or rolled
                  back.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Conflicts between branches</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Use timestamps in migration filenames to avoid conflicts. Merge migrations carefully.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Long-running migrations</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  For large tables, consider running migrations during low-traffic periods or use online schema change
                  tools.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
