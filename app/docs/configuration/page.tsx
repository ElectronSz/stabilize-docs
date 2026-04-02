"use client";

import { CodeBlock } from "@/components/code-block";

export default function ConfigurationPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Configuration</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Configure Stabilize ORM for your database
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Database Configuration
            </h2>
            <p className="text-muted-foreground mb-4">
              Stabilize supports PostgreSQL, MySQL, and SQLite. Create a{" "}
              <code>DBConfig</code> object:
            </p>
            <CodeBlock
              filename="config/database.ts"
              language="typescript"
              code={`import { DBType, type DBConfig } from "stabilize-orm";

// PostgreSQL
const pgConfig: DBConfig = {
  type: DBType.Postgres,
  connectionString: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/mydb",
  retryAttempts: 3,
  retryDelay: 1000,
};

// MySQL
const mysqlConfig: DBConfig = {
  type: DBType.MySQL,
  connectionString: process.env.DATABASE_URL || "mysql://user:password@localhost:3306/mydb",
  retryAttempts: 3,
  retryDelay: 1000,
};

// SQLite (great for development and testing)
const sqliteConfig: DBConfig = {
  type: DBType.SQLite,
  connectionString: "./data/app.db",
  retryAttempts: 3,
  retryDelay: 1000,
};`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">ORM Initialization</h2>
            <p className="text-muted-foreground mb-4">
              Create a <code>Stabilize</code> instance with database, cache, and
              logger configuration:
            </p>
            <CodeBlock
              filename="db/index.ts"
              language="typescript"
              code={`import { Stabilize, type CacheConfig, type LoggerConfig, LogLevel } from "stabilize-orm";
import dbConfig from "../config/database";

const cacheConfig: CacheConfig = {
  enabled: false,                    // Enable for Redis-backed caching
  ttl: 60,                           // Cache TTL in seconds
  redisUrl: process.env.REDIS_URL,   // Redis connection URL (optional)
  cachePrefix: "myapp:",             // Key prefix for namespacing
  strategy: "cache-aside",           // "cache-aside" or "write-through"
};

const loggerConfig: LoggerConfig = {
  level: LogLevel.Info,              // Debug, Info, Warn, or Error
  filePath: "logs/stabilize.log",
  maxFileSize: 5 * 1024 * 1024,     // 5MB
  maxFiles: 3,
};

export const orm = new Stabilize(dbConfig, cacheConfig, loggerConfig);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Environment Variables
            </h2>
            <p className="text-muted-foreground mb-4">
              Store sensitive data in environment variables. Never commit
              credentials:
            </p>
            <CodeBlock
              filename=".env"
              language="dotenv"
              code={`DATABASE_URL=postgresql://user:password@localhost:5432/mydb
REDIS_URL=redis://localhost:6379
CACHE_ENABLED=false`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">DBConfig Options</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <code>type</code> - Database type: <code>DBType.Postgres</code>,{" "}
                <code>DBType.MySQL</code>, or <code>DBType.SQLite</code>
              </li>
              <li>
                <code>connectionString</code> - Connection string or file path
                (SQLite)
              </li>
              <li>
                <code>retryAttempts</code> - Number of retry attempts on query
                failure (default: 3)
              </li>
              <li>
                <code>retryDelay</code> - Base delay between retries in ms
                (default: 1000)
              </li>
              <li>
                <code>maxJitter</code> - Maximum random jitter added to retry
                delay (default: 100)
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
