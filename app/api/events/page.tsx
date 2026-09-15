"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function EventsApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Events API</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The <code>StabilizeEmitter</code> behind <code>orm.events</code>
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">StabilizeEmitter</h2>
              <CodeBlock
                language="typescript"
                code={`export class StabilizeEmitter {
  on(event: StabilizeEvent, handler: StabilizeEventHandler): void
  off(event: StabilizeEvent, handler: StabilizeEventHandler): void
  emit(event: StabilizeEvent, ...args: any[]): void
}

export type StabilizeEventHandler = (...args: any[]) => void;

// Accessor, created in the Stabilize constructor:
orm.events: StabilizeEmitter`}
              />
              <p className="text-muted-foreground mb-4">
                Every <code>Stabilize</code> instance creates one emitter in its
                constructor, reachable as <code>orm.events</code>. There is no{" "}
                <code>once()</code> method &mdash; register with{" "}
                <code>on()</code> and remove with <code>off()</code>.
              </p>
              <h3 className="font-semibold mb-2">Methods:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    on
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Registers a handler for an event
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    off
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Removes a handler by exact reference
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    emit
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Invokes every registered handler for an event
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/events.ts"
                language="typescript"
                code={`orm.events.on("connection:open", (type) => {
  console.log("Connected to " + type);
});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Event names</h2>
              <CodeBlock
                language="typescript"
                code={`type StabilizeEvent =
  | "query"
  | "error"
  | "migration:start"
  | "migration:complete"
  | "transaction:start"
  | "transaction:complete"
  | "transaction:error"
  | "connection:open"
  | "connection:close";`}
              />
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
                <p className="text-sm font-semibold mb-2">
                  Only two of these are ever emitted.
                </p>
                <p className="text-sm text-muted-foreground">
                  The library emits <code>connection:open</code> and{" "}
                  <code>connection:close</code> and nothing else. The other
                  seven names are declared in the union but are never fired by
                  the library &mdash; a handler registered for them will never
                  run. Do not build features on <code>query</code>,{" "}
                  <code>error</code> or the migration and transaction events.
                </p>
              </div>
              <h3 className="font-semibold mb-2">Emitted events:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    connection:open
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Payload is the <code>DBType</code>, e.g.{" "}
                    <code>&quot;postgres&quot;</code>
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    connection:close
                  </Badge>{" "}
                  <span className="text-muted-foreground">No payload</span>
                </li>
              </ul>
              <h3 className="font-semibold mb-2">Declared but never fired:</h3>
              <ul className="space-y-2">
                <li>
                  <Badge variant="outline" className="mr-2">
                    query
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Declared in the union; never emitted
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    error
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Declared in the union; never emitted
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    migration:start
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Declared in the union; never emitted
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    migration:complete
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Declared in the union; never emitted
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    transaction:start
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Declared in the union; never emitted
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    transaction:complete
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Declared in the union; never emitted
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    transaction:error
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Declared in the union; never emitted
                  </span>
                </li>
              </ul>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">off()</h2>
              <CodeBlock
                language="typescript"
                code={`off(event: StabilizeEvent, handler: StabilizeEventHandler): void`}
              />
              <p className="text-muted-foreground mb-4">
                Removes a handler by exact reference &mdash; it looks the
                function up with <code>indexOf</code> and removes it with{" "}
                <code>splice</code>. An inline arrow function cannot be
                unsubscribed, because a new function object is a different
                reference.
              </p>
              <CodeBlock
                filename="example/off.ts"
                language="typescript"
                code={`// Keep a named reference so you can unsubscribe later.
function onOpen(type) {
  console.log("Connected to " + type);
}

orm.events.on("connection:open", onOpen);
orm.events.off("connection:open", onOpen);

// This does NOT work -- the second arrow is a different reference
// and is not present in the handler list:
orm.events.on("connection:open", () => {});
orm.events.off("connection:open", () => {});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">emit()</h2>
              <CodeBlock
                language="typescript"
                code={`emit(event: StabilizeEvent, ...args: any[]): void`}
              />
              <p className="text-muted-foreground mb-4">
                Passes <code>...args</code> to every registered handler for the
                event.
              </p>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
                <p className="text-sm font-semibold mb-2">
                  Handler exceptions are swallowed.
                </p>
                <p className="text-sm text-muted-foreground">
                  Each handler is invoked inside{" "}
                  <code>try &#123; handler(...args) &#125; catch &#123;&#125;</code>
                  , so a handler that throws fails silently. It will not
                  propagate to your code, and it will not stop the other
                  handlers from running &mdash; but you will not see the error
                  unless you catch it inside the handler yourself.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
