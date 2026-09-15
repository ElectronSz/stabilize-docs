import { CodeBlock } from "@/components/code-block";

export default function MigrationsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-4">Migrations</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Manage database schema changes with automatic migration generation
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Generate Migrations
              </h2>
              <p className="text-muted-foreground mb-4">
                Use the CLI to generate migrations from your model definitions:
              </p>
              <CodeBlock
                code="bunx stabilize-cli generate:migration User"
                language="bash"
              />
              <p className="text-muted-foreground my-4">
                Or generate migrations programmatically:
              </p>
              <CodeBlock
                filename="scripts/generate-migration.ts"
                language="typescript"
                code={`import { generateMigration, DBType } from "stabilize-orm";
import { User } from "./models/User";

const migration = await generateMigration(User, "create_users", DBType.Postgres);

console.log("Up:", migration.up);
console.log("Down:", migration.down);
// Up: CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, ...)
// Down: DROP TABLE IF EXISTS users`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Run Migrations</h2>
              <CodeBlock code="bunx stabilize-cli migrate" language="bash" />
              <CodeBlock
                code="bunx stabilize-cli migrate:rollback"
                language="bash"
              />
              <CodeBlock
                code="bunx stabilize-cli migrate:fresh --force"
                language="bash"
              />
              <p className="text-sm text-muted-foreground mt-2">
                <code>migrate:fresh</code> drops all tables and re-runs
                migrations without seeding.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Migration Tracking
              </h2>
              <p className="text-muted-foreground mb-4">
                Stabilize tracks applied migrations in the{" "}
                <code>stabilize_migrations</code> table. Check status with:
              </p>
              <CodeBlock code="bunx stabilize-cli status" language="bash" />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                What Gets Generated
              </h2>
              <p className="text-muted-foreground mb-4">
                The migration generator reads your model config and produces SQL
                for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Table creation with correct column types per database</li>
                <li>
                  Auto-increment primary key for <code>id</code> columns
                </li>
                <li>
                  NOT NULL constraints for <code>required</code> columns
                </li>
                <li>
                  UNIQUE constraints for <code>unique</code> columns
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
              <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Always review generated migrations before running</li>
                <li>Test migrations on a copy of production data</li>
                <li>
                  Never modify existing migrations after they&apos;ve been
                  deployed
                </li>
                <li>
                  Use <code>migrate:fresh</code> only in development
                </li>
                <li>
                  Back up your database before running migrations in production
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                AutoMigrate (GORM-style)
              </h2>
              <p className="text-muted-foreground mb-4">
                For rapid development, use <code>autoMigrate</code> instead of
                manual migrations. It automatically creates tables and adds
                missing columns:
              </p>
              <CodeBlock
                filename="app.ts"
                language="typescript"
                code={`// Single model
await orm.autoMigrate(User);

// Multiple models
await orm.autoMigrate([User, Post, Comment]);`}
              />
              <CodeBlock
                code="bunx stabilize-cli migrate:auto"
                language="bash"
              />
              <p className="text-sm text-muted-foreground mt-2">
                AutoMigrate is safe — it never deletes data. See the{" "}
                <a href="/docs/auto-migrate" className="text-accent underline">
                  AutoMigrate docs
                </a>{" "}
                for details.
              </p>
            </section>
          </div>
    </div>
  );
}
