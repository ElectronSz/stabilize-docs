"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function LoggingApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Logging API</h1>
          <p className="text-lg text-muted-foreground mb-8">
            <code>LoggerConfig</code>, <code>LogLevel</code> and{" "}
            <code>StabilizeLogger</code>
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">LoggerConfig</h2>
              <CodeBlock
                language="typescript"
                code={`export interface LoggerConfig {
  level?: LogLevel;
  filePath?: string;
  maxFileSize?: number;
  maxFiles?: number;
}`}
              />
              <p className="text-muted-foreground mb-4">
                Passed as the third positional argument to the{" "}
                <code>Stabilize</code> constructor.
              </p>
              <CodeBlock
                language="typescript"
                code={`constructor(
  config: DBConfig,
  cacheConfig: CacheConfig = { enabled: false, ttl: 60 },
  loggerConfig: LoggerConfig = {},
  existingClient?: DBClient,
)`}
              />
              <h3 className="font-semibold mb-2">Options:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    level
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Maximum level to write. Defaults to{" "}
                    <code>LogLevel.Info</code>
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    filePath
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Log file path. Defaults to <code>null</code> &mdash; console
                    only
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    maxFileSize
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Rotate at this size. Defaults to{" "}
                    <code>1 * 1024 * 1024</code>
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    maxFiles
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Number of rotated files kept. Defaults to <code>3</code>
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/logger.ts"
                language="typescript"
                code={`import { Stabilize, DBType, LogLevel } from "stabilize-orm";

const orm = new Stabilize(
  { type: DBType.SQLite, connectionString: "./data/app.db" },
  { enabled: false, ttl: 60 },
  {
    level: LogLevel.Warn,
    filePath: "./logs/stabilize.log",
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 5,
  }
);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">LogLevel</h2>
              <CodeBlock
                language="typescript"
                code={`export enum LogLevel { Debug, Info, Warn, Error }   // 0, 1, 2, 3`}
              />
              <p className="text-muted-foreground mb-4">
                <code>level</code> is a <em>maximum</em>, not a minimum:
                filtering is{" "}
                <code>
                  shouldLog(messageLevel) &#123; return messageLevel &lt;=
                  this.level; &#125;
                </code>
                . A lower number is therefore more verbose.
              </p>
              <h3 className="font-semibold mb-2">What each setting writes:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    Debug (0)
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Debug, Info, Warn and Error
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    Info (1)
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Info, Warn and Error &mdash; the default
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    Warn (2)
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Warn and Error only
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    Error (3)
                  </Badge>{" "}
                  <span className="text-muted-foreground">Error only</span>
                </li>
              </ul>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
                <p className="text-sm font-semibold mb-2">
                  Lower number = more verbose.
                </p>
                <p className="text-sm text-muted-foreground">
                  Setting <code>LogLevel.Warn</code> writes Warn and Error only
                  &mdash; everything below is dropped. Setting{" "}
                  <code>LogLevel.Debug</code> writes everything.
                </p>
              </div>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                StabilizeLogger methods
              </h2>
              <CodeBlock
                language="typescript"
                code={`logQuery(query: string, params: any[], executionTime?: number): void
logError(error: Error): void
logMetrics(metrics: PoolMetrics): void
logInfo(message: string): void
logWarn(message: string): void
logDebug(message: string): void`}
              />
              <p className="text-muted-foreground mb-4">
                <code>PoolMetrics</code> is{" "}
                <code>
                  &#123; activeConnections; idleConnections; totalConnections
                  &#125;
                </code>
                .
              </p>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    logQuery
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    SQL text, bound parameters, and optional execution time
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    logError
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    An <code>Error</code> instance
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    logMetrics
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    A <code>PoolMetrics</code> snapshot
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    logInfo
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    A plain Info message
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    logWarn
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    A plain Warn message
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    logDebug
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    A plain Debug message
                  </span>
                </li>
              </ul>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
                <p className="text-sm font-semibold mb-2">
                  Writes are fire-and-forget.
                </p>
                <p className="text-sm text-muted-foreground">
                  These public methods call the private async{" "}
                  <code>log()</code> / <code>rotateLogFile()</code> without
                  awaiting them. A write still in flight when the process exits
                  is lost, so flush by keeping the process alive or by logging
                  early rather than relying on the final line before exit.
                </p>
              </div>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">File rotation</h2>
              <p className="text-muted-foreground mb-4">
                Rotation only applies when <code>filePath</code> is set. Once
                the current file reaches <code>maxFileSize</code>, it is renamed
                to <code>.1</code>, existing rotations shift up one number, and
                the oldest file (<code>.&#123;maxFiles&#125;</code>) is deleted.
              </p>
              <CodeBlock
                filename="logs"
                language="bash"
                code={`# With maxFiles: 3 and maxFileSize: 1MB
stabilize.log      # active file
stabilize.log.1    # most recent rotation
stabilize.log.2
stabilize.log.3    # deleted on the next rotation`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
