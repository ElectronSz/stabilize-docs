"use client";

import { CodeBlock } from "@/components/code-block";

export default function CachingPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
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
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
            <p className="text-sm font-semibold mb-2">
              <code>redisUrl</code> is not optional in practice
            </p>
            <p className="text-sm text-muted-foreground">
              The type marks <code>redisUrl</code> optional, but there is no
              in-memory fallback. A <code>Cache</code> built with{" "}
              <code>enabled: true</code> and no <code>redisUrl</code> holds no
              Redis client at all, and every one of its methods becomes a silent
              no-op: <code>get</code> returns <code>null</code>, <code>set</code>{" "}
              discards the value, and <code>getStats</code> reports zeros
              forever. You get no error and no caching — only the appearance of
              it. Set <code>redisUrl</code> whenever <code>enabled</code> is{" "}
              <code>true</code>.
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
            <p className="text-sm font-semibold mb-2">
              Passing <code>existingClient</code> turns caching off
            </p>
            <p className="text-sm text-muted-foreground">
              When you construct <code>Stabilize</code> around a client you
              already own — <code>new Stabilize(config, cacheConfig, loggerConfig, existingClient)</code>{" "}
              — the cache handle is forced to <code>null</code> and{" "}
              <code>cacheConfig</code> is ignored entirely, <code>enabled</code>{" "}
              included. <code>getCacheStats()</code> then answers{" "}
              <code>{"{ hits: 0, misses: 0, keys: 0 }"}</code> however you
              configured it, and reads go straight to the database. This is not
              a bug you can work around with config: if you need caching, do not
              pass <code>existingClient</code>.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Cache Strategies</h2>
          <p className="text-muted-foreground mb-4">
            Stabilize supports two caching strategies:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
            <li>
              <strong>cache-aside</strong> — Read from cache first, fall back to
              the database on a miss. Nothing is written to the cache on save.
            </li>
            <li>
              <strong>write-through</strong> — The same reads, but every write
              also stores the row it just wrote, so the next{" "}
              <code>findOne</code> for that id is a hit.
            </li>
          </ul>
          <p className="text-muted-foreground mb-4">
            In both strategies a write invalidates the affected keys. The
            difference is only whether the write also <em>populates</em> the
            cache afterwards — cache-aside leaves it empty and lets the next read
            fill it. So the invalidation half of the description above is
            identical for the two; do not read &ldquo;cache-aside&rdquo; as
            meaning writes skip the cache entirely.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Where the Cache Is Used</h2>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
            <p className="text-sm font-semibold mb-2">
              Only <code>findOne()</code> reads from the cache
            </p>
            <p className="text-sm text-muted-foreground">
              <code>findOne()</code> is the single read path that consults Redis.
              A builder from <code>find()</code> — and everything built on it,{" "}
              <code>findBy</code>, <code>first</code>, <code>paginate</code>,{" "}
              <code>findAndCountAll</code>, a raw <code>QueryBuilder</code> —
              executes against the database every time, cache enabled or not.
              Caching the list queries would mean invalidating every filtered
              variant on any write, which the library does not attempt.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 pr-4 font-semibold">Operation</th>
                  <th className="text-left py-2 font-semibold">Cache behaviour</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>findOne(id)</code>
                  </td>
                  <td className="py-2">
                    reads, then populates on a miss — the only reader
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>find()</code>, <code>findBy()</code>,{" "}
                    <code>first()</code>, <code>paginate()</code>,{" "}
                    <code>findAndCountAll()</code>, <code>pluck()</code>
                  </td>
                  <td className="py-2">never reads, never populates</td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>create()</code>, <code>update()</code>,{" "}
                    <code>delete()</code>, <code>upsert()</code>,{" "}
                    <code>recover()</code>, <code>increment()</code>,{" "}
                    <code>decrement()</code>
                  </td>
                  <td className="py-2">
                    invalidates the row, then populates it if the strategy is
                    write-through
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>bulkCreate()</code>, <code>bulkUpdate()</code>,{" "}
                    <code>bulkDelete()</code>, <code>updateBy()</code>,{" "}
                    <code>deleteBy()</code>, <code>restoreBy()</code>,{" "}
                    <code>seed()</code>
                  </td>
                  <td className="py-2">invalidates the whole table</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    any of the above inside a{" "}
                    <code>transaction()</code>
                  </td>
                  <td className="py-2">
                    <strong>never cached</strong> — reads skip the cache
                    entirely, so a rollback cannot leave a cached copy behind
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Cache Keys</h2>
          <p className="text-muted-foreground mb-4">
            Keys are internal, but the shape explains what a write invalidates:
          </p>
          <CodeBlock
            filename="keys.txt"
            language="bash"
            code={`findOne:<table>:<id>                      # the row, as findOne caches it
findOne:<table>:<id>:<relations>          # the same row with relations loaded
                                          #   (relation paths sorted, comma-joined)

find:<table>                              # invalidated, but never read
find:<table>:*                            # invalidated, but never read`}
          />
          <p className="text-muted-foreground mt-4">
            A <code>findOne</code> called with <code>{"{ relations: [...] }"}</code>{" "}
            gets its own key, so the same row can be cached twice — once bare and
            once per distinct relation set. Invalidation accounts for this: a
            write to a row drops its bare key, every relation variant of it, and
            the table-wide patterns.
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4 text-muted-foreground">
            <li>
              A single-row write drops <code>find:&lt;table&gt;</code>, the
              pattern <code>find:&lt;table&gt;:*</code>, and the pattern{" "}
              <code>findOne:&lt;table&gt;:&lt;id&gt;:*</code>
            </li>
            <li>
              A bulk write drops <code>find:&lt;table&gt;</code> and the
              patterns <code>find:&lt;table&gt;:*</code> and{" "}
              <code>findOne:&lt;table&gt;:*</code> — every cached row in the
              table
            </li>
          </ul>
          <p className="text-muted-foreground mt-4">
            Pattern invalidation runs through Redis <code>KEYS</code>, which
            scans the whole keyspace. A bulk write on a busy database is
            therefore not cheap, and a large keyspace makes it slower still —
            another reason to keep <code>cachePrefix</code> tight to your
            application rather than sharing a Redis database.
          </p>
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
          <p className="text-muted-foreground mt-4">
            Read the hit ratio with care. Because only <code>findOne()</code>{" "}
            consults the cache, hits and misses count <code>findOne</code> calls
            alone — a service that lists rows through <code>find()</code> will
            report a near-zero ratio however well the cache is working. A miss is
            also only counted when Redis actually answers: if the connection is
            down, the failure is swallowed and the read falls through to the
            database without being recorded either way.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">When Redis Fails</h2>
          <p className="text-muted-foreground mb-4">
            Cache operations never throw. Every method on the cache catches its
            own errors, logs them through the ORM logger, and returns the
            &ldquo;nothing there&rdquo; answer: <code>get</code> returns{" "}
            <code>null</code>, <code>set</code> and <code>invalidate</code> do
            nothing, <code>getStats</code> reports zero keys.
          </p>
          <p className="text-muted-foreground mb-4">
            That is the right default — a Redis outage should degrade to database
            reads, not to 500s — but it means an unreachable cache is invisible
            from the application side. Watch the logger for Redis errors, or
            compare the hit ratio against query volume, rather than assuming a
            configured cache is a working one.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Configuration Options</h2>
          <CodeBlock
            filename="cache-config.ts"
            language="typescript"
            code={`interface CacheConfig {
  enabled: boolean;           // Enable/disable caching
  ttl: number;                // Time-to-live in seconds
  redisUrl?: string;          // Redis URL — required for the cache to do anything
  cachePrefix?: string;       // Key prefix for namespacing. Defaults to ""
  strategy?: "cache-aside" | "write-through";
}`}
          />
          <ul className="list-disc list-inside space-y-2 mt-4 text-muted-foreground">
            <li>
              <code>strategy</code> defaults to <code>&quot;cache-aside&quot;</code>{" "}
              when omitted, and an unrecognised value is treated the same way —
              anything that is not exactly{" "}
              <code>&quot;write-through&quot;</code> is read as cache-aside.
            </li>
            <li>
              <code>cachePrefix</code> defaults to the empty string, not to the
              application name, so without it your keys share a namespace with
              anything else in that Redis database.
            </li>
            <li>
              <code>ttl</code> applies to reads that populate the cache. Entries
              written by the write-through path use a fixed 60-second TTL
              regardless of what you set here.
            </li>
          </ul>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
            <p className="text-sm font-semibold mb-2">
              Cached rows are plaintext
            </p>
            <p className="text-sm text-muted-foreground">
              Decryption runs before a row reaches the cache, and caching
              happens after the row transform, so an encrypted column is stored
              decrypted in Redis. See{" "}
              <a className="underline" href="/docs/encryption">
                Column Encryption
              </a>{" "}
              — if a column is encrypted to protect it at rest, the cache has to
              be treated as sensitive too, or left off for that model.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
