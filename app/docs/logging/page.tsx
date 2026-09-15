"use client"

import { CodeBlock } from "@/components/code-block"

export default function LoggingPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-4">Logging</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Control what the ORM reports and where it goes. <br />
            Configuration is the third argument to the{" "}
            <code className="text-accent">Stabilize</code> constructor.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
              <CodeBlock
                filename="db.ts"
                language="typescript"
                code={`import { Stabilize, LogLevel } from "stabilize-orm";
import type { DBConfig, CacheConfig, LoggerConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.SQLite,
  connectionString: "./app.db",
};

const cacheConfig: CacheConfig = { enabled: false, ttl: 60 };

const loggerConfig: LoggerConfig = {
  level: LogLevel.Debug,
  filePath: "logs/stabilize.log",
  maxFileSize: 5 * 1024 * 1024,   // 5MB
  maxFiles: 3,
};

const orm = new Stabilize(dbConfig, cacheConfig, loggerConfig);`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Log Levels</h2>
              <p className="text-muted-foreground mb-4">
                Levels are ordered by severity, and the setting is a{" "}
                <strong>maximum</strong>: a message is written when its level is
                at or below the configured one. Set{" "}
                <code className="text-accent">Debug</code> to see everything,{" "}
                <code className="text-accent">Error</code> to see only failures.
              </p>
              <CodeBlock
                filename="levels.ts"
                language="typescript"
                code={`LogLevel.Debug   // 0 - everything, including every query
LogLevel.Info    // 1 - default: normal operation
LogLevel.Warn    // 2 - warnings and errors
LogLevel.Error   // 3 - failures only

// level: LogLevel.Warn  =>  Warn and Error are written, Debug and Info are not`}
              />
              <div className="rounded-xl border border-border/60 bg-card/40 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">Defaults</p>
                <CodeBlock
                  language="typescript"
                  code={`level        LogLevel.Info
filePath     null                 // console only
maxFileSize  1 * 1024 * 1024      // 1MB
maxFiles     3`}
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">File Output & Rotation</h2>
              <p className="text-muted-foreground mb-4">
                Logging goes to the console unless you set{" "}
                <code className="text-accent">filePath</code>. Once the file
                reaches <code className="text-accent">maxFileSize</code> it is
                rotated — the current file becomes{" "}
                <code className="text-accent">.1</code>, existing rotations shift
                up, and the oldest is deleted once there are{" "}
                <code className="text-accent">maxFiles</code> of them. With the
                defaults that is a hard ceiling of about 4MB on disk:
              </p>
              <CodeBlock
                filename="rotation.txt"
                language="bash"
                code={`logs/stabilize.log      <- current
logs/stabilize.log.1    <- previous
logs/stabilize.log.2    <- oldest kept
                        <- .3 deleted on next rotation`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">What Gets Logged</h2>
              <CodeBlock
                filename="methods.ts"
                language="typescript"
                code={`logQuery(query: string, params: any[], executionTime?: number): void
logError(error: Error): void
logMetrics(metrics: PoolMetrics): void
logInfo(message: string): void
logWarn(message: string): void
logDebug(message: string): void`}
              />
              <p className="text-muted-foreground mt-4">
                <code className="text-accent">PoolMetrics</code> is{" "}
                <code className="text-accent">
                  {"{ activeConnections, idleConnections, totalConnections }"}
                </code>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Writing to the File Is Not Awaited</h2>
              <p className="text-muted-foreground mb-4">
                The public log methods write asynchronously and return{" "}
                <code className="text-accent">void</code> immediately — a query
                is never delayed by a log write. The trade-off is that a write
                still in flight when the process exits is lost, so do not rely
                on the file containing the very last line before a crash:
              </p>
              <CodeBlock
                filename="exit.ts"
                language="typescript"
                code={`import { StabilizeLogger, LogLevel } from "stabilize-orm";

// Stabilize keeps its logger private, so it is not reachable as
// \`orm.logger\`. Build one with the same config to write through the
// same sink.
const logger = new StabilizeLogger({
  level: LogLevel.Info,
  filePath: "logs/stabilize.log",
});

logger.logInfo("shutting down");

// The write above may not have reached disk yet.
// Give it a moment before exiting if the line matters.
await new Promise((resolve) => setTimeout(resolve, 50));
process.exit(0);`}
              />
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">
                  Query logging is loud
                </p>
                <p className="text-sm text-muted-foreground">
                  <code>LogLevel.Debug</code> logs every statement. That is what
                  you want while diagnosing a slow endpoint, and a serious
                  throughput cost in production — the formatting alone can
                  dominate a fast query. Leave production at{" "}
                  <code>Info</code> or higher.
                </p>
              </div>
            </section>
          </div>
    </div>
  )
}
