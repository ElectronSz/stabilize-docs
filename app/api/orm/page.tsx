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
  cacheConfig?: CacheConfig,
  loggerConfig?: LoggerConfig
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
                    Cache configuration (optional)
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    loggerConfig
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Logger configuration (optional)
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
              <h2 className="text-2xl font-semibold mb-4">getRepository()</h2>
              <CodeBlock
                language="typescript"
                code={`getRepository<T>(model: ModelClass): Repository<T>`}
              />
              <p className="text-muted-foreground mb-4">
                Gets a repository for a model to perform CRUD operations.
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
              <h2 className="text-2xl font-semibold mb-4">Other Methods</h2>
              <CodeBlock
                language="typescript"
                code={`// Execute raw SQL
const results = await orm.rawQuery("SELECT * FROM users WHERE age > ?", [18]);
const { affectedRows } = await orm.rawExec("UPDATE users SET active = 0 WHERE lastLogin < ?", [oneYearAgo]);

// Pool statistics
const poolStats = await orm.poolStats();

// Close connection (call on shutdown)
await orm.close();`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
