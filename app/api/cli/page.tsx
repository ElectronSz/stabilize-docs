"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  HardDrive,
  RotateCcw,
  FileCode2,
  BarChart3,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function CliApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">CLI Commands</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Command-line interface reference for Stabilize CLI v2.1.0
        </p>

        <div className="space-y-8">
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">generate</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Generate a new model, migration, seed, or API scaffold.
            </p>
            <CodeBlock
              code="bunx stabilize-cli generate <type> <name> [fields...]"
              language="bash"
            />
            <h3 className="font-semibold mb-2">Types:</h3>
            <ul className="space-y-2 mb-4">
              <li>
                <Badge variant="outline" className="mr-2">
                  model
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Generate a model file with columns
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  migration
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Generate a migration file from a model
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  seed
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Generate a seed file for a model
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  api
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Generate a REST API scaffold from a model
                </span>
              </li>
            </ul>
            <h3 className="font-semibold mb-2">Examples:</h3>
            <CodeBlock
              code="bunx stabilize-cli generate model User name:string age:int"
              language="bash"
            />
            <CodeBlock
              code="bunx stabilize-cli generate migration User"
              language="bash"
            />
            <CodeBlock
              code="bunx stabilize-cli generate seed User --count 10"
              language="bash"
            />
            <CodeBlock
              code="bunx stabilize-cli generate api User --prefix /api"
              language="bash"
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">migrate</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Apply, rollback, or fresh-start migrations.
            </p>
            <CodeBlock code="bunx stabilize-cli migrate" language="bash" />
            <CodeBlock
              code="bunx stabilize-cli migrate:rollback"
              language="bash"
            />
            <CodeBlock
              code="bunx stabilize-cli migrate:fresh --force"
              language="bash"
            />
            <p className="text-sm text-muted-foreground mt-2">
              <code>migrate:fresh</code> drops all tables and re-applies
              migrations (no seed).
            </p>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <HardDrive className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">db:backup</h2>
              <Badge variant="secondary">New</Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Backup the database to a timestamped file.
            </p>
            <CodeBlock code="bunx stabilize-cli db:backup" language="bash" />
            <CodeBlock
              code="bunx stabilize-cli db:backup --output ./my-backups"
              language="bash"
            />
            <h3 className="font-semibold mb-2">Options:</h3>
            <ul className="space-y-2 mb-4">
              <li>
                <Badge variant="outline" className="mr-2">
                  --output
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Backup output directory (default: backups/)
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  --config
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Path to database config file
                </span>
              </li>
            </ul>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <RotateCcw className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">db:restore</h2>
              <Badge variant="secondary">New</Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Restore the database from a backup file.
            </p>
            <CodeBlock
              code="bunx stabilize-cli db:restore <file>"
              language="bash"
            />
            <CodeBlock
              code="bunx stabilize-cli db:restore backups/backup_20250101120000.db --force"
              language="bash"
            />
            <h3 className="font-semibold mb-2">Options:</h3>
            <ul className="space-y-2 mb-4">
              <li>
                <Badge variant="outline" className="mr-2">
                  --force
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Skip confirmation prompt
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  --config
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Path to database config file
                </span>
              </li>
            </ul>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileCode2 className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">generate:api</h2>
              <Badge variant="secondary">New</Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Generate a REST API scaffold with full CRUD routes from a model.
            </p>
            <CodeBlock
              code="bunx stabilize-cli generate api <ModelName>"
              language="bash"
            />
            <CodeBlock
              code="bunx stabilize-cli g:api Product --prefix /v1"
              language="bash"
            />
            <h3 className="font-semibold mb-2">Options:</h3>
            <ul className="space-y-2 mb-4">
              <li>
                <Badge variant="outline" className="mr-2">
                  --prefix
                </Badge>{" "}
                <span className="text-muted-foreground">
                  API route prefix (default: /api)
                </span>
              </li>
            </ul>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">db:size</h2>
              <Badge variant="secondary">New</Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Show database and table size statistics.
            </p>
            <CodeBlock code="bunx stabilize-cli db:size" language="bash" />
            <p className="text-sm text-muted-foreground">
              Displays file size (SQLite), table names, row counts, and table
              sizes (Postgres/MySQL).
            </p>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">db:drop</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Drop all tables in the database.{" "}
              <span className="font-semibold text-red-500">
                Use with caution!
              </span>
            </p>
            <CodeBlock
              code="bunx stabilize-cli db:drop --force"
              language="bash"
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">db:reset</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Drop, migrate, and seed your database in one command.
            </p>
            <CodeBlock
              code="bunx stabilize-cli db:reset --force"
              language="bash"
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">status</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Show migration and seed status.
            </p>
            <CodeBlock code="bunx stabilize-cli status" language="bash" />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">health</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Check database and cache health.
            </p>
            <CodeBlock code="bunx stabilize-cli health" language="bash" />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">query</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Execute a raw SQL query and display results.
            </p>
            <CodeBlock
              code="bunx stabilize-cli query 'SELECT * FROM users LIMIT 5'"
              language="bash"
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">info</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Show CLI version, runtime, and environment information.
            </p>
            <CodeBlock code="bunx stabilize-cli info" language="bash" />
          </Card>
        </div>
      </div>
    </div>
  );
}
