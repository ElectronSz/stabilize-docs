"use client"

import { CodeBlock } from "@/components/code-block"
import { Zap } from "lucide-react"

export default function PerformancePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-10 w-10 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold">Performance Optimization</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Tips and techniques for optimizing query performance in Stabilize ORM
        </p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Use Selective Field Loading</h2>
            <p className="text-muted-foreground mb-4">
              Only load the fields you need instead of fetching entire records:
            </p>
            <CodeBlock
              language="typescript"
              code={`// ❌ Bad: Loads all columns
const users = await userRepo.find().execute(dbClient);

// ✅ Good: Only load needed fields
const users = await userRepo
  .find()
  .select("id", "email", "name")
  .execute(dbClient);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Implement Pagination</h2>
            <p className="text-muted-foreground mb-4">
              Never load all records at once. Use pagination for large datasets:
            </p>
            <CodeBlock
              language="typescript"
              code={`// ❌ Bad: Loads everything
const allPosts = await postRepo.find().execute(dbClient);

// ✅ Good: Paginate results
const page = 1;
const perPage = 20;

const posts = await postRepo
  .find()
  .limit(perPage)
  .offset((page - 1) * perPage)
  .execute(dbClient);

// Even better: Use cursor-based pagination
const posts = await postRepo
  .find()
  .where("id > ?", lastSeenId)
  .limit(20)
  .orderBy("id ASC")
  .execute(dbClient);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Optimize Relationship Loading</h2>
            <p className="text-muted-foreground mb-4">Avoid N+1 queries by eager loading relationships:</p>
            <CodeBlock
              language="typescript"
              code={`// ❌ Bad: N+1 query problem
const users = await userRepo.find().execute(dbClient);
for (const user of users) {
  const posts = await postRepo.find().where("userId = ?", user.id).execute(dbClient);
  // This runs a query for each user!
}

// ✅ Good: Eager load relationships
const users = await userRepo.find().with("posts").execute(dbClient);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Use Indexes Strategically</h2>
            <p className="text-muted-foreground mb-4">
              Add indexes to columns frequently used in WHERE, JOIN, and ORDER BY clauses:
            </p>
            <CodeBlock
              language="typescript"
              code={`export const User = defineModel({
  tableName: "users",
  columns: {
    id: {
      type: DataTypes.Integer
    },
    email: {
      type: DataTypes.String,
      unique: true, // Automatically creates an index
      required: true,
    },
    status: {
      type: DataTypes.String,
      index: true, // Add index for frequent filtering
    },
    createdAt: {
      type: DataTypes.Timestamp,
      index: true, // Index for sorting/filtering by date
    },
  },

});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Enable Query Caching</h2>
            <p className="text-muted-foreground mb-4">Cache frequently accessed data with Redis:</p>
            <CodeBlock
              language="typescript"
              code={`import { Stabilize } from "stabilize-orm";

const orm = new Stabilize({
  type: DBType.Postgres,
  connectionString: process.env.DATABASE_URL!,
  cache: {
    enabled: true,
    redisUrl: process.env.REDIS_URL,
    ttl: 300, // Cache for 5 minutes
    cachePrefix: "myapp:",
    strategy: "cache-aside", // or "write-through"
  },
});

// Queries are automatically cached
const user = await userRepo.find().where("id = ?", 1).first();
const user2 = await userRepo.find().where("id = ?", 1).first(); // Hits cache

// Invalidate cache on updates
await userRepo.update(1, { name: "New Name" }); // Auto-invalidates cache`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Use Bulk Operations</h2>
            <p className="text-muted-foreground mb-4">Batch multiple operations into single queries:</p>
            <CodeBlock
              language="typescript"
              code={`// ❌ Bad: Multiple individual inserts
for (const userData of users) {
  await userRepo.create(userData);
}

// ✅ Good: Single bulk insert
await userRepo.bulkCreate(users);

// ✅ Good: Bulk update
await userRepo.bulkUpdate([
  { id: 1, name: "User 1" },
  { id: 2, name: "User 2" },
]);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Optimize Query Conditions</h2>
            <p className="text-muted-foreground mb-4">Write efficient WHERE clauses:</p>
            <CodeBlock
              language="typescript"
              code={`// ❌ Bad: Using LIKE with leading wildcard (can't use index)
const users = await userRepo.find().where("email LIKE ?", "%@stabilize.xyz").execute(dbClient);

// ✅ Good: Use exact matches or trailing wildcards
const users = await userRepo.find().where("email LIKE ?", "ciniso%@stabilzie.xyz").execute(dbClient);

// ❌ Bad: Using OR conditions (harder to optimize)
const users = await userRepo
  .find()
  .where("status = ?", "active")
  .orWhere("status = ?", "pending")
  .execute(dbClient);

// ✅ Good: Use IN clause
const users = await userRepo.find().where("status IN (?, ?)", "active", "pending").execute(dbClient);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Use Transactions Wisely</h2>
            <p className="text-muted-foreground mb-4">Group related operations in transactions, but keep them short:</p>
            <CodeBlock
              language="typescript"
              code={`// ✅ Good: Short, focused transaction
await dbClient.transaction(async (trx) => {
  const user = await userRepo.create({ email: "ciniso@stabilzie.xyz" }, trx);
  await profileRepo.create({ userId: user.id, bio: "..." }, trx);
});

// ❌ Bad: Long-running transaction with external API calls
await dbClient.transaction(async (trx) => {
  const user = await userRepo.create({ email: "ciniso@stabilzie.xyz" }, trx);
  await sendWelcomeEmail(user.email); // Don't do this in transaction!
  await profileRepo.create({ userId: user.id }, trx);
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Monitor Query Performance</h2>
            <p className="text-muted-foreground mb-4">Enable query logging to identify slow queries:</p>
            <CodeBlock
              language="typescript"
              code={`import { Stabilize, type LoggerConfig, LogLevel } from "stabilize-orm";

const loggerConfig: LoggerConfig = {
  level: LogLevel.Info,
  filePath: "logs/stabilize.log",
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 3,
};

export const orm = new Stabilize(dbConfig, cacheConfig, loggerConfig);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Use Query Scopes</h2>
            <p className="text-muted-foreground mb-4">Define reusable, optimized query patterns:</p>
            <CodeBlock
              language="typescript"
              code={`const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.Integer, required: true },
    email: { type: DataTypes.String, length: 100, required: true },
    isActive: { type: DataTypes.Boolean, required: true },
    createdAt: { type: DataTypes.DateTime },
    updatedAt: { type: DataTypes.DateTime },
  },
  scopes: {
    active: (qb) => qb.where("isActive = ?", true),
    recent: (qb, days: number) => qb.where("createdAt >= ?",
     new Date(Date.now() - days * 24 * 60 * 60 * 1000)),
  },
});

// Use scopes for consistent, optimized queries
const recentActiveUsers = await userRepo
  .scope("active")
  .scope("recent")
  .find()
  .execute(dbClient);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Performance Checklist</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                ✓ Use selective field loading with <code>select()</code>
              </li>
              <li>✓ Implement pagination for large datasets</li>
              <li>✓ Eager load relationships to avoid N+1 queries</li>
              <li>✓ Add indexes to frequently queried columns</li>
              <li>✓ Enable Redis caching for read-heavy workloads</li>
              <li>✓ Use bulk operations for multiple records</li>
              <li>✓ Optimize WHERE clauses and use IN instead of OR</li>
              <li>✓ Keep transactions short and focused</li>
              <li>✓ Monitor slow queries with logging</li>
              <li>✓ Define query scopes for common patterns</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}