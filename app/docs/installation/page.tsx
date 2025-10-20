import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

export default function InstallationPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl prose prose-slate dark:prose-invert">
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
              <span>PostgreSQL, MySQL, or SQLite database</span>
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
          Stabilize ORM works with the native Bun database drivers. No additional installation needed for:
        </p>
        <div className="flex gap-2 mb-6">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">PostgreSQL</Badge>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">MySQL</Badge>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">SQLite</Badge>
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
    </div>
  )
}
