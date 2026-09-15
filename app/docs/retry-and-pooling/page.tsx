"use client"

import { CodeBlock } from "@/components/code-block"

export default function RetryAndPoolingPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-4">Retry & Pooling</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Ride out transient network failures, and see what the connection
            pool is doing. <br />
            Both are configured on <code className="text-accent">DBConfig</code>{" "}
            and read back from the ORM.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Retry Configuration</h2>
              <CodeBlock
                filename="db.ts"
                language="typescript"
                code={`import { Stabilize, DBType } from "stabilize-orm";

const orm = new Stabilize({
  type: DBType.Postgres,
  connectionString: process.env.DATABASE_URL!,
  retryAttempts: 3,   // default 3
  retryDelay: 1000,   // default 1000ms
  maxJitter: 100,     // default 100ms
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Which Statements Retry</h2>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
                <p className="text-sm font-semibold mb-2">
                  Reads retry. Writes do not.
                </p>
                <p className="text-sm text-muted-foreground">
                  Retry applies only to statements that begin with{" "}
                  <code>SELECT</code>, <code>PRAGMA</code>, <code>SHOW</code>,{" "}
                  <code>EXPLAIN</code> or <code>VALUES</code> (leading comments
                  and whitespace are stripped first). Every write runs exactly
                  once, always. This is deliberate: a write that failed{" "}
                  <em>after</em> committing on the server, but before the
                  response arrived, would be applied twice by a retry. Reads
                  have no such hazard.
                </p>
              </div>
              <CodeBlock
                filename="behaviour.ts"
                language="typescript"
                code={`// Retried on failure, up to retryAttempts
await repo.find().where("status = ?", "active").execute(db.client);
await db.rawQuery("SELECT * FROM users");
await db.rawQuery("PRAGMA table_info(users)");

// Never retried - one attempt only
await repo.create({ title: "Draft" });
await db.rawExec("UPDATE users SET active = ? WHERE id = ?", [true, 1]);

// To effectively disable retry, set it to 1
const noRetry = new Stabilize({
  type: DBType.Postgres,
  connectionString: url,
  retryAttempts: 1,
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Backoff</h2>
              <p className="text-muted-foreground mb-4">
                Delays double with each attempt, plus a random jitter so that
                many clients failing together do not all retry in lockstep:
              </p>
              <CodeBlock
                filename="backoff.ts"
                language="typescript"
                code={`delay = retryDelay * 2^(attempt - 1) + random(0 .. maxJitter)

// With retryDelay: 1000, maxJitter: 100
// attempt 1 -> ~1000ms + 0-100ms
// attempt 2 -> ~2000ms + 0-100ms
// attempt 3 -> ~4000ms + 0-100ms`}
              />
              <p className="text-muted-foreground mt-4">
                The multiplier is fixed at 2 and there is no option to change it
                — there is no <code className="text-accent">initialDelay</code>,{" "}
                <code className="text-accent">maxDelay</code> or per-error-code
                list. <code className="text-accent">maxJitter</code> is the only
                knob on the curve. Set{" "}
                <code className="text-accent">maxJitter: 0</code> in tests to make
                timing deterministic.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Health Checks</h2>
              <p className="text-muted-foreground mb-4">
                The ORM and a repository each expose their own{" "}
                <code className="text-accent">healthCheck()</code>, with
                different return shapes. The ORM one probes the connection and
                cache; the repository one counts rows in its table.
              </p>
              <CodeBlock
                filename="health.ts"
                language="typescript"
                code={`const health = await orm.healthCheck();
// {
//   status: "healthy" | "unhealthy",
//   database: "sqlite" | "postgres" | "mysql" | "mssql",
//   latencyMs: 0.42,
//   cacheStatus: "connected" | "connected (miss)" | "disabled" | "unknown"
// }

const userHealth = await userRepo.healthCheck();
// {
//   status: "healthy" | "unhealthy",
//   table: "users",
//   rows: 128,          // -1 if the count failed
//   latencyMs: 0.31
// }`}
              />
              <CodeBlock
                filename="route.ts"
                language="typescript"
                code={`app.get("/healthz", async (req, res) => {
  const health = await orm.healthCheck();
  res.status(health.status === "healthy" ? 200 : 503).json(health);
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Pool Statistics</h2>
              <p className="text-muted-foreground mb-4">
                <code className="text-accent">orm.poolStats()</code> reports{" "}
                <code className="text-accent">
                  {"{ active, idle, total }"}
                </code>
                . Only <strong>SQL Server</strong> returns real numbers. Every
                other dialect returns{" "}
                <code className="text-accent">-1</code> in all three fields:
              </p>
              <CodeBlock
                filename="pool.ts"
                language="typescript"
                code={`const { active, idle, total } = await orm.poolStats();

// SQL Server : { active: borrowed, idle: available, total: size }
// PostgreSQL : { active: -1, idle: -1, total: -1 }
// MySQL      : { active: -1, idle: -1, total: -1 }
// SQLite     : { active: -1, idle: -1, total: -1 }   <- no pool at all`}
              />
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">
                  The non-MSSQL branches never fire
                </p>
                <p className="text-sm text-muted-foreground">
                  This is narrower than it looks, and worth knowing before you
                  build a dashboard on it. <code>poolStats()</code> inspects its
                  own <code>DBClient</code> wrapper rather than the driver object
                  underneath, then checks a driver-pool shape —{" "}
                  <code>totalCount</code>, then <code>_allConnections</code>, then{" "}
                  <code>size</code> — against it. Only the SQL Server pool
                  presents <code>size</code>, and that last branch is additionally
                  gated on the dialect being <code>DBType.MSSQL</code>. Postgres
                  exposes <code>totalCount</code> on the pool, but not on the
                  wrapper, so the check misses it. Hence the sentinels.
                </p>
              </div>
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">
                  Pool size is not configurable here
                </p>
                <p className="text-sm text-muted-foreground">
                  Every pool is constructed from <code>connectionString</code>{" "}
                  alone. There is no <code>max</code>, <code>min</code>,{" "}
                  <code>idleTimeout</code> or <code>connectionLimit</code> field
                  on <code>DBConfig</code>. To size a pool, put it in the
                  connection string — e.g.{" "}
                  <code>?connection_limit=20</code> for PostgreSQL or{" "}
                  <code>?connectionLimit=20</code> for MySQL. Treat{" "}
                  <code>-1</code> as &quot;not available&quot;, not as a problem:
                  a check that asserts <code>total &gt; 0</code> fails on
                  everything except SQL Server.
                </p>
              </div>
            </section>
          </div>
    </div>
  )
}
