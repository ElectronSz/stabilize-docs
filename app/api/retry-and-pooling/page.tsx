"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function RetryAndPoolingApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Retry &amp; Pooling</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Retry behaviour for read-only statements, pool statistics and health
            checks
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Retry configuration
              </h2>
              <CodeBlock
                language="typescript"
                code={`export interface DBConfig {
  type: DBType;
  connectionString: string;
  retryAttempts?: number;   // default 3
  retryDelay?: number;      // default 1000 (ms)
  maxJitter?: number;       // default 100 (ms)
}`}
              />
              <h3 className="font-semibold mb-2">Fields:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    retryAttempts
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Number of attempts for read-only statements. Default{" "}
                    <code>3</code>. Set to <code>1</code> to effectively disable
                    retry.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    retryDelay
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Base delay in milliseconds. Default <code>1000</code>.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    maxJitter
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Upper bound of the random jitter added to each backoff, in
                    milliseconds. Default <code>100</code>.
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/retry-config.ts"
                language="typescript"
                code={`const orm = new Stabilize({
  type: DBType.Postgres,
  connectionString: process.env.DATABASE_URL!,
  retryAttempts: 5,
  retryDelay: 500,
  maxJitter: 100,
});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Backoff formula</h2>
              <p className="text-muted-foreground mb-4">
                The delay before each attempt is exponential with a random
                jitter added:
              </p>
              <CodeBlock
                language="typescript"
                code={`retryDelay * Math.pow(2, attempt - 1) + getJitter()

// where
getJitter = () => Math.random() * this.maxJitter`}
              />
              <p className="text-muted-foreground">
                The multiplier is always <code>2</code> and is not
                configurable. There are no <code>initialDelay</code> or{" "}
                <code>maxDelay</code> options, and no configurable list of
                retryable error codes.
              </p>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Retry applies to reads only
              </h2>
              <CodeBlock
                language="typescript"
                code={`const attempts = isReadOnlyStatement(query) ? this.retryAttempts : 1;`}
              />
              <p className="text-muted-foreground mb-4">
                A statement is treated as read-only when, after leading
                whitespace and comments are stripped, it begins with one of
                these prefixes:
              </p>
              <CodeBlock
                language="typescript"
                code={`["SELECT", "PRAGMA", "SHOW", "EXPLAIN", "VALUES"]`}
              />
              <p className="text-muted-foreground">
                Every write statement runs exactly once, always — there is no
                retry of write statements.
              </p>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                No connection pool configuration
              </h2>
              <p className="text-muted-foreground mb-4">
                There is no pool configuration. There are no{" "}
                <code>max</code>, <code>min</code>, <code>idleTimeout</code> or{" "}
                <code>connectionLimit</code> fields. Every driver object is built
                from <code>connectionString</code> alone:
              </p>
              <CodeBlock
                language="typescript"
                code={`// MySQL
this.client = mysql.createPool(config.connectionString);

// Postgres
this.client = new Pool({ connectionString: config.connectionString! });

// SQL Server
this.client = new sql.ConnectionPool(config.connectionString);

// SQLite — a file handle, not a pool
this.client = new Database(config.connectionString, { create: true });`}
              />
              <p className="text-muted-foreground">
                The SQL Server pool is built but left unconnected:{" "}
                <code>connect()</code> is async and the constructor is not, so
                the pool is opened lazily on the first statement instead.
              </p>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">poolStats()</h2>
              <CodeBlock
                language="typescript"
                code={`async poolStats(): Promise<{ active: number; idle: number; total: number }>`}
              />
              <p className="text-muted-foreground mb-4">
                Returns pool counters. The shape is the same for every driver,
                but the values are produced differently:
              </p>
              <CodeBlock
                language="typescript"
                code={`// Postgres — active is hardcoded 0, not measured
{ active: 0, idle: 0, total: raw.totalCount }

// MySQL
{
  active: raw._allConnections.length,
  idle: raw._freeConnections?.length ?? 0,
  total: raw._allConnections.length,
}

// SQL Server — read through the DBClient wrapper one level down
{
  active: pool.borrowed ?? 0,
  idle: pool.available ?? 0,
  total: pool.size ?? 0,
}

// SQLite — no pool; sentinels meaning "not applicable", not an error
{ active: -1, idle: -1, total: -1 }`}
              />
              <CodeBlock
                filename="example/pool-stats.ts"
                language="typescript"
                code={`const stats = await orm.poolStats();
console.log(stats.active, stats.idle, stats.total);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                healthCheck() — Stabilize
              </h2>
              <CodeBlock
                language="typescript"
                code={`async healthCheck(): Promise<{ status: string; database: string; latencyMs: number; cacheStatus: string }>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>status</code> is <code>&quot;healthy&quot;</code> or{" "}
                <code>&quot;unhealthy&quot;</code>. <code>database</code> is the{" "}
                <code>DBType</code>. <code>cacheStatus</code> names the backend
                rather than reducing it to connected-or-not:{" "}
                <code>&quot;disabled&quot;</code> when{" "}
                <code>enabled</code> was false,{" "}
                <code>&quot;in-memory&quot;</code> when there is no{" "}
                <code>redisUrl</code> and the cache is confined to this process,{" "}
                <code>&quot;connected&quot;</code> or{" "}
                <code>&quot;connected (miss)&quot;</code> for a Redis client that
                did or did not find its probe key, and{" "}
                <code>&quot;unknown&quot;</code> when the check threw.
              </p>
              <CodeBlock
                filename="example/health-orm.ts"
                language="typescript"
                code={`const health = await orm.healthCheck();
// { status: "healthy", database: "sqlite", latencyMs: 0.5, cacheStatus: "disabled" }`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                healthCheck() — Repository
              </h2>
              <CodeBlock
                language="typescript"
                code={`async healthCheck(): Promise<{ status: string; table: string; rows: number; latencyMs: number }>`}
              />
              <p className="text-muted-foreground mb-4">
                The repository variant reports on a single table.{" "}
                <code>rows</code> is <code>-1</code> when the row count failed.
              </p>
              <CodeBlock
                filename="example/health-repo.ts"
                language="typescript"
                code={`const health = await userRepo.healthCheck();
// { status: "healthy", table: "users", rows: 128, latencyMs: 0.4 }`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
