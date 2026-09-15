"use client"

import { CodeBlock } from "@/components/code-block"

export default function EventsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-4">Events</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Observe connection lifecycle from a single subscription point. <br />
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
              <h2 className="text-2xl font-semibold mb-4">Right Now: Two Events Fire</h2>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
                <p className="text-sm font-semibold mb-2">
                  The event list is wider than the implementation
                </p>
                <p className="text-sm text-muted-foreground">
                  The <code>StabilizeEvent</code> type declares nine names, but
                  only two are emitted anywhere in the library today:{" "}
                  <code>connection:open</code> and{" "}
                  <code>connection:close</code>. The remaining seven are
                  reserved — a handler registered for them will simply never be
                  called. This is documented here rather than omitted so you can
                  plan around it.
                </p>
              </div>
              <CodeBlock
                filename="events.ts"
                language="typescript"
                code={`// Fired today
"connection:open"          // payload: DBType
"connection:close"         // no payload

// Declared but never emitted - handlers will not run
"query"
"error"
"migration:start"
"migration:complete"
"transaction:start"
"transaction:complete"
"transaction:error"`}
              />
              <p className="text-muted-foreground mt-4">
                For the capabilities the unused names suggest, use the
                alternatives that are implemented:{" "}
                <a href="/docs/logging" className="text-accent underline">
                  Logging
                </a>{" "}
                for query and error visibility,{" "}
                <a href="/docs/hooks" className="text-accent underline">
                  Lifecycle Hooks
                </a>{" "}
                for per-row change events, and the return value of{" "}
                <a href="/docs/transactions" className="text-accent underline">
                  transaction()
                </a>{" "}
                to detect success or failure.
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
