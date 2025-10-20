"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Terminal } from "lucide-react"
import { CodeBlock } from "@/components/code-block"

export default function CliApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">CLI Commands</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Command-line interface reference for Stabilize CLI
        </p>

        <div className="space-y-8">
          {/* generate model/migration/seed */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">generate</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Generate a new model, migration, or seed file.
            </p>
            <CodeBlock code="bunx stabilize-cli generate <type> <name> [fields...]" language="bash" />
            <h3 className="font-semibold mb-2">Types:</h3>
            <ul className="space-y-2 mb-4">
              <li><Badge variant="outline" className="mr-2">model</Badge> <span className="text-muted-foreground">Generate a model file</span></li>
              <li><Badge variant="outline" className="mr-2">migration</Badge> <span className="text-muted-foreground">Generate a migration file for an existing model</span></li>
              <li><Badge variant="outline" className="mr-2">seed</Badge> <span className="text-muted-foreground">Generate a seed file for a model</span></li>
            </ul>
            <h3 className="font-semibold mb-2">Examples:</h3>
            <CodeBlock code="bunx stabilize-cli generate model User name:string age:int" language="bash" />
            <CodeBlock code="bunx stabilize-cli generate migration User" language="bash" />
            <CodeBlock code="bunx stabilize-cli generate seed User --count 10" language="bash" />
            <h3 className="font-semibold mb-2">Options:</h3>
            <ul className="space-y-2 mb-4">
              <li><Badge variant="outline" className="mr-2">--name</Badge> <span className="text-muted-foreground">Custom migration name</span></li>
              <li><Badge variant="outline" className="mr-2">--count</Badge> <span className="text-muted-foreground">How many seed rows to generate</span></li>
            </ul>
          </Card>

          {/* migrate + rollback */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">migrate</h2>
            </div>
            <p className="text-muted-foreground mb-4">Apply all pending database migrations.</p>
            <CodeBlock code="bunx stabilize-cli migrate" language="bash" />
            <CodeBlock code="bunx stabilize-cli migrate:rollback" language="bash" />
            <h3 className="font-semibold mb-2">Options:</h3>
            <ul className="space-y-2 mb-4">
              <li><Badge variant="outline" className="mr-2">--config</Badge> <span className="text-muted-foreground">Path to database config file</span></li>
            </ul>
          </Card>

          {/* seed + seed:rollback */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">seed</h2>
            </div>
            <p className="text-muted-foreground mb-4">Run all pending seed files.</p>
            <CodeBlock code="bunx stabilize-cli seed" language="bash" />
            <CodeBlock code="bunx stabilize-cli seed:rollback" language="bash" />
            <h3 className="font-semibold mb-2">Options:</h3>
            <ul className="space-y-2 mb-4">
              <li><Badge variant="outline" className="mr-2">--class</Badge> <span className="text-muted-foreground">Run a specific seeder class</span></li>
              <li><Badge variant="outline" className="mr-2">--config</Badge> <span className="text-muted-foreground">Path to database config file</span></li>
            </ul>
          </Card>

          {/* db:drop */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">db:drop</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Drop all tables in the database. <span className="font-semibold text-red-500">Use with caution!</span>
            </p>
            <CodeBlock code="bunx stabilize-cli db:drop" language="bash" />
            <h3 className="font-semibold mb-2">Options:</h3>
            <ul className="space-y-2 mb-4">
              <li><Badge variant="outline" className="mr-2">--force</Badge> <span className="text-muted-foreground">Skip confirmation prompt</span></li>
              <li><Badge variant="outline" className="mr-2">--config</Badge> <span className="text-muted-foreground">Path to database config file</span></li>
            </ul>
          </Card>

          {/* db:reset */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">db:reset</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Drop, migrate, and seed your database. Destroys and rebuilds your database.
            </p>
            <CodeBlock code="bunx stabilize-cli db:reset" language="bash" />
            <h3 className="font-semibold mb-2">Options:</h3>
            <ul className="space-y-2 mb-4">
              <li><Badge variant="outline" className="mr-2">--force</Badge> <span className="text-muted-foreground">Skip confirmation prompt for db:drop</span></li>
              <li><Badge variant="outline" className="mr-2">--config</Badge> <span className="text-muted-foreground">Path to database config file</span></li>
            </ul>
          </Card>

          {/* status */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">status</h2>
            </div>
            <p className="text-muted-foreground mb-4">Show the status of all migrations and seeds.</p>
            <CodeBlock code="bunx stabilize-cli status" language="bash" />
            <h3 className="font-semibold mb-2">Options:</h3>
            <ul className="space-y-2 mb-4">
              <li><Badge variant="outline" className="mr-2">--config</Badge> <span className="text-muted-foreground">Path to database config file</span></li>
            </ul>
          </Card>

          {/* generate seed */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">init</h2>
            </div>
            <p className="text-muted-foreground mb-4">Initialize Stabilize in your project.</p>
            <CodeBlock code="bunx stabilize-cli init" language="bash" />
            <p className="text-sm text-muted-foreground">
              Creates necessary directories (models, migrations, seeds) and a sample configuration file.
            </p>
          </Card>

          {/* --version */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">--version</h2>
            </div>
            <p className="text-muted-foreground mb-4">Display the CLI version.</p>
            <CodeBlock code="bunx stabilize-cli --version" language="bash" />
          </Card>

          {/* --help */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">--help</h2>
            </div>
            <p className="text-muted-foreground mb-4">Display help information.</p>
            <CodeBlock code="bunx stabilize-cli --help" language="bash" />
          </Card>
        </div>
      </div>
    </div>
  )
}