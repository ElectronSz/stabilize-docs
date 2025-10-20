"use client"

import { CodeBlock } from "@/components/code-block"

export default function CachingPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Caching</h1>
          <p className="text-lg text-muted-foreground mb-8">Redis-backed caching for improved query performance</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Enable Caching</h2>
              <CodeBlock
                filename="enable-caching.ts"
                language="typescript"
                code={`import { Stabilize, DBType } from "stabilize-orm";

const orm = new Stabilize(
  {
    type: DBType.Postgres,
    connectionString: process.env.DATABASE_URL,
  },
  {
    enabled: true,
    ttl: 60, // Cache for 60 seconds
    redisUrl: process.env.REDIS_URL,
    cachePrefix: "myapp:",
    strategy: "cache-aside", // or "write-through"
  }
);`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cache Strategies</h2>
              <p className="text-muted-foreground mb-4">Stabilize supports two caching strategies:</p>
              <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
                <li>
                  <strong>cache-aside</strong> - Read from cache first, query database on miss
                </li>
                <li>
                  <strong>write-through</strong> - Update cache immediately after database writes
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cache Statistics</h2>
              <CodeBlock
                filename="cache-stats.ts"
                language="typescript"
                code={`const stats = await orm.cache.getStats();

console.log(\`Cache Hits: \${stats.hits}\`);
console.log(\`Cache Misses: \${stats.misses}\`);
console.log(\`Total Keys: \${stats.keys}\`);`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Manual Cache Control</h2>
              <CodeBlock
                filename="manual-cache.ts"
                language="typescript"
                code={`// Invalidate specific keys
await orm.cache.invalidate(['user:1', 'all_users']);

// Invalidate by pattern
await orm.cache.invalidatePattern('user:*');

// Set custom TTL
await orm.cache.set('user:1', userData, 3600); // 1 hour`}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}