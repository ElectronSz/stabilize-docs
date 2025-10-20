"use client"

import { CodeBlock } from "@/components/code-block"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CLIPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">CLI Reference</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Command-line tools for managing your Stabilize ORM project. <br />
          <span className="font-mono text-xs">See <a href="https://github.com/ElectronSz/stabilize-cli" className="underline">stabilize-cli</a> for full docs.</span>
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Installation</h2>
            <p className="text-muted-foreground mb-4">Install the Stabilize CLI globally:</p>
            <CodeBlock code="bun add -g stabilize-cli" language="bash" />
          </section>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>stabilize generate</CardTitle>
              <CardDescription>Generate models, migrations, or seeds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock code="stabilize-cli generate model User name:string age:int" language="bash" />
              <CodeBlock code="stabilize-cli generate migration user" language="bash" />
              <CodeBlock code="stabilize-cli generate seed user --count 10" language="bash" />
              <div className="text-sm">
                <p className="font-semibold mb-2">Model Options:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    <code>--table</code> - Specify custom table name
                  </li>
                  <li>
                    <code>--timestamps</code> - Add timestamp columns
                  </li>
                  <li>
                    <code>--soft-delete</code> - Enable soft deletes
                  </li>
                </ul>
                <p className="font-semibold mt-4 mb-2">Seed Options:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    <code>--count</code> - How many rows to generate
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>stabilize migrate</CardTitle>
              <CardDescription>Run pending migrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock code="stabilize-cli migrate" language="bash" />
              <CodeBlock code="stabilize-cli migrate:rollback" language="bash" />
              <p className="text-sm text-muted-foreground">Executes or rolls back migrations in order.</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>stabilize seed</CardTitle>
              <CardDescription>Run database seeders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock code="stabilize-cli seed" language="bash" />
              <CodeBlock code="stabilize-cli seed:rollback" language="bash" />
              <p className="text-sm text-muted-foreground">
                Executes all seed files to populate the database with data, or roll back the last applied seed.
              </p>
              <div className="text-sm">
                <p className="font-semibold mb-2">Options:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    <code>--class</code> - Run a specific seeder class
                  </li>
                  <li>
                    <code>--count</code> - Number of rows to generate in seeds
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>stabilize db:drop</CardTitle>
              <CardDescription>Drop all tables in the database (dangerous!)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock code="stabilize-cli db:drop" language="bash" />
              <p className="text-sm text-muted-foreground">
                Permanently deletes all tables in the database. <br /><span className="font-semibold">Use with caution!</span>
              </p>
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
              <CardTitle>stabilize db:reset</CardTitle>
              <CardDescription>Drop, migrate, and seed your database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock code="stabilize-cli db:reset" language="bash" />
              <p className="text-sm text-muted-foreground">
                Destroys and rebuilds your database: drops tables, applies migrations, and seeds data.
              </p>
              <div className="text-sm">
                <p className="font-semibold mb-2">Options:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    <code>--force</code> - Skip confirmation
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
              <CardTitle>stabilize status</CardTitle>
              <CardDescription>Show migration and seed status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock code="stabilize-cli status" language="bash" />
              <p className="text-sm text-muted-foreground">
                Shows which migrations and seeds have been applied.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}