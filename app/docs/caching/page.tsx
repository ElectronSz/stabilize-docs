"use client";

import { CodeBlock } from "@/components/code-block";

export default function CachingPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
      <h1 className="text-4xl font-bold mb-4">Caching</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Cache query results in Redis, or in process when there is no Redis to
        run
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Enable Caching</h2>
          <p className="text-muted-foreground mb-4">
            Pass a <code>CacheConfig</code> as the second argument to the{" "}
            <code>Stabilize</code> constructor. With a <code>redisUrl</code> the
            cache is shared between every instance of your application:
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
    redisUrl: process.env.REDIS_URL,  // Shared across instances
    cachePrefix: "myapp:",      // Prefix for all cache keys
    strategy: "cache-aside",    // or "write-through"
  }
);`}
          />
          <p className="text-muted-foreground mt-4">
            Leave <code>redisUrl</code> out and the cache runs in process
            instead, backed by{" "}
            <a href="#the-in-process-backend" className="text-accent underline">
              <code>StabilizeKV</code>
            </a>
            . <code>enabled: true</code> always produces a working cache either
            way — there is no configuration that turns caching on and then
            quietly does nothing:
          </p>
          <CodeBlock
            filename="local.ts"
            language="typescript"
            code={`// No Redis to run. maxEntries bounds the store; the least recently
// used entry is evicted when it is full.
const orm = new Stabilize(dbConfig, {
  enabled: true,
  ttl: 60,
  maxEntries: 5000,
});`}
          />
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
              <code>{`{ hits: 0, misses: 0, keys: 0, backend: "disabled" }`}</code>{" "}
              however you configured it, and reads go straight to the database.
              This is not a bug you can work around with config: if you need
              caching, do not pass <code>existingClient</code>.
            </p>
          </div>
        </section>

        <section id="the-in-process-backend">
          <h2 className="text-2xl font-semibold mb-4">The In-Process Backend</h2>
          <p className="text-muted-foreground mb-4">
            Without a <code>redisUrl</code> the cache is a{" "}
            <code>StabilizeKV</code> — an in-process key-value store with{" "}
            <code>get</code>/<code>put</code>/<code>delete</code>/
            <code>list</code>, <code>expiration</code> and{" "}
            <code>expirationTtl</code>, metadata and cursor pagination. Its API
            follows Cloudflare Workers KV, so code written against Workers KV
            works here unchanged. It is exported in its own right too, for an
            application that wants a KV store with TTL and cursors without
            running one:
          </p>
          <CodeBlock
            filename="kv.ts"
            language="typescript"
            code={`import { StabilizeKV } from "stabilize-orm";

const kv = new StabilizeKV({ maxEntries: 5000 });

await kv.put("session:42", JSON.stringify(user), { expirationTtl: 3600 });
const raw = await kv.get<string>("session:42", { type: "text" });

const { keys } = await kv.list({ prefix: "session:", limit: 100 });`}
          />
          <p className="text-muted-foreground mb-4 mt-4">
            Both backends implement one internal interface, every public{" "}
            <code>Cache</code> method is written once against it, and the
            in-process store holds the JSON text <code>Cache</code> produced
            rather than live objects. So swapping backends cannot change what a{" "}
            <code>get</code> returns, and a caller who mutates a returned object
            cannot reach into the cache and corrupt it.
          </p>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
            <p className="text-sm font-semibold mb-2">
              What it is not: shared, durable, or replicated
            </p>
            <p className="text-sm text-muted-foreground">
              The in-process store is private to one process. Two application
              servers caching the same key each hold their own copy, and
              invalidating on one leaves the other serving stale rows. Nothing is
              written to disk, so the cache dies with the process — a restart
              starts cold, which is correct for a cache and wrong for anything
              you were treating as storage. And there is no eviction policy
              beyond the LRU bound you set: when{" "}
              <code>maxEntries</code> is reached, the least recently used entry
              goes. That is the right trade for a single-server app, a test suite
              and local development, and the wrong one for a fleet. Pass{" "}
              <code>redisUrl</code> when the cache has to be shared.
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
              <code>findOne()</code> is the single read path that consults the
              cache. A builder from <code>find()</code> — and everything built on
              it, <code>findBy</code>, <code>first</code>, <code>paginate</code>,{" "}
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
            Pattern invalidation scans the whole keyspace — Redis{" "}
            <code>KEYS</code> on the shared backend, an equivalent glob walk in
            process. A bulk write on a busy database is therefore not cheap, and
            a large keyspace makes it slower still — another reason to keep{" "}
            <code>cachePrefix</code> tight to your application rather than
            sharing a Redis database.
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

console.log(\`Backend: \${stats.backend}\`);     // "redis" | "memory" | "disabled"
console.log(\`Cache Hits: \${stats.hits}\`);
console.log(\`Cache Misses: \${stats.misses}\`);
console.log(\`Total Keys: \${stats.keys}\`);

// Calculate hit ratio
const total = stats.hits + stats.misses;
const ratio = total > 0 ? (stats.hits / total * 100).toFixed(1) : "0";
console.log(\`Hit Ratio: \${ratio}%\`);`}
          />
          <p className="text-muted-foreground mt-4">
            <code>backend</code> is there so a cache that is doing nothing is
            distinguishable from one that is merely cold.{" "}
            <code>&quot;disabled&quot;</code> means <code>enabled</code> was
            false. <code>&quot;memory&quot;</code> means no{" "}
            <code>redisUrl</code> was configured and the cache is confined to this
            process — which is a fact about the deployment you want to see, not
            infer from a hit ratio. <code>&quot;redis&quot;</code> reports the{" "}
            <em>configuration</em>, not the connection: <code>ioredis</code>{" "}
            connects lazily and may fail to connect later.
          </p>
          <p className="text-muted-foreground mt-4">
            Read the hit ratio with care. Because only <code>findOne()</code>{" "}
            consults the cache, hits and misses count <code>findOne</code> calls
            alone — a service that lists rows through <code>find()</code> will
            report a near-zero ratio however well the cache is working. A miss is
            also only counted when the backend actually answers: if the
            connection is down, the failure is swallowed and the read falls
            through to the database without being recorded either way.
          </p>
          <p className="text-muted-foreground mt-4">
            <code>orm.healthCheck()</code> names the backend too, rather than
            reducing it to connected-or-not — an in-process cache has no
            connection to report:
          </p>
          <CodeBlock
            filename="health.ts"
            language="typescript"
            code={`await orm.healthCheck();
// { status: "healthy", database: "postgres", latencyMs: 1.2,
//   cacheStatus: "in-memory" }`}
          />
          <p className="text-muted-foreground mt-4">
            <code>cacheStatus</code> is <code>&quot;in-memory&quot;</code> for the
            in-process backend, <code>&quot;disabled&quot;</code> when caching is
            off, and <code>&quot;connected&quot;</code> or{" "}
            <code>&quot;connected (miss)&quot;</code> for Redis depending on
            whether the probe key was found. A round trip that throws surfaces as{" "}
            <code>&quot;unknown&quot;</code>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">When the Cache Fails</h2>
          <p className="text-muted-foreground mb-4">
            Cache operations never throw. Every method on the cache catches its
            own errors, logs them through the ORM logger, and returns the
            &ldquo;nothing there&rdquo; answer: <code>get</code> returns{" "}
            <code>null</code>, <code>set</code> and <code>invalidate</code> do
            nothing, <code>getStats</code> reports zero keys. A value in the store
            that cannot be parsed counts as a miss rather than an error, because a
            value that cannot be returned was not a hit.
          </p>
          <p className="text-muted-foreground mb-4">
            That is the right default — a backend outage should degrade to
            database reads, not to 500s — but it means an unreachable cache is
            invisible from the application side. Watch the logger, or compare the
            hit ratio against query volume, rather than assuming a configured
            cache is a working one.
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
  redisUrl?: string;          // Shared cache. Omit for the in-process one.
  cachePrefix?: string;       // Key prefix for namespacing. Defaults to ""
  maxEntries?: number;        // In-process LRU bound. Defaults to 1000.
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
              <code>maxEntries</code> applies only to the in-process backend, and
              defaults to 1000. It is ignored when <code>redisUrl</code> is set —
              Redis does its own eviction, and a second, invisible one on top
              would be worse than none.
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
              decrypted — in Redis, or in the process&apos;s own memory. See{" "}
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
