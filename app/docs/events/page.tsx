"use client"

import { CodeBlock } from "@/components/code-block"

export default function EventsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-4">Events</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Observe the ORM from a single subscription point — connections,
            queries, errors, transactions and migrations. <br />
            For row-level changes — before create, after update — use{" "}
            <a href="/docs/hooks" className="text-accent underline">
              Lifecycle Hooks
            </a>{" "}
            instead; events are ORM-wide, hooks are per model.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Subscribing</h2>
              <p className="text-muted-foreground mb-4">
                Every <code className="text-accent">Stabilize</code> instance
                exposes an <code className="text-accent">events</code> emitter.
                Handlers are plain functions; register with{" "}
                <code className="text-accent">on()</code> and remove with{" "}
                <code className="text-accent">off()</code>.
              </p>
              <CodeBlock
                filename="events.ts"
                language="typescript"
                code={`import { orm } from "./db";

orm.events.on("connection:open", (type) => {
  console.log("Connected to " + type);   // "postgres" | "mysql" | "sqlite" | "mssql"
});

orm.events.on("connection:close", () => {
  console.log("Connection closed");
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">API</h2>
              <CodeBlock
                filename="emitter.ts"
                language="typescript"
                code={`on(event: StabilizeEvent, handler: (...args: any[]) => void): void
off(event: StabilizeEvent, handler: (...args: any[]) => void): void
emit(event: StabilizeEvent, ...args: any[]): void`}
              />
              <p className="text-muted-foreground mt-4">
                <code className="text-accent">off()</code> matches by exact
                function reference, so keep a named reference rather than
                passing an inline arrow if you intend to unsubscribe:
              </p>
              <CodeBlock
                filename="unsubscribe.ts"
                language="typescript"
                code={`const onOpen = (type) => console.log("Connected to " + type);

orm.events.on("connection:open", onOpen);
orm.events.off("connection:open", onOpen);   // removed

// This does NOT work - the second arrow is a different function
orm.events.on("connection:open", () => console.log("hi"));
orm.events.off("connection:open", () => console.log("hi"));`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">The Events</h2>
              <p className="text-muted-foreground mb-4">
                Nine names are declared, and all nine are emitted. Each carries a
                single payload object — except{" "}
                <code className="text-accent">connection:open</code>, which
                carries the backend name on its own.
              </p>
              <CodeBlock
                filename="events.ts"
                language="typescript"
                code={`"connection:open"        // DBType  — "postgres" | "mysql" | "sqlite" | "mssql" | "mongodb"
"connection:close"       // no payload

"query"                  // { dbType, query, params, executionTime }
"error"                  // { dbType, phase, error, ... }  see below

"transaction:start"      // { dbType }
"transaction:complete"   // { dbType }
"transaction:error"      // { dbType, phase: "transaction", error }

"migration:start"        // { dbType, name, index, total }
"migration:complete"     // { dbType, name, index, total }`}
              />

              <h3 className="text-lg font-semibold mt-8 mb-3">The error payload</h3>
              <p className="text-muted-foreground mb-4">
                <code className="text-accent">error</code> is the one event whose
                shape depends on where it came from.{" "}
                <code className="text-accent">phase</code> tells you which, and
                is always present, so a listener filtering on it sees every
                error:
              </p>
              <CodeBlock
                filename="error-payload.ts"
                language="typescript"
                code={`// phase: "query" - thrown by the retry loop, on every attempt, not only the last
{ dbType, phase: "query", query, params, attempt, attempts, error }

// phase: "migration" - a migration step failed
{ dbType, phase: "migration", error }

// phase: "transaction" - the callback threw, and the transaction rolled back
{ dbType, phase: "transaction", error }`}
              />
              <p className="text-muted-foreground mt-4">
                Because <code className="text-accent">error</code> fires on every
                attempt, a query that fails twice and then succeeds produces two{" "}
                <code className="text-accent">error</code> events and no failed
                call. Compare{" "}
                <code className="text-accent">attempt</code> against{" "}
                <code className="text-accent">attempts</code> to tell a transient
                failure from the one that ended it.
              </p>

              <h3 className="text-lg font-semibold mt-8 mb-3">
                migration:start carries a position
              </h3>
              <p className="text-muted-foreground mb-4">
                Both migration events fire once per unit of work rather than once
                per run, and report where that unit sits in the list. A run of
                forty migrations gives forty pairs, so progress can be shown
                against a real total instead of a single start and end you
                cannot attribute to anything.
              </p>
              <CodeBlock
                filename="progress.ts"
                language="typescript"
                code={`orm.events.on("migration:complete", ({ name, index, total }) => {
  console.log(\`[\${index + 1}/\${total}] \${name}\`);
});`}
              />
              <p className="text-muted-foreground mt-4">
                <code className="text-accent">name</code> is the migration&apos;s
                name for{" "}
                <code className="text-accent">migrate()</code>, and the table or
                collection being reconciled for{" "}
                <code className="text-accent">autoMigrate()</code> — which a
                caller who never wrote a migration could not otherwise attribute.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                connection:open Fires Before You Can Subscribe
              </h2>
              <p className="text-muted-foreground mb-4">
                The connection opens inside the{" "}
                <code className="text-accent">Stabilize</code> constructor, so it
                is announced before the instance is returned to you. An{" "}
                <code className="text-accent">on()</code> call afterwards is
                simply too late:
              </p>
              <CodeBlock
                filename="too-late.ts"
                language="typescript"
                code={`const orm = new Stabilize(dbConfig);
orm.events.on("connection:open", handler);   // never called - already fired`}
              />
              <p className="text-muted-foreground my-4">
                Build the emitter yourself, subscribe, then pass it in. The
                fifth constructor argument is the only way to hear that first
                event:
              </p>
              <CodeBlock
                filename="events.ts"
                language="typescript"
                code={`import { Stabilize, StabilizeEmitter } from "stabilize-orm";

const events = new StabilizeEmitter();

events.on("connection:open", (type) => {
  console.log("Connected to " + type);
});

const orm = new Stabilize(dbConfig, cacheConfig, loggerConfig, undefined, events);`}
              />
              <p className="text-muted-foreground mt-4">
                Passing the same emitter to several instances is supported — the
                client adopts it rather than building its own, so every{" "}
                <code className="text-accent">query</code>,{" "}
                <code className="text-accent">error</code> and{" "}
                <code className="text-accent">transaction:*</code> reaches the
                handlers you registered.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Handler Errors Are Swallowed</h2>
              <p className="text-muted-foreground mb-4">
                Each handler is invoked inside a{" "}
                <code className="text-accent">try/catch</code> that discards the
                error. A throwing handler cannot break the ORM call it fired
                from — but it also fails silently, so wrap your own logic if a
                failure there matters.
              </p>
              <CodeBlock
                filename="safe-handler.ts"
                language="typescript"
                code={`orm.events.on("connection:open", (type) => {
  try {
    metrics.increment("db.connect." + type);
  } catch (error) {
    // Without this catch, the failure would vanish entirely
    logger.error("metrics failed", error);
  }
});`}
              />
            </section>
          </div>
    </div>
  )
}
