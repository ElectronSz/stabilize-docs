"use client";

import { CodeBlock } from "@/components/code-block";

export default function ScopesPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Query Scopes</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Reusable query filters for cleaner, more maintainable code
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Define Scopes</h2>
              <p className="text-muted-foreground mb-4">
                Scopes are defined in the <code>scopes</code> property of your
                model config. Each scope receives the QueryBuilder and optional
                parameters:
              </p>
              <CodeBlock
                filename="models/User.ts"
                language="typescript"
                code={`import { defineModel, DataTypes } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    email: { type: DataTypes.STRING, length: 255, required: true },
    name: { type: DataTypes.STRING, length: 100 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    role: { type: DataTypes.STRING, length: 50, defaultValue: "user" },
  },
  scopes: {
    active: (qb) => qb.where("isActive = ?", true),
    inactive: (qb) => qb.where("isActive = ?", false),
    admin: (qb) => qb.where("role = ?", "admin"),
    byRole: (qb, role: string) => qb.where("role = ?", role),
    recent: (qb, days: number) => qb.where(
      "createdAt >= ?",
      new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    ),
  },
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Use Scopes</h2>
              <p className="text-muted-foreground mb-4">
                Apply scopes via the <code>scope()</code> method on the
                repository or query builder:
              </p>
              <CodeBlock
                filename="examples/use-scopes.ts"
                language="typescript"
                code={`const userRepo = orm.getRepository(User);

// Single scope
const activeUsers = await userRepo
  .scope("active")
  .execute(orm.client);

// Chain multiple scopes
const activeAdmins = await userRepo
  .scope("active")
  .scope("admin")
  .execute(orm.client);

// Scope with parameters
const editors = await userRepo
  .scope("byRole", "editor")
  .execute(orm.client);

// Recent users (last 7 days)
const recentUsers = await userRepo
  .scope("recent", 7)
  .execute(orm.client);

// Combine scopes with other query methods
const recentActiveAdmins = await userRepo
  .scope("active")
  .scope("admin")
  .scope("recent", 30)
  .orderBy("createdAt", "DESC")
  .limit(10)
  .execute(orm.client);`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Scopes with Soft Deletes
              </h2>
              <p className="text-muted-foreground mb-4">
                The <code>find()</code> method automatically filters out
                soft-deleted records. Scopes work within this filter:
              </p>
              <CodeBlock
                filename="examples/scope-soft-delete.ts"
                language="typescript"
                code={`// Automatically excludes soft-deleted records
const activePosts = await postRepo
  .scope("published")
  .execute(orm.client);

// Find soft-deleted records
const deletedPosts = await postRepo
  .findDeleted()
  .execute(orm.client);

// Find all records including soft-deleted
const allPosts = await postRepo
  .withTrashed()
  .execute(orm.client);`}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
