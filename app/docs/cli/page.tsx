"use client";

import { CodeBlock } from "@/components/code-block";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  HardDrive,
  FileCode2,
  RotateCcw,
  BarChart3,
} from "lucide-react";

export default function CLIPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">CLI Reference</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Command-line tools for managing your Stabilize ORM project. <br />
          <span className="font-mono text-xs">
            See{" "}
            <a
              href="https://github.com/ElectronSz/stabilize-cli"
              className="underline"
            >
              stabilize-cli
            </a>{" "}
            for full docs.
          </span>
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Installation</h2>
            <p className="text-muted-foreground mb-4">
              Install the Stabilize CLI globally:
            </p>
            <CodeBlock code="bun add -g stabilize-cli" language="bash" />
          </section>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-accent" />
                stabilize generate
              </CardTitle>
              <CardDescription>
                Generate models, migrations, seeds, or API routes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock
                code="stabilize-cli generate model User name:string age:int"
                language="bash"
              />
              <CodeBlock
                code="stabilize-cli generate migration user"
                language="bash"
              />
              <CodeBlock
                code="stabilize-cli generate seed user --count 10"
                language="bash"
              />
              <CodeBlock
                code="stabilize-cli generate api User"
                language="bash"
              />
              <div className="text-sm">
                <p className="font-semibold mb-2">Model Options:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    <code>--no-timestamps</code> - Disable createdAt/updatedAt
                  </li>
                  <li>
                    <code>--no-soft-delete</code> - Disable soft delete
                  </li>
                  <li>
                    <code>--versioned</code> - Enable version history
                  </li>
                </ul>
                <p className="font-semibold mt-4 mb-2">Seed Options:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    <code>--count</code> - How many rows to generate
                  </li>
                </ul>
                <p className="font-semibold mt-4 mb-2">API Options:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    <code>--prefix</code> - API route prefix (default: /api)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-accent" />
                stabilize migrate
              </CardTitle>
              <CardDescription>
                Run, rollback, or fresh-start migrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock code="stabilize-cli migrate" language="bash" />
              <CodeBlock
                code="stabilize-cli migrate:rollback"
                language="bash"
              />
              <CodeBlock
                code="stabilize-cli migrate:fresh --force"
                language="bash"
              />
              <p className="text-sm text-muted-foreground">
                <code>migrate:fresh</code> drops all tables and re-runs
                migrations without seeding.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-accent" />
                stabilize seed
              </CardTitle>
              <CardDescription>Run database seeders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock code="stabilize-cli seed" language="bash" />
              <p className="text-sm text-muted-foreground">
                Executes all pending seed files to populate the database with
                data.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-accent" />
                stabilize db:backup
                <Badge variant="secondary" className="ml-2">
                  New
                </Badge>
              </CardTitle>
              <CardDescription>
                Backup the database to a timestamped file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock code="stabilize-cli db:backup" language="bash" />
              <CodeBlock
                code="stabilize-cli db:backup --output ./my-backups"
                language="bash"
              />
              <p className="text-sm text-muted-foreground">
                Creates a timestamped backup file. SQLite databases are copied
                directly; other databases export to JSON format.
              </p>
              <div className="text-sm">
                <p className="font-semibold mb-2">Options:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    <code>--output</code> - Backup directory (default: backups/)
                  </li>
                  <li>
                    <code>--config</code> - Path to db config file
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-accent" />
                stabilize db:restore
                <Badge variant="secondary" className="ml-2">
                  New
                </Badge>
              </CardTitle>
              <CardDescription>
                Restore the database from a backup file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock
                code="stabilize-cli db:restore backups/backup_20250101120000.db"
                language="bash"
              />
              <CodeBlock
                code="stabilize-cli db:restore backups/backup.json --force"
                language="bash"
              />
              <div className="text-sm">
                <p className="font-semibold mb-2">Options:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    <code>--force</code> - Skip confirmation prompt
                  </li>
                  <li>
                    <code>--config</code> - Path to db config file
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode2 className="h-5 w-5 text-accent" />
                stabilize generate:api
                <Badge variant="secondary" className="ml-2">
                  New
                </Badge>
              </CardTitle>
              <CardDescription>
                Generate a REST API scaffold from a model
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock
                code="stabilize-cli generate api User"
                language="bash"
              />
              <CodeBlock
                code="stabilize-cli g:api Product --prefix /v1"
                language="bash"
              />
              <p className="text-sm text-muted-foreground">
                Generates a complete CRUD API file with list, getOne, create,
                update, and remove routes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                stabilize db:size
                <Badge variant="secondary" className="ml-2">
                  New
                </Badge>
              </CardTitle>
              <CardDescription>
                Show database and table size statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock code="stabilize-cli db:size" language="bash" />
              <p className="text-sm text-muted-foreground">
                Displays file size (SQLite), table names, row counts, and
                optionally table sizes for PostgreSQL/MySQL.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-accent" />
                Other Commands
              </CardTitle>
              <CardDescription>
                Database management and diagnostics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock code="stabilize-cli db:drop --force" language="bash" />
              <CodeBlock
                code="stabilize-cli db:reset --force"
                language="bash"
              />
              <CodeBlock code="stabilize-cli db:tables" language="bash" />
              <CodeBlock code="stabilize-cli status" language="bash" />
              <CodeBlock code="stabilize-cli health" language="bash" />
              <CodeBlock
                code="stabilize-cli query 'SELECT * FROM users LIMIT 5'"
                language="bash"
              />
              <CodeBlock code="stabilize-cli info" language="bash" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
