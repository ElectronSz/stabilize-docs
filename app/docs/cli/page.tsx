"use client";

import {
  Terminal,
  Database,
  GitBranch,
  FileCode2,
  Search,
  Layers,
  Code2,
  Settings,
  Zap,
  ShieldAlert,
  type LucideIcon,
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

function Prompt({ cmd }: { cmd: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[#28c840] select-none shrink-0">❯</span>
      <span className="text-white/90">{cmd}</span>
    </div>
  );
}

function Out({
  children,
  color = "text-white/50",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return <div className={color}>{children}</div>;
}

function Cmd({
  name,
  alias,
  desc,
  flags,
  example,
}: {
  name: string;
  alias?: string;
  desc: string;
  flags?: string[];
  example: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/40 p-5 mb-3">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <code className="text-sm font-mono font-semibold text-accent">
          {name}
        </code>
        {alias && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-mono">
            {alias}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-3">{desc}</p>
      {flags && flags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {flags.map((f) => (
            <span
              key={f}
              className="text-[10px] px-1.5 py-0.5 rounded bg-secondary font-mono text-muted-foreground"
            >
              {f}
            </span>
          ))}
        </div>
      )}
      <TerminalBlock title="terminal">
        <Prompt cmd={example} />
      </TerminalBlock>
    </div>
  );
}

function Section({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-accent" />
        <h2 className="text-2xl font-bold">{label}</h2>
      </div>
      {children}
    </div>
  );
}

export default function CLIPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Terminal className="h-3.5 w-3.5 text-accent" />
            <span className="text-sm font-medium text-accent">v2.2.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            CLI Reference
          </h1>
          <p className="text-lg text-muted-foreground">
            31 commands. Install globally or use{" "}
            <code className="text-accent">bunx</code>.
          </p>
        </div>

        <TerminalBlock title="install">
          <Prompt cmd="bun add -g stabilize-cli" />
          <Out color="text-[#28c840]">✔ installed stabilize-cli@2.2.0</Out>
        </TerminalBlock>

        <div className="mb-8">
          <h3 className="font-semibold mb-2">Shorthand Aliases</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Every generate command has short aliases:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm font-mono">
            {[
              ["g:m", "generate:model"],
              ["g:mg", "generate:migration"],
              ["g:s", "generate:seed"],
              ["g:a", "generate:api"],
              ["g:x", "generate:all"],
              ["g:t", "generate:test"],
            ].map(([short, full]) => (
              <div
                key={short}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/30"
              >
                <span className="text-accent">{short}</span>
                <span className="text-muted-foreground">=</span>
                <span className="text-muted-foreground text-xs">{full}</span>
              </div>
            ))}
          </div>
        </div>

        <Section icon={FileCode2} label="Generate">
          <Cmd
            name="generate:model <name> [fields...]"
            alias="g:m"
            desc="Generate a model file. Pass columns as field:type pairs."
            flags={["--no-timestamps", "--no-soft-delete", "--versioned"]}
            example="stabilize-cli generate:model User name:string email:string age:int --versioned"
          />
          <Cmd
            name="generate:migration <name>"
            alias="g:mg"
            desc="Generate a migration JSON file from an existing model."
            flags={["-c, --config <path>"]}
            example="stabilize-cli generate:migration User"
          />
          <Cmd
            name="generate:seed <name>"
            alias="g:s"
            desc="Generate a seed file with sample data from model columns."
            flags={["-n, --count <number>"]}
            example="stabilize-cli generate:seed User --count 10"
          />
          <Cmd
            name="generate:api <name>"
            alias="g:a"
            desc="Generate REST API scaffold with CRUD routes. Creates model if missing."
            flags={["-p, --prefix <prefix>"]}
            example="stabilize-cli generate:api Product --prefix /v1"
          />
          <Cmd
            name="generate:all <name> [fields...]"
            alias="g:x"
            desc="Generate model + migration + seed in one command."
            flags={["--no-timestamps", "--versioned", "-n, --count"]}
            example="stabilize-cli generate:all Order userId:string total:decimal --count 20"
          />
          <Cmd
            name="generate:test <name>"
            alias="g:t"
            desc="Generate a vitest test file with CRUD test stubs for a model."
            example="stabilize-cli generate:test User"
          />
        </Section>

        <Section icon={GitBranch} label="Migrate">
          <Cmd
            name="migrate"
            desc="Apply all pending migrations from migrations/ directory."
            flags={["-c, --config <path>"]}
            example="stabilize-cli migrate"
          />
          <Cmd
            name="migrate:rollback"
            desc="Roll back the most recent migration using down SQL."
            flags={["-c, --config <path>"]}
            example="stabilize-cli migrate:rollback"
          />
          <Cmd
            name="migrate:fresh"
            desc="Drop all tables and re-run migrations. No seed."
            flags={["-c, --config <path>", "-f, --force"]}
            example="stabilize-cli migrate:fresh --force"
          />
          <Cmd
            name="migrate:status"
            desc="Show detailed migration status with applied timestamps."
            flags={["-c, --config <path>"]}
            example="stabilize-cli migrate:status"
          />
          <Cmd
            name="migrate:pending"
            desc="Show only pending (not yet applied) migrations."
            flags={["-c, --config <path>"]}
            example="stabilize-cli migrate:pending"
          />
          <Cmd
            name="migrate:auto"
            desc="GORM-style auto migrate: create tables, add missing columns and indexes. Never deletes. Reads the models the project itself loaded, and reports any model whose table could not be created."
            flags={["-c, --config <path>"]}
            example="stabilize-cli migrate:auto"
          />
        </Section>

        <Section icon={Layers} label="Seed">
          <Cmd
            name="seed"
            desc="Run all pending seed files. Tracks applied seeds in database."
            flags={["-c, --config <path>"]}
            example="stabilize-cli seed"
          />
        </Section>

        <Section icon={Database} label="Database">
          <Cmd
            name="db:drop"
            desc="Drop all tables. SQLite deletes the file."
            flags={["-c, --config <path>", "-f, --force"]}
            example="stabilize-cli db:drop --force"
          />
          <Cmd
            name="db:reset"
            desc="Drop all tables, re-run migrations, and seed. Full reset."
            flags={["-c, --config <path>", "-f, --force"]}
            example="stabilize-cli db:reset --force"
          />
          <Cmd
            name="db:truncate [table]"
            desc="Truncate a specific table or all tables."
            flags={["-c, --config <path>", "-f, --force"]}
            example="stabilize-cli db:truncate users --force"
          />
          <Cmd
            name="db:backup"
            desc="Backup database. SQLite copies .db file; others export to JSON."
            flags={["-c, --config <path>", "-o, --output <dir>"]}
            example="stabilize-cli db:backup --output ./backups"
          />
          <Cmd
            name="db:restore <file>"
            desc="Restore from a .db (SQLite) or .json backup file."
            flags={["-c, --config <path>", "-f, --force"]}
            example="stabilize-cli db:restore backups/backup.db --force"
          />
          <Cmd
            name="db:tables"
            desc="List all tables with row counts."
            flags={["-c, --config <path>"]}
            example="stabilize-cli db:tables"
          />
          <Cmd
            name="db:size"
            desc="Show database file size and per-table row counts."
            flags={["-c, --config <path>"]}
            example="stabilize-cli db:size"
          />
          <Cmd
            name="db:diff"
            desc="Compare model definitions against database tables. Shows missing/extra."
            flags={["-c, --config <path>"]}
            example="stabilize-cli db:diff"
          />
          <Cmd
            name="db:console"
            alias="db:sql"
            desc="Interactive SQL REPL. Type 'tables' to list, 'exit' to quit."
            flags={["-c, --config <path>"]}
            example="stabilize-cli db:console"
          />
          <Cmd
            name="db:table:info <table>"
            desc="Show detailed column info for a specific table."
            flags={["-c, --config <path>"]}
            example="stabilize-cli db:table:info users"
          />
        </Section>

        <Section icon={Code2} label="Model">
          <Cmd
            name="model:validate"
            desc="Validate all model files for errors (missing columns, types, etc)."
            example="stabilize-cli model:validate"
          />
          <Cmd
            name="model:info <name>"
            desc="Show detailed model metadata: columns, relations, scopes."
            example="stabilize-cli model:info User"
          />
        </Section>

        <Section icon={Settings} label="Config">
          <Cmd
            name="config:init"
            desc="Scaffold a starter config/database.ts file."
            flags={["--type <db>"]}
            example="stabilize-cli config:init --type postgres"
          />
        </Section>

        <Section icon={Search} label="Diagnostics">
          <Cmd
            name="status"
            desc="Show migration and seed status with health check."
            flags={["-c, --config <path>"]}
            example="stabilize-cli status"
          />
          <Cmd
            name="health"
            desc="Check database and cache connectivity with latency."
            flags={["-c, --config <path>"]}
            example="stabilize-cli health"
          />
          <Cmd
            name="health:json"
            desc="Health check with JSON output for CI/CD automation."
            flags={["-c, --config <path>"]}
            example="stabilize-cli health:json"
          />
          <Cmd
            name="query <sql>"
            desc="Execute a raw SQL query and display results in a table."
            flags={["-c, --config <path>", "-p, --params"]}
            example="stabilize-cli query 'SELECT * FROM users LIMIT 5'"
          />
          <Cmd
            name="info"
            desc="Show CLI version, runtime, platform, and all commands."
            example="stabilize-cli info"
          />
        </Section>

        <Section icon={ShieldAlert} label="Confirmation & Safety">
          <p className="text-muted-foreground mb-4">
            Commands that destroy data — <code>migrate:fresh</code>,{" "}
            <code>db:drop</code>, <code>db:reset</code>, <code>db:truncate</code>{" "}
            and <code>db:restore</code> — ask before they act:
          </p>
          <TerminalBlock title="terminal">
            <Prompt cmd="stabilize-cli db:drop" />
            <Out color="text-[#febc2e]">
              ⚠ Drop ALL TABLES in &apos;test.db&apos;? This cannot be undone.
              (y/N)
            </Out>
          </TerminalBlock>
          <p className="text-muted-foreground my-4">
            Anything other than <code>y</code> aborts and changes nothing. With
            no terminal attached — a CI runner, a piped script,{" "}
            <code>docker run</code> without <code>-t</code> — there is nobody to
            answer, so the CLI refuses rather than waiting forever on a question
            that can never be answered:
          </p>
          <TerminalBlock title="terminal">
            <Prompt cmd="stabilize-cli db:drop < /dev/null" />
            <Out color="text-[#febc2e]">
              ⚠ Drop ALL TABLES in &apos;test.db&apos;? This cannot be undone.
            </Out>
            <Out color="text-[#febc2e]">
              Refusing to proceed without confirmation — stdin is not a
              terminal. Pass --force to proceed.
            </Out>
          </TerminalBlock>
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
            <p className="text-sm font-semibold mb-2">
              <code>--force</code> is how you say yes from a script
            </p>
            <p className="text-sm text-muted-foreground">
              Every one of these commands takes <code>-f, --force</code>, which
              skips the prompt entirely. That is the supported way to run a
              destructive command unattended — nothing else opts in, so an
              accidental <code>db:drop</code> in a pipeline stops instead of
              taking your data with it.
            </p>
          </div>
        </Section>

        <Section icon={Zap} label="Typical Workflow">
          <TerminalBlock title="workflow">
            <Prompt cmd="stabilize-cli config:init --type sqlite" />
            <Out color="text-[#28c840]">
              ✔ Config generated: config/database.ts
            </Out>
            <div className="h-4" />
            <Prompt cmd="stabilize-cli generate:all User name:string email:string age:int --count 10" />
            <Out color="text-[#5b9bd5]">
              ℹ Generating model, migration, and seed for &apos;user&apos;...
            </Out>
            <Out color="text-[#28c840]">✔ Model: models/user.ts</Out>
            <Out color="text-[#28c840]">
              ✔ Migration: migrations/20260402120000_create_user_table.json
            </Out>
            <Out color="text-[#28c840]">
              ✔ Seed: seeds/20260402120000_seed_user.ts
            </Out>
            <div className="h-4" />
            <Prompt cmd="stabilize-cli migrate" />
            <Out color="text-[#28c840]">✔ All 1 migration(s) applied.</Out>
            <div className="h-4" />
            <Prompt cmd="stabilize-cli seed" />
            <Out color="text-[#28c840]">✔ Applied 1 seed(s).</Out>
            <div className="h-4" />
            <Prompt cmd="stabilize-cli model:validate" />
            <Out color="text-white/90 font-semibold">Model Validation</Out>
            <Out>
              {" "}
              <span className="text-[#28c840]">✔ User</span>{" "}
              <span className="text-white/30">
                (models/user.ts, table: users)
              </span>
            </Out>
            <Out>
              {" "}
              <span className="text-white/90">Summary:</span> 1 models, 0
              errors, 0 warnings
            </Out>
            <div className="h-4" />
            <Prompt cmd="stabilize-cli db:diff" />
            <Out color="text-white/90 font-semibold">Schema Diff</Out>
            <Out>
              {" "}
              <span className="text-[#28c840]">✔</span> users{" "}
              <span className="text-white/30">(in sync)</span>
            </Out>
            <div className="h-4" />
            <Prompt cmd="stabilize-cli health" />
            <Out>
              <span className="text-[#28c840]">✔</span> Database: healthy
            </Out>
            <Out>
              {" "}
              <span className="text-white/90">Type:</span> sqlite
            </Out>
            <Out>
              {" "}
              <span className="text-white/90">Latency:</span> 0.42ms
            </Out>
          </TerminalBlock>
        </Section>
    </div>
  );
}
