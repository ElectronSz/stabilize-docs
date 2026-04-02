"use client";

import { CodeBlock } from "@/components/code-block";

export default function CachingExamplePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Caching & Performance</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Enable caching, choose strategies, and optimize query performance
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Enable Caching</h2>
            <p className="text-muted-foreground mb-4">
              Configure the caching layer with Redis or in-memory:
            </p>
            <CodeBlock
              filename="config/cache.ts"
              language="typescript"
              code={`import { Stabilize, DBType } from "stabilize-orm";

// Cache-aside strategy (default)
const orm = new Stabilize(
  { type: DBType.SQLite, connectionString: "./data/app.db" },
  {
    enabled: true,
    ttl: 120, // 2 minutes
    redisUrl: "redis://localhost:6379", // optional, falls back to in-memory
    cachePrefix: "myapp:", // key prefix for cache entries
    strategy: "cache-aside", // check cache first, fall back to DB
  }
);

// Write-through strategy
const orm2 = new Stabilize(
  { type: DBType.Postgres, connectionString: "postgresql://..." },
  {
    enabled: true,
    ttl: 300,
    strategy: "write-through", // write to cache on every DB write
  }
);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Cache-Aside vs Write-Through
            </h2>
            <CodeBlock
              filename="examples/cache-strategies.ts"
              language="typescript"
              code={`// Cache-aside: Reads check cache first, writes invalidate cache
// Best for: Read-heavy workloads with infrequent writes
const user = await userRepo.findOne(1);
// First call: DB hit, result cached
// Second call: Cache hit, no DB query

await userRepo.update(1, { name: "Updated" });
// Cache invalidated, next read goes to DB

// Write-through: Writes update both DB and cache
// Best for: Mixed read/write workloads
const orm = new Stabilize(config, { enabled: true, ttl: 60, strategy: "write-through" });`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cache Statistics</h2>
            <CodeBlock
              filename="examples/cache-stats.ts"
              language="typescript"
              code={`// Get cache statistics
const stats = await orm.getCacheStats();
console.log("Cache hits:", stats.hits);
console.log("Cache misses:", stats.misses);
console.log("Cache keys:", stats.keys);

// Cache hit ratio
const ratio = stats.hits / (stats.hits + stats.misses) * 100;
console.log("Cache hit ratio:", ratio.toFixed(1) + "%");`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Performance Tips</h2>
            <CodeBlock
              filename="examples/performance.ts"
              language="typescript"
              code={`// 1. Use select() to fetch only needed columns
const users = await userRepo.find()
  .select("id", "name", "email")
  .execute(orm.client);

// 2. Use pagination instead of fetching all records
const page = await userRepo.paginate(1, 50);

// 3. Use bulk operations for multiple inserts
await userRepo.bulkCreate(users, { batchSize: 500 });

// 4. Use indexes on frequently queried columns
// Add index in model definition:
// email: { type: DataTypes.STRING, index: "idx_email" }

// 5. Use pluck() for single-column fetches
const emails = await userRepo.pluck("email");

// 6. Use count() instead of fetching and counting
const count = await userRepo.count({ isActive: true });

// 7. Use exists() instead of count() for presence checks
const hasUsers = await userRepo.exists({ role: "admin" });

// 8. Connection pooling (built-in for Postgres/MySQL)
const poolStats = await orm.poolStats();
console.log("Pool:", poolStats);`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
