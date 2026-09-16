import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

export default function InstallationPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
      <h1 className="text-4xl font-bold mb-4">Installation</h1>
        <p className="text-lg text-muted-foreground mb-8">Get started with Stabilize ORM in your Bun project</p>

        <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <span>Bun 1.0 or higher installed</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <span>PostgreSQL, MySQL, SQLite, SQL Server, or MongoDB database</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <span>TypeScript project (recommended)</span>
            </li>
          </ul>
        </Card>

        <h2 className="text-2xl font-semibold mb-4">Install via Bun</h2>
        <div className="rounded-lg border border-accent/30 bg-secondary/50 p-4 mb-6">
          <code className="text-sm font-mono">bun add stabilize-orm</code>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Install the CLI</h2>
        <p className="mb-4">The Stabilize CLI provides powerful code generation and migration tools:</p>
        <div className="rounded-lg border border-accent/30 bg-secondary/50 p-4 mb-6">
          <code className="text-sm font-mono">bun add -d stabilize-cli</code>
        </div>

        <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Verify Installation</h2>
          <p className="mb-4">Check that everything is installed correctly:</p>
          <div className="rounded-lg border border-accent/30 bg-secondary/50 p-4 mb-4">
            <code className="text-sm font-mono">bunx stabilize-cli --version</code>
          </div>
          <p className="text-sm text-muted-foreground">You should see the version number of the CLI tool.</p>
        </Card>

        <h2 className="text-2xl font-semibold mb-4">Database Drivers</h2>
        <p className="mb-4">
          The drivers for the four SQL dialects are dependencies of <code>stabilize-orm</code>{" "}
          itself, so there is nothing extra to install for them:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">PostgreSQL</Badge>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">MySQL / MariaDB</Badge>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">SQLite</Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">SQL Server</Badge>
        </div>
        <ul className="space-y-2 mb-4 text-sm text-muted-foreground">
          <li>
            <code>pg</code> for PostgreSQL and <code>mysql2</code> for MySQL — bundled dependencies,
            not native Bun modules
          </li>
          <li>
            <code>bun:sqlite</code> for SQLite — the one driver that is built into the runtime
          </li>
          <li>
            <code>mssql</code> for SQL Server
          </li>
          <li>
            <code>ioredis</code> if you enable Redis-backed caching
          </li>
        </ul>
        <p className="mb-4 text-sm text-muted-foreground">
          MongoDB is the exception. Its driver is an <strong>optional</strong> dependency rather
          than a bundled one, so it is installed alongside the ORM — and a MongoDB client without
          it fails with <code>MONGO_DRIVER_MISSING</code> on the first statement, not at import
          time. See <a className="underline" href="/docs/mongodb">MongoDB</a> for what else the
          backend changes.
        </p>
        <div className="rounded-lg border border-accent/30 bg-secondary/50 p-4 mb-6">
          <code className="text-sm font-mono">bun add mongodb</code>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <p className="mb-4">Now that you have Stabilize installed, you can:</p>
        <ul className="space-y-2 mb-8">
          <li>Configure your database connection</li>
          <li>Define your first model</li>
          <li>Run migrations</li>
          <li>Start querying your data</li>
        </ul>
    </div>
  )
}
