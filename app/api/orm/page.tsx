"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function StabilizeApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Stabilize Class</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Core <code>Stabilize</code> class for database connections and
            repository management
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Constructor</h2>
              <CodeBlock
                language="typescript"
                code={`new Stabilize(
  config: DBConfig,
  cacheConfig: CacheConfig = { enabled: false, ttl: 60 },
  loggerConfig: LoggerConfig = {},
  existingClient?: DBClient
)`}
              />
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    config
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Database configuration (required)
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    cacheConfig
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Cache configuration. Defaults to{" "}
                    <code>{`{ enabled: false, ttl: 60 }`}</code> — caching is off
                    unless you turn it on.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    loggerConfig
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Logger configuration. Defaults to <code>{`{}`}</code>.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    existingClient
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    An already-open <code>DBClient</code> to use instead of
                    opening a new connection. When one is supplied, the cache is
                    not created and no <code>connection:open</code> event is
                    emitted for it.
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/stabilize.ts"
                language="typescript"
                code={`import { Stabilize, DBType, LogLevel } from "stabilize-orm";

const orm = new Stabilize(
  {
    type: DBType.SQLite,
    connectionString: "./data/app.db",
    retryAttempts: 3,
    retryDelay: 1000,
  },
  {
    enabled: false,
    ttl: 60,
    strategy: "cache-aside",
  },
  {
    level: LogLevel.Info,
    filePath: "./logs/stabilize.log",
  }
);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">DBType</h2>
              <CodeBlock
                language="typescript"
                code={`export enum DBType {
  Postgres = "postgres",
  MySQL    = "mysql",
  SQLite   = "sqlite",
  MSSQL    = "mssql",
  MongoDB  = "mongodb",
}`}
              />
              <p className="text-muted-foreground mb-4">
                A <strong>string</strong> enum, not a numeric one, so the member
                value is the lowercase string on the right and it is what
                appears in DDL and in <code>healthCheck()</code> output.
              </p>
              <p className="text-muted-foreground mb-4">
                All four SQL dialects are supported targets. The driver behind{" "}
                <code>MSSQL</code> is SQL Server, reached through the{" "}
                <code>mssql</code> package; it is the newest of the four and the
                one whose dialect support differs most from the others &mdash;
                no <code>FOR UPDATE</code> clause, no{" "}
                <code>BEGIN</code>/<code>COMMIT</code> text, a server-side
                transaction object, and <code>INT IDENTITY(1,1)</code> rather
                than auto-increment syntax. <code>MongoDB</code> is a fifth
                target, and not a dialect. It is a document store, reached
                through the optional <code>mongodb</code> package, and its
                transactions need a replica set or sharded cluster.
              </p>
              <CodeBlock
                filename="example/db-type.ts"
                language="typescript"
                code={`// PostgreSQL
new Stabilize({ type: DBType.Postgres, connectionString: process.env.DATABASE_URL! });

// MySQL / MariaDB
new Stabilize({ type: DBType.MySQL, connectionString: process.env.MYSQL_URL! });

// SQLite
new Stabilize({ type: DBType.SQLite, connectionString: "./data/app.db" });

// SQL Server
new Stabilize({ type: DBType.MSSQL, connectionString: process.env.MSSQL_URL! });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">getRepository()</h2>
              <CodeBlock
                language="typescript"
                code={`getRepository<T>(model: new (...args: any[]) => T): Repository<T>`}
              />
              <p className="text-muted-foreground mb-4">
                Gets a repository for a model to perform CRUD operations.
                Memoised per model: repeated calls with the same class return
                the <em>same</em> <code>Repository</code> instance, so it is
                safe to call this on every request.
              </p>
              <CodeBlock
                language="typescript"
                code={`const userRepo = orm.getRepository(User);
const user = await userRepo.findOne(1);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">transaction()</h2>
              <CodeBlock
                language="typescript"
                code={`async transaction<T>(callback: (txClient: DBClient) => Promise<T>): Promise<T>`}
              />
              <p className="text-muted-foreground mb-4">
                Executes a callback within an atomic database transaction.
              </p>
              <CodeBlock
                language="typescript"
                code={`await orm.transaction(async (txClient) => {
  const user = await userRepo.create({ id: generateUUID(), name: "Alice" });
  const post = await postRepo.create({ id: generateUUID(), title: "Post", authorId: user.id });
});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">getCacheStats()</h2>
              <CodeBlock
                language="typescript"
                code={`async getCacheStats(): Promise<CacheStats>`}
              />
              <p className="text-muted-foreground mb-4">
                Returns cache hit/miss statistics.
              </p>
              <CodeBlock
                language="typescript"
                code={`const stats = await orm.getCacheStats();
console.log(\`Hits: \${stats.hits}, Misses: \${stats.misses}, Keys: \${stats.keys}\`);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">healthCheck()</h2>
              <CodeBlock
                language="typescript"
                code={`async healthCheck(): Promise<{ status: string; database: string; latencyMs: number; cacheStatus: string }>`}
              />
              <p className="text-muted-foreground mb-4">
                Checks database and cache connectivity with latency.
              </p>
              <CodeBlock
                language="typescript"
                code={`const health = await orm.healthCheck();
// { status: "healthy", database: "sqlite", latencyMs: 0.5, cacheStatus: "disabled" }`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Properties</h2>
              <CodeBlock
                language="typescript"
                code={`class Stabilize {
  // The underlying DBClient. Pass this to a repository method's trailing
  // \`client\` argument to run that call on a specific connection.
  public client: DBClient;

  // Process-wide event emitter. See the Events page.
  public events: StabilizeEmitter;
}`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Raw SQL</h2>
              <CodeBlock
                language="typescript"
                code={`async rawQuery<T = any>(query: string, params?: any[]): Promise<T[]>
async rawExec(query: string, params?: any[]): Promise<{ affectedRows: number }>`}
              />
              <p className="text-muted-foreground mb-4">
                Both default <code>params</code> to <code>[]</code>.{" "}
                <code>rawQuery</code> returns the rows; <code>rawExec</code>{" "}
                returns the driver&apos;s affected-row count.
              </p>
              <CodeBlock
                language="typescript"
                code={`const results = await orm.rawQuery("SELECT * FROM users WHERE age > ?", [18]);
const { affectedRows } = await orm.rawExec("UPDATE users SET active = 0 WHERE lastLogin < ?", [oneYearAgo]);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Schema Methods</h2>
              <CodeBlock
                language="typescript"
                code={`async migrate(config: DBConfig, migrations: Migration[]): Promise<void>
async autoMigrate(models: any | any[]): Promise<void>
async seed(seeds?: any[]): Promise<void>
async reset(models: any | any[]): Promise<void>`}
              />
              <p className="text-muted-foreground mb-4">
                Thin wrappers over the migration and seeding functions.{" "}
                <code>autoMigrate</code> creates missing tables, columns and
                indexes; <code>seed()</code> with no argument runs the seeds
                registered with <code>defineSeed()</code>; <code>reset()</code>{" "}
                drops each model&apos;s table and history table before
                re-running <code>autoMigrate</code>. These are{" "}
                <strong>destructive</strong> — see the Migrations guide.
              </p>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Pool Stats &amp; Shutdown
              </h2>
              <CodeBlock
                language="typescript"
                code={`async poolStats(): Promise<{ active: number; idle: number; total: number }>
async close(): Promise<void>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>poolStats()</code> reports the driver pool where the
                dialect exposes one (SQL Server) and falls back to{" "}
                <code>{`{ active: -1, idle: -1, total: -1 }`}</code> when it
                cannot — check for a negative <code>total</code> before
                displaying it. <code>close()</code> emits{" "}
                <code>connection:close</code>, closes the database connection
                and disconnects the cache; call it on shutdown.
              </p>
              <CodeBlock
                language="typescript"
                code={`const poolStats = await orm.poolStats();
await orm.close();`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
