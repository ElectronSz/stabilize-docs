"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function TransactionsApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Transactions API</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Atomic multi-statement writes, how the client is threaded through
            them, and what the library does not offer
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Stabilize.transaction()
              </h2>
              <CodeBlock
                language="typescript"
                code={`async transaction<T>(
  callback: (txClient: DBClient) => Promise<T>,
): Promise<T>`}
              />
              <p className="text-muted-foreground mb-4">
                Runs the callback inside a transaction and resolves to whatever
                the callback returns. A throw anywhere inside rolls the whole
                thing back and the error propagates to the caller unchanged.
              </p>
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    callback
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Async function receiving the transactional{" "}
                    <code>DBClient</code> as its only argument.
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/transaction.ts"
                language="typescript"
                code={`const userRepo = orm.getRepository(User);
const profileRepo = orm.getRepository(Profile);

await orm.transaction(async (tx) => {
  const user = await userRepo.create({ name: "Ciniso" }, {}, tx);
  await profileRepo.create({ userId: user.id, bio: "A new bio" }, {}, tx);
});
// Both rows commit together, or neither is written.`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                DBClient.transaction()
              </h2>
              <CodeBlock
                language="typescript"
                code={`async transaction<T>(
  callback: (txClient: DBClient) => Promise<T>,
): Promise<T>`}
              />
              <p className="text-muted-foreground">
                The method <code>Stabilize.transaction()</code> delegates to. It
                is public on <code>DBClient</code> and exported from the package
                root, so it can be called directly on{" "}
                <code>orm.client</code>. It throws a{" "}
                <code>StabilizeError</code> with code{" "}
                <code>TX_ERROR</code> when the underlying client is none of the
                five supported drivers. MongoDB is one of the five; its driver
                is an optional dependency, and it serves transactions only on a
                replica set or sharded cluster.
              </p>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                You must pass the client
              </h2>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
                <p className="text-sm font-semibold mb-2">
                  Without <code>tx</code>, the write runs outside the
                  transaction.
                </p>
                <p className="text-sm text-muted-foreground">
                  Every repository method resolves its client as{" "}
                  <code>_client || this.client</code>. The repository holds its
                  own client from construction, so a call that omits the
                  transactional client does not fail &mdash; it opens a{" "}
                  <em>separate</em> transaction on a <em>different</em> pool
                  connection, commits immediately, and survives the rollback.
                  The transaction object is threaded by argument only; there is
                  no ambient or async-local context to pick it up for you.
                </p>
              </div>
              <CodeBlock
                filename="example/missing-tx.ts"
                language="typescript"
                code={`// WRONG: the second write is not in the transaction.
await orm.transaction(async (tx) => {
  await userRepo.create({ name: "Alice" }, {}, tx);
  await auditRepo.create({ action: "user.created" });   // no tx!
});

// RIGHT: pass tx to every call that should be covered.
await orm.transaction(async (tx) => {
  await userRepo.create({ name: "Alice" }, {}, tx);
  await auditRepo.create({ action: "user.created" }, {}, tx);
});`}
              />
              <p className="text-muted-foreground mt-4">
                The transactional client is the third argument on the write
                paths that accept it: <code>create(entity, options, client)</code>
                , <code>update(id, entity, client)</code>,{" "}
                <code>upsert(entity, keys, client)</code>,{" "}
                <code>delete(id, client)</code>,{" "}
                <code>recover(id, client)</code>, and the bulk equivalents. On
                reads it is likewise the trailing argument of{" "}
                <code>findOne</code>, <code>findBy</code> and{" "}
                <code>findOneBy</code>.
              </p>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Nested transactions are flattened
              </h2>
              <CodeBlock
                language="typescript"
                code={`if (this.isTransactionClient) return callback(this);`}
              />
              <p className="text-muted-foreground mb-4">
                A client already bound to a transaction satisfies a nested{" "}
                <code>transaction()</code> by handing back{" "}
                <em>itself</em> and running the callback directly. No second{" "}
                <code>BEGIN</code> is issued and no marker is created.
              </p>
              <p className="text-muted-foreground mb-4">
                This is what makes the library&apos;s own write methods safe to
                compose: <code>create()</code>, <code>update()</code> and the
                other write paths open a transaction internally when they are not
                already inside one, so calling them with a <code>tx</code> client
                participates in your transaction rather than nesting inside it.
              </p>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
                <p className="text-sm font-semibold mb-2">
                  There are no savepoints.
                </p>
                <p className="text-sm text-muted-foreground">
                  Nothing in the API maps to <code>SAVEPOINT</code> or{" "}
                  <code>ROLLBACK TO SAVEPOINT</code>. A throw in an inner
                  callback rolls back the <em>entire</em> transaction, not just
                  the inner block, because the inner block is not a transaction
                  of its own. To get partial rollback, catch the error inside the
                  callback and decide what to do with the outer transaction.
                </p>
              </div>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                What each dialect runs
              </h2>
              <p className="text-muted-foreground mb-4">
                The callback contract is identical everywhere, but the mechanism
                underneath is driver-specific:
              </p>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    SQLite
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Literal <code>BEGIN</code> / <code>COMMIT</code> /{" "}
                    <code>ROLLBACK</code>. SQLite runs on a single connection, so
                    the callback receives the <em>same</em> client rather than a
                    new one.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    PostgreSQL
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Borrows a connection from the pool and releases it in a{" "}
                    <code>finally</code>, so the connection is returned whether
                    the callback succeeds or throws.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    MySQL
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Same borrow-and-release, opening with{" "}
                    <code>START TRANSACTION</code> rather than{" "}
                    <code>BEGIN</code>.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    SQL Server
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Has no <code>BEGIN</code>/<code>COMMIT</code> text at all:
                    the transaction is a server-side object and every statement
                    is sent through a <code>Request</code> built from it. There is
                    no release step &mdash; commit or rollback returns the
                    borrowed connection to the pool.
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/dialects.ts"
                language="typescript"
                code={`// The SQL differs; the call site does not.
await orm.transaction(async (tx) => {
  await repo.create({ name: "Alice" }, {}, tx);
});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Not configurable
              </h2>
              <p className="text-muted-foreground mb-4">
                <code>transaction()</code> takes exactly one argument. There is
                no isolation-level option, no read-only flag, no timeout and no
                retry: the driver&apos;s default isolation applies. On SQL Server
                the underlying <code>begin()</code> does accept an isolation
                level, but the library never passes one.
              </p>
              <CodeBlock
                language="typescript"
                code={`// No such options exist:
await orm.transaction(async (tx) => { /* ... */ }, {
  isolationLevel: "serializable",   // not part of the API
});`}
              />
              <p className="text-muted-foreground mt-4">
                A deadlock or serialization failure surfaces as the driver&apos;s
                own error. If you need a retry, wrap the whole{" "}
                <code>transaction()</code> call in your own loop &mdash; the
                library will not re-run the callback for you.
              </p>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Methods that transact on their own
              </h2>
              <p className="text-muted-foreground mb-4">
                These write paths already wrap themselves in a transaction, so a
                single call is atomic without any explicit{" "}
                <code>transaction()</code> around it. Inside an outer
                transaction they join it instead of starting a second one:
              </p>
              <CodeBlock
                language="typescript"
                code={`create()        bulkCreate()    update()      bulkUpdate()
upsert()        bulkUpsert()    delete()      bulkDelete()
recover()       rollback()      sync()        upsertMany()`}
              />
              <p className="text-muted-foreground">
                A method not on this list &mdash; a bare{" "}
                <code>updateBy()</code> or <code>deleteBy()</code>, say &mdash;
                runs as a single statement with no wrapping transaction, so wrap
                it yourself when it has to be atomic with something else.
              </p>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">TX_ERROR</h2>
              <CodeBlock
                language="typescript"
                code={`class StabilizeError extends Error {
  code: string;
  originalError?: unknown;
}`}
              />
              <p className="text-muted-foreground mb-4">
                Raised with the message{" "}
                <code>
                  Transaction not supported by this client configuration.
                </code>{" "}
                when the client behind the call is not a recognised SQLite,
                PostgreSQL, MySQL, SQL Server or MongoDB handle.
              </p>
              <CodeBlock
                filename="example/tx-error.ts"
                language="typescript"
                code={`import { StabilizeError } from "stabilize-orm";

try {
  await orm.transaction(async (tx) => { /* ... */ });
} catch (err) {
  if (err instanceof StabilizeError && err.code === "TX_ERROR") {
    // The client is not one of the five supported drivers.
  }
}`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
