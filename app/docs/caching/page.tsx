"use client";

import { CodeBlock } from "@/components/code-block";

export default function CachingPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Caching</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Redis-backed caching for improved query performance
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Enable Caching</h2>
              <p className="text-muted-foreground mb-4">
                Pass a <code>CacheConfig</code> as the second argument to the{" "}
                <code>Stabilize</code> constructor:
              </p>
              <CodeBlock
                filename="db.ts"
                language="typescript"
                code={`import { Stabilize, DBType } from "stabilize-orm";

const orm = new Stabilize(
  {
    type: DBType.Postgres,
    connectionString: process.env.DATABASE_URL,
  },
  {
    enabled: true,
    ttl: 60,                    // Cache TTL in seconds
    redisUrl: process.env.REDIS_URL,  // Redis connection URL
    cachePrefix: "myapp:",      // Prefix for all cache keys
    strategy: "cache-aside",    // or "write-through"
  }
);`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cache Strategies</h2>
              <p className="text-muted-foreground mb-4">
                Stabilize supports two caching strategies:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
                <li>
                  <strong>cache-aside</strong> - Read from cache first, fall
                  back to database on miss. Cache is invalidated on write
                  operations.
                </li>
                <li>
                  <strong>write-through</strong> - Update cache immediately
                  after every database write, ensuring cache is always fresh.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cache Statistics</h2>
              <p className="text-muted-foreground mb-4">
                Use <code>orm.getCacheStats()</code> to get cache hit/miss
                statistics:
              </p>
              <CodeBlock
                filename="cache-stats.ts"
                language="typescript"
                code={`const stats = await orm.getCacheStats();

console.log(\`Cache Hits: \${stats.hits}\`);
console.log(\`Cache Misses: \${stats.misses}\`);
console.log(\`Total Keys: \${stats.keys}\`);

// Calculate hit ratio
const total = stats.hits + stats.misses;
const ratio = total > 0 ? (stats.hits / total * 100).toFixed(1) : "0";
console.log(\`Hit Ratio: \${ratio}%\`);`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How Caching Works</h2>
              <p className="text-muted-foreground mb-4">
                The caching layer is managed internally by repositories. When
                caching is enabled:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>Read operations</strong> (<code>findOne</code>,{" "}
                  <code>find</code>) check the cache first
                </li>
                <li>
                  <strong>Write operations</strong> (<code>create</code>,{" "}
                  <code>update</code>, <code>delete</code>) invalidate related
                  cache keys
                </li>
                <li>
                  <strong>Bulk operations</strong> invalidate by pattern (e.g.,{" "}
                  <code>find:users:*</code>)
                </li>
                <li>
                  Cache keys follow the pattern:{" "}
                  <code>findOne:&#123;table&#125;:&#123;id&#125;</code>
                  or <code>find:&#123;table&#125;</code>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Configuration Options
              </h2>
              <CodeBlock
                filename="cache-config.ts"
                language="typescript"
                code={`interface CacheConfig {
  enabled: boolean;           // Enable/disable caching
  ttl: number;                // Time-to-live in seconds
  redisUrl?: string;          // Redis URL (optional, falls back to in-memory)
  cachePrefix?: string;       // Key prefix for namespacing
  strategy?: "cache-aside" | "write-through";
}`}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
