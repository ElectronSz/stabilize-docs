"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"

export default function StabilizeApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Stabilize Class</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Core <code>Stabilize</code> class for database connections and repository management
          </p>

          <div className="space-y-8">
            {/* Constructor */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Constructor</h2>
              <CodeBlock
                code={`new Stabilize(
  config: DBConfig,
  cacheConfig?: CacheConfig,
  loggerConfig?: LoggerConfig
)`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">
                Creates a new <code>Stabilize</code> instance with database, cache, and logger configuration.
              </p>
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">config</Badge>
                  <span className="text-muted-foreground">Database configuration (required)</span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">cacheConfig</Badge>
                  <span className="text-muted-foreground">Cache configuration (optional)</span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">loggerConfig</Badge>
                  <span className="text-muted-foreground">Logger configuration (optional)</span>
                </li>
              </ul>
              <CodeBlock
                filename="example/stabilize-constructor.ts"
                language="typescript"
                code={`import { Stabilize, DBType, LogLevel } from "stabilize-orm";

const stabilize = new Stabilize(
  {
    type: DBType.Postgres,
    connectionString: process.env.NEON_DATABASE_URL,
    retryAttempts: 3,
    retryDelay: 1000,
    maxJitter: 100,
  },
  {
    enabled: true,
    ttl: 60,
    redisUrl: process.env.REDIS_URL,
    cachePrefix: "myapp:",
    strategy: "cache-aside",
  },
  {
    level: LogLevel.Info,
    filePath: "./logs/stabilize.log",
  }
);`}
              />
            </Card>

            {/* getRepository */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">getRepository()</h2>
              <CodeBlock
                code={`getRepository<T>(model: new (...args: any[]) => T): Repository<T>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">
                Gets a repository for a given model, used to perform CRUD operations.
              </p>
              <CodeBlock
                filename="example/get-repository.ts"
                language="typescript"
                code={`import { User } from "./models/User";

const userRepository = stabilize.getRepository(User);
const user = await userRepository.findOne(1);`}
              />
            </Card>

            {/* transaction */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">transaction()</h2>
              <CodeBlock
                code={`async transaction<T>(
  callback: (txClient: DBClient) => Promise<T>
): Promise<T>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">
                Executes a callback within a database transaction, ensuring all operations are atomic.
              </p>
              <CodeBlock
                filename="example/transaction.ts"
                language="typescript"
                code={`const userRepo = stabilize.getRepository(User);
const profileRepo = stabilize.getRepository(Profile);

await stabilize.transaction(async (txClient) => {
  const user = await userRepo.create(
    { name: "John Doe" },
    {},
    txClient
  );
  await profileRepo.create(
    { userId: user.id, bio: "Hello" },
    {},
    txClient
  );
});`}
              />
            </Card>

            {/* getCacheStats */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">getCacheStats()</h2>
              <CodeBlock
                code={`async getCacheStats(): Promise<CacheStats>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">
                Retrieves statistics from the cache, if it is enabled.
              </p>
              <CodeBlock
                filename="example/cache-stats.ts"
                language="typescript"
                code={`const stats = await stabilize.getCacheStats();
console.log(\`Hits: \${stats.hits}, Misses: \${stats.misses}\`);`}
              />
            </Card>

            {/* close */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">close()</h2>
              <CodeBlock
                code={`async close(): Promise<void>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">
                Closes the database connection and disconnects the cache client for a graceful shutdown.
              </p>
              <CodeBlock
                filename="example/close.ts"
                language="typescript"
                code={`await stabilize.close();
console.log("Connections closed.");`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}