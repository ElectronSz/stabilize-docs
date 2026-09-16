"use client";

import { CodeBlock } from "@/components/code-block";

export default function ConfigurationPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
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
              Stabilize supports PostgreSQL, MySQL, MariaDB, SQLite, and SQL
              Server, plus a MongoDB document backend. Create a{" "}
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

// MySQL / MariaDB
const mysqlConfig: DBConfig = {
  type: DBType.MySQL,
  connectionString: process.env.DATABASE_URL || "mysql://user:password@localhost:3306/mydb",
  retryAttempts: 3,
  retryDelay: 1000,
};

// SQL Server
const mssqlConfig: DBConfig = {
  type: DBType.MSSQL,
  connectionString:
    "Server=localhost,1433;Database=mydb;User Id=sa;Password=Your_password123;TrustServerCertificate=true",
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
            <p className="text-muted-foreground mt-4">
              <code>DBType</code> is a string enum, so the literal works wherever
              the enum does — <code>type: &quot;postgres&quot;</code> is the same
              as <code>type: DBType.Postgres</code>. Only <code>type</code> and{" "}
              <code>connectionString</code> are required; the retry fields all
              have defaults.
            </p>
            <p className="text-muted-foreground mt-4">
              The SQL Server pool is opened on the first query rather than in the
              constructor, because <code>mssql</code>&apos;s{" "}
              <code>ConnectionPool.connect()</code> is asynchronous and the
              constructor is not. See{" "}
              <a href="/docs/mssql" className="text-accent underline">
                SQL Server
              </a>{" "}
              for what else the dialect changes.
            </p>
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
  enabled: false,                    // Turn caching on
  ttl: 60,                           // Cache TTL in seconds
  redisUrl: process.env.REDIS_URL,   // Omit to cache in process instead
  cachePrefix: "myapp:",             // Key prefix for namespacing
  strategy: "cache-aside",           // "cache-aside" or "write-through"
  maxEntries: 1000,                  // In-process bound; ignored with redisUrl
};

const loggerConfig: LoggerConfig = {
  level: LogLevel.Info,              // Debug, Info, Warn, or Error
  filePath: "logs/stabilize.log",    // omit to log to the console only
  maxFileSize: 5 * 1024 * 1024,      // 5MB (default 1MB)
  maxFiles: 3,                       // default 3
};

export const orm = new Stabilize(dbConfig, cacheConfig, loggerConfig);`}
            />
            <p className="text-muted-foreground mt-4">
              All three arguments after <code>config</code> are optional. The
              default <code>cacheConfig</code> is{" "}
              <code>{`{ enabled: false, ttl: 60 }`}</code>, so caching is off
              unless you turn it on.
            </p>
            <p className="text-muted-foreground mt-4">
              <code>redisUrl</code> chooses the backend rather than enabling one:{" "}
              with it, entries are cached in Redis and shared by every process
              pointing at the same server. Without it they are cached in the
              process itself, which needs no server to run but is not shared
              between processes and is lost on restart — see{" "}
              <a href="/docs/caching" className="text-accent underline">
                Caching
              </a>
              . Either way, turning caching on now always caches something.
            </p>
            <p className="text-muted-foreground mt-4">
              <code>LogLevel</code> is a numeric enum, not a string one —{" "}
              <code>Debug = 0</code>, <code>Info = 1</code>,{" "}
              <code>Warn = 2</code>, <code>Error = 3</code>. A message is logged
              when its level is <em>less than or equal to</em> the configured
              level, so <code>LogLevel.Info</code> keeps info, warn and error and
              drops debug.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Sharing an Existing Client
            </h2>
            <p className="text-muted-foreground mb-4">
              A fourth argument accepts a <code>DBClient</code> you built
              yourself, and the ORM uses it instead of opening its own:
            </p>
            <CodeBlock
              filename="db/shared.ts"
              language="typescript"
              code={`import { Stabilize, DBClient } from "stabilize-orm";
import dbConfig from "../config/database";

// One pool for the whole process, shared by several Stabilize instances.
const client = new DBClient(dbConfig);

export const orm = new Stabilize(dbConfig, { enabled: false, ttl: 60 }, {}, client);
export const reporting = new Stabilize(dbConfig, { enabled: false, ttl: 60 }, {}, client);`}
            />
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">
                Passing a client disables caching
              </p>
              <p className="text-sm text-muted-foreground">
                When <code>existingClient</code> is supplied, the{" "}
                <code>cacheConfig</code> argument is ignored entirely and the
                cache is set to <code>null</code> — even if{" "}
                <code>enabled: true</code>. Sharing a connection pool across
                instances would otherwise mean sharing a cache namespace with no
                way to invalidate one instance&apos;s writes without flushing the
                other&apos;s. If you need caching, let the ORM own its client.
              </p>
            </div>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">
                close() closes the shared client
              </p>
              <p className="text-sm text-muted-foreground">
                <code>orm.close()</code> calls <code>close()</code> on whatever
                client it holds, including one you passed in. Nothing counts how
                many instances are using it, so in the example above{" "}
                <code>orm.close()</code> shuts the pool down for{" "}
                <code>reporting</code> as well. Close the shared client exactly
                once, at process shutdown, rather than closing each instance.
              </p>
            </div>
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
            <p className="text-muted-foreground mt-4">
              Three variables are read by the ORM itself rather than by your
              config: <code>ORM_ENCRYPTION_KEY</code> supplies the key for{" "}
              <a href="/docs/encryption" className="text-accent underline">
                column encryption
              </a>
              , <code>ORM_ENCRYPTION_KEY_FILE</code> names the file to read that
              key from instead (default <code>.stabilize/encryption.key</code>),
              and <code>ORM_ENCRYPTION_KEYS_OLD</code> lists retired keys that
              still decrypt. If no key is configured at all, one is generated
              into the key file on first use and a warning is emitted — so keep
              that file out of version control rather than committing it by
              accident.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">DBConfig Options</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <code>type</code> - Database type: <code>DBType.Postgres</code>,{" "}
                <code>DBType.MySQL</code>, <code>DBType.SQLite</code>,{" "}
                <code>DBType.MSSQL</code>, or <code>DBType.MongoDB</code>. The
                underlying string values are{" "}
                <code>&quot;postgres&quot;</code>,{" "}
                <code>&quot;mysql&quot;</code>, <code>&quot;sqlite&quot;</code>,{" "}
                <code>&quot;mssql&quot;</code> and{" "}
                <code>&quot;mongodb&quot;</code>. The first four are SQL dialects;
                see{" "}
                <a href="/docs/mongodb" className="text-accent underline">
                  MongoDB
                </a>{" "}
                for where the document backend differs.
              </li>
              <li>
                <code>connectionString</code> - Connection string, or a file path
                for SQLite
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
                delay in ms (default: 100)
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Retries apply to <strong>read-only statements only</strong> — a
              statement whose text begins with <code>SELECT</code>,{" "}
              <code>PRAGMA</code>, <code>SHOW</code>, <code>EXPLAIN</code> or{" "}
              <code>VALUES</code>. A failed <code>INSERT</code> or{" "}
              <code>UPDATE</code> is reported immediately: it may already have
              been applied, so replaying it is not safe in general. See{" "}
              <a href="/docs/retry-and-pooling" className="text-accent underline">
                Retry and Pooling
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">LoggerConfig Options</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <code>level</code> - <code>LogLevel.Debug</code>,{" "}
                <code>LogLevel.Info</code>, <code>LogLevel.Warn</code> or{" "}
                <code>LogLevel.Error</code> (default: <code>Info</code>)
              </li>
              <li>
                <code>filePath</code> - Where to write the log file. When it is
                omitted there is <strong>no file logging at all</strong>; messages
                go to the console.
              </li>
              <li>
                <code>maxFileSize</code> - Size in bytes at which the file is
                rotated (default: 1MB, i.e. <code>1 * 1024 * 1024</code>)
              </li>
              <li>
                <code>maxFiles</code> - How many rotated files to keep
                (default: 3)
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Rotation is size-triggered, not time-triggered: the file is checked
              before each write and rolled over once it exceeds{" "}
              <code>maxFileSize</code>. The oldest file is deleted, so total disk
              use is bounded by roughly{" "}
              <code>maxFileSize * (maxFiles + 1)</code>.
            </p>
          </section>
        </div>
    </div>
  );
}
