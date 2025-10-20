"use client"

import { CodeBlock } from "@/components/code-block"

export default function MigrationsPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Migrations</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Manage database schema changes with automatic migration generation
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Generate Migrations</h2>
              <p className="text-muted-foreground mb-4">
                Stabilize automatically generates migrations from your model definitions:
              </p>
              <CodeBlock
                filename="scripts/generate-migration.ts"
                language="typescript"
                code={`import { generateMigration, DBType } from "stabilize-orm";
import { User } from "./models/User";

const migration = await generateMigration(
  User,
  "create_users_table",
  DBType.Postgres
);

console.log("Up queries:", migration.up);
console.log("Down queries:", migration.down);`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Run Migrations</h2>
              <p className="text-muted-foreground mb-4">Execute migrations to update your database schema:</p>
              <CodeBlock
                filename="scripts/run-migrations.ts"
                language="typescript"
                code={`import { runMigrations } from "stabilize-orm";
import dbConfig from "./db-config";

const migrations = [
  {
    name: "create_users_table",
    up: ["CREATE TABLE users (...)"],
    down: ["DROP TABLE users"]
  }
];

await runMigrations(dbConfig, migrations);`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Migration Tracking</h2>
              <p className="text-muted-foreground mb-4">
                Stabilize automatically tracks which migrations have been applied using the <code>stabilize_migrations</code>
                table.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}