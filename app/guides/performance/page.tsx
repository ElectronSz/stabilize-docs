"use client";

import { CodeBlock } from "@/components/code-block";
import { Zap } from "lucide-react";

export default function PerformancePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-10 w-10 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Performance Optimization
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Tips and techniques for optimizing query performance in Stabilize ORM
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              1. Selective Field Loading
            </h2>
            <p className="text-muted-foreground mb-4">
              Only load the fields you need:
            </p>
            <CodeBlock
              language="typescript"
              code={`// Loads all columns
const users = await userRepo.find().execute(orm.client);

// Only load needed fields
const users = await userRepo
  .find()
  .select("id", "email", "name")
  .execute(orm.client);

// Or use selectColumns
const partial = await userRepo.selectColumns("id", "email");`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Pagination</h2>
            <p className="text-muted-foreground mb-4">
              Never load all records at once:
            </p>
            <CodeBlock
              language="typescript"
              code={`// Built-in pagination
const page = await userRepo.paginate(1, 20);

// Or use query builder
const results = await userRepo.find()
  .limit(20)
  .offset(20)
  .execute(orm.client);

// Cursor-based pagination for large datasets
const results = await userRepo.findMany({
  take: 20,
  orderBy: { field: "id", direction: "ASC" },
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Use Bulk Operations</h2>
            <CodeBlock
              language="typescript"
              code={`// Bad: Multiple individual inserts
for (const user of users) {
  await userRepo.create(user);
}

// Good: Single bulk insert
await userRepo.bulkCreate(users, { batchSize: 1000 });

// Bulk update
await userRepo.bulkUpdate([...]);

// Bulk upsert
await userRepo.bulkUpsert(users, ["email"]);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              4. Use EXISTS Instead of COUNT
            </h2>
            <CodeBlock
              language="typescript"
              code={`// Bad: Counts all matching rows
const count = await userRepo.count({ role: "admin" });
if (count > 0) { ... }

// Good: Stops at first match
const exists = await userRepo.exists({ role: "admin" });
if (exists) { ... }`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              5. Use Pluck for Single Columns
            </h2>
            <CodeBlock
              language="typescript"
              code={`// Bad: Loads full objects
const users = await userRepo.find().execute(orm.client);
const emails = users.map(u => u.email);

// Good: Only fetches the column
const emails = await userRepo.pluck("email");`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Enable Caching</h2>
            <CodeBlock
              language="typescript"
              code={`const orm = new Stabilize(
  dbConfig,
  { enabled: true, ttl: 300, redisUrl: process.env.REDIS_URL, strategy: "cache-aside" }
);

// Check cache stats
const stats = await orm.getCacheStats();
console.log("Hit ratio:", stats.hits / (stats.hits + stats.misses) * 100);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              7. Use Scopes for Common Queries
            </h2>
            <CodeBlock
              language="typescript"
              code={`const User = defineModel({
  tableName: "users",
  columns: { /* ... */ },
  scopes: {
    active: (qb) => qb.where("isActive = ?", true),
    recent: (qb, days: number) => qb.where("createdAt >= ?",
      new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    ),
  },
});

// Reusable, optimized queries
const recentActive = await userRepo.scope("active").scope("recent", 7).execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              8. Use IN Instead of Multiple OR
            </h2>
            <CodeBlock
              language="typescript"
              code={`// Bad: Multiple OR conditions
await userRepo.find()
  .where("status = ?", "active")
  .orWhere("status = ?", "pending")
  .execute(orm.client);

// Good: IN clause
await userRepo.find()
  .whereIn("status", ["active", "pending"])
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Performance Checklist</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                Use <code>select()</code> to load only needed columns
              </li>
              <li>Paginate large result sets</li>
              <li>
                Use <code>bulkCreate()</code> for multiple inserts
              </li>
              <li>
                Use <code>exists()</code> instead of <code>count()</code> for
                presence checks
              </li>
              <li>
                Use <code>pluck()</code> for single-column fetches
              </li>
              <li>Enable Redis caching for read-heavy workloads</li>
              <li>Define scopes for common query patterns</li>
              <li>
                Use <code>whereIn()</code> instead of multiple{" "}
                <code>orWhere()</code>
              </li>
              <li>Keep transactions short and focused</li>
              <li>
                Use <code>increment()</code>/<code>decrement()</code> for atomic
                counter updates
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
