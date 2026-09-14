"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  Database,
  GitBranch,
  FileCode2,
  HardDrive,
  Search,
  Layers,
  Code2,
  Settings,
  Beaker,
} from "lucide-react";

function TBlock({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-border/60 bg-[#1a1a1a] my-3">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#2a2a2a] border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs text-white/40 ml-3 font-mono">
          {title || "terminal"}
        </span>
      </div>
      <div className="p-4 font-mono text-[13px] leading-7">{children}</div>
    </div>
  );
}

function P({ cmd }: { cmd: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[#28c840] select-none shrink-0">❯</span>
      <span className="text-white/90">{cmd}</span>
    </div>
  );
}

function Section({
  icon: I,
  label,
  children,
}: {
  icon: any;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <I className="h-5 w-5 text-accent" />
        <h2 className="text-2xl font-bold">{label}</h2>
      </div>
      {children}
    </div>
  );
}

export default function CliApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">CLI Commands</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Stabilize CLI v2.2.0 — 31 commands with shorthand aliases
        </p>

        <Section icon={FileCode2} label="Generate">
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              generate:model &lt;name&gt; [fields...]
            </code>
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-mono">
              g:m
            </span>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Generate a model file. Pass columns as field:type.
            </p>
            <TBlock>
              <P cmd="stabilize-cli generate:model User name:string email:string age:int --versioned" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              generate:migration &lt;name&gt;
            </code>
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-mono">
              g:mg
            </span>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Generate a migration JSON from an existing model.
            </p>
            <TBlock>
              <P cmd="stabilize-cli generate:migration User" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              generate:seed &lt;name&gt;
            </code>
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-mono">
              g:s
            </span>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Generate a seed file with sample data.
            </p>
            <TBlock>
              <P cmd="stabilize-cli generate:seed User --count 10" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              generate:api &lt;name&gt;
            </code>
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-mono">
              g:a
            </span>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Generate REST API scaffold. Creates model if missing.
            </p>
            <TBlock>
              <P cmd="stabilize-cli generate:api Product --prefix /v1" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              generate:all &lt;name&gt; [fields...]
            </code>
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-mono">
              g:x
            </span>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Generate model + migration + seed together.
            </p>
            <TBlock>
              <P cmd="stabilize-cli generate:all Product name:string price:decimal --count 10" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              generate:test &lt;name&gt;
            </code>
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-mono">
              g:t
            </span>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Generate vitest test file with CRUD stubs.
            </p>
            <TBlock>
              <P cmd="stabilize-cli generate:test User" />
            </TBlock>
          </Card>
        </Section>

        <Section icon={GitBranch} label="Migrate">
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              migrate
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Apply all pending migrations.
            </p>
            <TBlock>
              <P cmd="stabilize-cli migrate" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              migrate:rollback
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Roll back the most recent migration.
            </p>
            <TBlock>
              <P cmd="stabilize-cli migrate:rollback" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              migrate:fresh
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Drop all tables and re-run migrations. No seed.
            </p>
            <TBlock>
              <P cmd="stabilize-cli migrate:fresh --force" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              migrate:status
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Detailed migration status with timestamps.
            </p>
            <TBlock>
              <P cmd="stabilize-cli migrate:status" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              migrate:pending
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Show only pending migrations.
            </p>
            <TBlock>
              <P cmd="stabilize-cli migrate:pending" />
            </TBlock>
          </Card>
        </Section>

        <Section icon={Database} label="Database">
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              db:drop
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Drop all tables.
            </p>
            <TBlock>
              <P cmd="stabilize-cli db:drop --force" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              db:reset
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Drop, migrate, and seed in one command.
            </p>
            <TBlock>
              <P cmd="stabilize-cli db:reset --force" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              db:truncate [table]
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Truncate a specific table or all tables.
            </p>
            <TBlock>
              <P cmd="stabilize-cli db:truncate users --force" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              db:backup
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Backup database to timestamped file.
            </p>
            <TBlock>
              <P cmd="stabilize-cli db:backup --output ./backups" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              db:restore &lt;file&gt;
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Restore from backup file.
            </p>
            <TBlock>
              <P cmd="stabilize-cli db:restore backups/backup.db --force" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              db:tables
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              List all tables with row counts.
            </p>
            <TBlock>
              <P cmd="stabilize-cli db:tables" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              db:size
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Database size statistics.
            </p>
            <TBlock>
              <P cmd="stabilize-cli db:size" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              db:diff
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Compare models vs database schema.
            </p>
            <TBlock>
              <P cmd="stabilize-cli db:diff" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              db:console
            </code>
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-mono">
              db:sql
            </span>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Interactive SQL REPL.
            </p>
            <TBlock>
              <P cmd="stabilize-cli db:console" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              db:table:info &lt;table&gt;
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Show column details for a specific table.
            </p>
            <TBlock>
              <P cmd="stabilize-cli db:table:info users" />
            </TBlock>
          </Card>
        </Section>

        <Section icon={Code2} label="Model & Config">
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              model:validate
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Validate all model files for errors.
            </p>
            <TBlock>
              <P cmd="stabilize-cli model:validate" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              model:info &lt;name&gt;
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Show columns, relations, scopes for a model.
            </p>
            <TBlock>
              <P cmd="stabilize-cli model:info User" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              config:init
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Scaffold a starter config/database.ts file.
            </p>
            <TBlock>
              <P cmd="stabilize-cli config:init --type postgres" />
            </TBlock>
          </Card>
        </Section>

        <Section icon={Search} label="Diagnostics">
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              status
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Migration and seed status with health check.
            </p>
            <TBlock>
              <P cmd="stabilize-cli status" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              health
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Database and cache health check.
            </p>
            <TBlock>
              <P cmd="stabilize-cli health" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              health:json
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              JSON output for CI/CD automation.
            </p>
            <TBlock>
              <P cmd="stabilize-cli health:json" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              query &lt;sql&gt;
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Execute raw SQL and display results.
            </p>
            <TBlock>
              <P cmd="stabilize-cli query 'SELECT * FROM users LIMIT 5'" />
            </TBlock>
          </Card>
          <Card className="border-border/50 bg-card/50 p-5">
            <code className="text-sm font-mono font-semibold text-accent">
              info
            </code>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              CLI version, runtime, platform info.
            </p>
            <TBlock>
              <P cmd="stabilize-cli info" />
            </TBlock>
          </Card>
        </Section>
      </div>
    </div>
  );
}
