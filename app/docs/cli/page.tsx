"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  Database,
  GitBranch,
  FileCode2,
  HardDrive,
  RotateCcw,
  BarChart3,
  Shield,
  Zap,
  RefreshCw,
  List,
  Search,
  CheckCircle,
  Layers,
  Code2,
  ChevronRight,
} from "lucide-react";

function TerminalBlock({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-border/60 bg-[#1a1a1a] shadow-2xl shadow-black/30 my-4">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#2a2a2a] border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        {title && (
          <span className="text-xs text-white/40 ml-3 font-mono">{title}</span>
        )}
      </div>
      <div className="p-5 font-mono text-[13px] leading-7 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

function Prompt({ cmd, output }: { cmd: string; output?: React.ReactNode }) {
  return (
    <div className="mb-1">
      <div className="flex items-start gap-2">
        <span className="text-[#28c840] select-none shrink-0">❯</span>
        <span className="text-white/90">{cmd}</span>
      </div>
      {output && <div className="ml-4 mt-1">{output}</div>}
    </div>
  );
}

function OutputLine({
  children,
  color = "text-white/50",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return <div className={color}>{children}</div>;
}

function OutputSuccess({ children }: { children: React.ReactNode }) {
  return <div className="text-[#28c840]">{children}</div>;
}

function OutputTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-2 overflow-x-auto">
      <table className="text-xs font-mono">
        <thead>
          <tr className="border-b border-white/10">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-3 py-1.5 text-white/40 font-normal"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-1.5 text-white/70">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CLIPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Terminal className="h-3.5 w-3.5 text-accent" />
            <span className="text-sm font-medium text-accent">CLI v2.2.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Stabilize CLI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            23 commands for models, migrations, backups, seeds, and diagnostics.
            Install globally or run with{" "}
            <code className="text-accent">bunx</code>.
          </p>
        </div>

        {/* Install */}
        <TerminalBlock title="install">
          <Prompt cmd="bun add -g stabilize-cli" />
          <OutputSuccess>bun add v1.3.0</OutputSuccess>
          <OutputLine>installed stabilize-cli@2.2.0</OutputLine>
        </TerminalBlock>

        {/* Generate Commands */}
        <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-2">
          <FileCode2 className="h-5 w-5 text-accent" />
          Generate
        </h2>

        <TerminalBlock title="generate:model">
          <Prompt cmd="stabilize-cli generate:model User name:string email:string age:int --versioned" />
          <OutputSuccess>✔ Model generated: models/User.ts</OutputSuccess>
        </TerminalBlock>

        <TerminalBlock title="generate:all">
          <Prompt cmd="stabilize-cli generate:all Product name:string price:decimal stock:int --count 10" />
          <OutputLine color="text-[#5b9bd5]">
            ℹ Generating model, migration, and seed for 'product'...
          </OutputLine>
          <OutputSuccess>✔ Model: models/product.ts</OutputSuccess>
          <OutputSuccess>
            ✔ Migration: migrations/20260402120000_create_product_table.json
          </OutputSuccess>
          <OutputSuccess>
            ✔ Seed: seeds/20260402120000_seed_product.ts
          </OutputSuccess>
        </TerminalBlock>

        <TerminalBlock title="generate:api">
          <Prompt cmd="stabilize-cli generate:api User --prefix /api" />
          <OutputSuccess>✔ API scaffold generated: api/User.ts</OutputSuccess>
          <OutputLine color="text-[#5b9bd5]">
            ℹ Routes: GET/POST /api/users, GET/PATCH/DELETE /api/users/:id
          </OutputLine>
        </TerminalBlock>

        {/* Migrate Commands */}
        <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-accent" />
          Migrate
        </h2>

        <TerminalBlock title="migrate">
          <Prompt cmd="stabilize-cli migrate" />
          <OutputLine>
            <span className="text-[#28c840]">⠋</span> Applying 3 migration(s)...
          </OutputLine>
          <OutputSuccess>✔ All 3 migration(s) applied.</OutputSuccess>
        </TerminalBlock>

        <TerminalBlock title="migrate:status">
          <Prompt cmd="stabilize-cli migrate:status" />
          <OutputLine color="text-white/90 font-semibold">
            Migration Status
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">Database:</span> sqlite
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">Total:</span> 3 migration(s)
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">Applied:</span> 2
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">Pending:</span> 1
          </OutputLine>
          <OutputLine color="text-white/20">
            {" "}
            ─────────────────────────────────
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">
              ✔
            </span> 20260401_create_users{" "}
            <span className="text-white/30">
              (applied: 2026-04-01T10:00:00Z)
            </span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">
              ✔
            </span> 20260402_create_posts{" "}
            <span className="text-white/30">
              (applied: 2026-04-02T09:30:00Z)
            </span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#e8c88a]">
              ○
            </span> 20260402_create_comments{" "}
            <span className="text-white/30">(pending)</span>
          </OutputLine>
        </TerminalBlock>

        <TerminalBlock title="migrate:fresh">
          <Prompt cmd="stabilize-cli migrate:fresh --force" />
          <OutputLine color="text-[#e8c88a]">
            ⚠ This will destroy all tables and re-run migrations.
          </OutputLine>
          <OutputSuccess>✔ Fresh migration complete.</OutputSuccess>
        </TerminalBlock>

        {/* Database Commands */}
        <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-accent" />
          Database
        </h2>

        <TerminalBlock title="db:tables">
          <Prompt cmd="stabilize-cli db:tables" />
          <OutputLine color="text-white/90 font-semibold">
            Tables (4)
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">●</span> comments{" "}
            <span className="text-white/30">(0 rows)</span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">●</span> posts{" "}
            <span className="text-white/30">(12 rows)</span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">●</span> users{" "}
            <span className="text-white/30">(3 rows)</span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">●</span> _history{" "}
            <span className="text-white/30">(8 rows)</span>
          </OutputLine>
        </TerminalBlock>

        <TerminalBlock title="db:size">
          <Prompt cmd="stabilize-cli db:size" />
          <OutputLine color="text-white/90 font-semibold">
            Database Size Report
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">File:</span> ./data/app.db
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">Size:</span> 0.24 MB (251,904 bytes)
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">●</span> comments{" "}
            <span className="text-white/30">(0 rows)</span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">●</span> posts{" "}
            <span className="text-white/30">(12 rows)</span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">●</span> users{" "}
            <span className="text-white/30">(3 rows)</span>
          </OutputLine>
          <OutputLine color="text-white/90 mt-1">
            {" "}
            <span className="text-white/90">Total:</span> 4 tables, 23 rows
          </OutputLine>
        </TerminalBlock>

        <TerminalBlock title="db:diff">
          <Prompt cmd="stabilize-cli db:diff" />
          <OutputLine color="text-white/90 font-semibold">
            Schema Diff
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#e8c88a]">+</span> comments{" "}
            <span className="text-white/30">(in comment.ts, not in DB)</span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">✔</span> posts{" "}
            <span className="text-white/30">(in sync)</span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">✔</span> users{" "}
            <span className="text-white/30">(in sync)</span>
          </OutputLine>
        </TerminalBlock>

        <TerminalBlock title="db:backup">
          <Prompt cmd="stabilize-cli db:backup --output ./backups" />
          <OutputLine>
            <span className="text-[#28c840]">⠋</span> Backing up SQLite
            database...
          </OutputLine>
          <OutputSuccess>
            ✔ SQLite backup saved: backups/backup_20260402120000.db
          </OutputSuccess>
        </TerminalBlock>

        <TerminalBlock title="db:console">
          <Prompt cmd="stabilize-cli db:console" />
          <OutputLine color="text-white/90 font-semibold">
            Stabilize SQL Console{" "}
            <span className="text-white/30 font-normal">
              (type 'exit' to quit, 'tables' to list)
            </span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">Database:</span> sqlite
          </OutputLine>
          <div className="mt-2">
            <div className="flex items-start gap-2">
              <span className="text-[#28c840] select-none">sql&gt;</span>
              <span className="text-white/90">
                SELECT * FROM users LIMIT 3;
              </span>
            </div>
            <OutputLine color="text-white/50 ml-4">
              <span className="text-[#28c840]">✔</span> 3 row(s) in 0.8ms
            </OutputLine>
            <OutputTable
              headers={["id", "name", "email", "isActive"]}
              rows={[
                ["a1b2c3", "Alice Johnson", "alice@example.com", "1"],
                ["d4e5f6", "Bob Smith", "bob@example.com", "1"],
                ["g7h8i9", "Carol White", "carol@example.com", "0"],
              ]}
            />
          </div>
        </TerminalBlock>

        {/* Model & Diagnostics */}
        <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-accent" />
          Diagnostics
        </h2>

        <TerminalBlock title="model:validate">
          <Prompt cmd="stabilize-cli model:validate" />
          <OutputLine color="text-white/90 font-semibold">
            Model Validation
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">✔ User</span>{" "}
            <span className="text-white/30">
              (models/user.ts, table: users)
            </span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#28c840]">✔ Post</span>{" "}
            <span className="text-white/30">
              (models/post.ts, table: posts)
            </span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#e8c88a]">⚠ Comment</span>{" "}
            <span className="text-white/30">(models/comment.ts)</span>
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-[#e8c88a]">
              Warning: No 'id' column (auto-increment PK)
            </span>
          </OutputLine>
          <OutputLine color="text-white/20">
            {" "}
            ─────────────────────────────────
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">Summary:</span> 3 models, 0 errors,
            1 warning
          </OutputLine>
        </TerminalBlock>

        <TerminalBlock title="health">
          <Prompt cmd="stabilize-cli health" />
          <OutputLine>
            <span className="text-[#28c840]">✔</span> Database: healthy
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">Type:</span> sqlite
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">Latency:</span> 0.42ms
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">Cache:</span> disabled
          </OutputLine>
        </TerminalBlock>

        <TerminalBlock title="info">
          <Prompt cmd="stabilize-cli info" />
          <div className="text-[#5b9bd5] font-bold mb-2">
            ╔════════════════════════════════════════════════════╗
            <br />
            ║&nbsp;&nbsp;Stabilize CLI{" "}
            <span className="text-[#28c840]">v2.2.0</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
            <br />
            ║&nbsp;&nbsp;
            <span className="text-white/40">Developed by ElectronSz</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
            <br />
            ╚════════════════════════════════════════════════════╝
          </div>
          <OutputLine>
            {" "}
            <span className="text-white/90">Runtime:</span> Bun 1.3.0
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">Platform:</span> darwin arm64
          </OutputLine>
          <OutputLine>
            {" "}
            <span className="text-white/90">Memory:</span> 42.3 MB
          </OutputLine>
        </TerminalBlock>

        {/* All Commands Reference */}
        <h2 className="text-2xl font-bold mt-12 mb-4">All Commands</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            ["generate:model", "Generate model file"],
            ["generate:migration", "Generate migration"],
            ["generate:seed", "Generate seed file"],
            ["generate:api", "Generate REST API"],
            ["generate:all", "Model + migration + seed"],
            ["migrate", "Run pending migrations"],
            ["migrate:rollback", "Roll back last migration"],
            ["migrate:fresh", "Drop and re-migrate"],
            ["migrate:status", "Detailed migration status"],
            ["seed", "Run seed files"],
            ["db:drop", "Drop all tables"],
            ["db:reset", "Full database reset"],
            ["db:backup", "Backup database"],
            ["db:restore", "Restore from backup"],
            ["db:tables", "List tables"],
            ["db:size", "Table size stats"],
            ["db:diff", "Schema diff"],
            ["db:console", "SQL REPL"],
            ["model:validate", "Validate models"],
            ["status", "Migration/seed status"],
            ["health", "Health check"],
            ["query", "Execute raw SQL"],
            ["info", "CLI information"],
          ].map(([cmd, desc]) => (
            <div
              key={cmd}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/30 border border-border/30"
            >
              <code className="text-xs font-mono text-accent shrink-0 w-36">
                {cmd}
              </code>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
