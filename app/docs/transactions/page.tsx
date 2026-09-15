"use client"

import { CodeBlock } from "@/components/code-block"

export default function TransactionsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-4">Transactions</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Ensure data integrity with atomic database transactions. <br />
            Stabilize provides a unified API for transactions across PostgreSQL, MySQL, SQLite, and SQL Server.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Basic Transaction</h2>
              <CodeBlock
                filename="transaction.ts"
                language="typescript"
                code={`import { orm } from "./db";

await orm.transaction(async (txClient) => {
  const userRepo = orm.getRepository(User);
  const profileRepo = orm.getRepository(Profile);
  
  // All operations use the same transaction client
  const user = await userRepo.create(
    { name: "Lwazii Dlamini", email: "lwazicd@icloud.com" },
    {},
    txClient
  );
  
  await profileRepo.create(
    { userId: user.id, bio: "Hello Stabilize!" },
    {},
    txClient
  );
  
  // If any operation fails, everything is rolled back
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
              <CodeBlock
                filename="transaction-error.ts"
                language="typescript"
                code={`try {
  await orm.transaction(async (txClient) => {
  
    await userRepo.create(userData, {}, txClient);
    await profileRepo.create(profileData, {}, txClient);
  });
  console.log("Transaction committed successfully");
} catch (error) {
  console.error("Transaction rolled back:", error);
}`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Nested Transactions</h2>
              <p className="text-muted-foreground mb-4">
                <code className="text-accent">transaction()</code> takes a single
                argument — the callback. There is no second parameter for an
                existing client. A nested call detects that it is already inside
                a transaction and reuses it, so the inner block joins the outer
                transaction rather than starting a new one:
              </p>
              <CodeBlock
                filename="nested-transaction.ts"
                language="typescript"
                code={`await orm.transaction(async (txClient) => {
  // Outer transaction
  await orm.transaction(async (nestedTxClient) => {
    // nestedTxClient is the same client - this joins the outer transaction
    await doSomething(nestedTxClient);
  });

  // A throw anywhere inside rolls back everything, inner and outer
});`}
              />
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">No savepoints</p>
                <p className="text-sm text-muted-foreground">
                  Because a nested call reuses the outer transaction, there are
                  no savepoints and no partial rollback. An inner failure takes
                  down the whole transaction — you cannot catch it and keep the
                  outer work. If you need that granularity, restructure so the
                  optional work is a separate transaction.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Supported Databases</h2>
              <CodeBlock
                filename="client.ts"
                language="typescript"
                code={`await dbClient.transaction(async (txClient) => {
  // Works with PostgreSQL, MySQL, SQLite, and SQL Server!
  await repo.create(data, {}, txClient);
});`}
              />
              <p className="text-muted-foreground mt-4">
                The callback API is identical everywhere, but the mechanism
                underneath is not, and the difference matters if you drop to a
                lower level:
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-accent/30">
                      <th className="text-left py-2 pr-4 font-semibold">
                        Dialect
                      </th>
                      <th className="text-left py-2 font-semibold">
                        How the transaction is held
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-accent/10">
                      <td className="py-2 pr-4">PostgreSQL</td>
                      <td className="py-2">
                        One connection checked out of the <code>pg</code> pool for
                        the duration, then <code>BEGIN</code> /{" "}
                        <code>COMMIT</code> on it
                      </td>
                    </tr>
                    <tr className="border-b border-accent/10">
                      <td className="py-2 pr-4">MySQL / MariaDB</td>
                      <td className="py-2">
                        One connection checked out of the <code>mysql2</code>{" "}
                        pool, then <code>START TRANSACTION</code>
                      </td>
                    </tr>
                    <tr className="border-b border-accent/10">
                      <td className="py-2 pr-4">SQLite</td>
                      <td className="py-2">
                        The single shared <code>bun:sqlite</code> connection, with
                        <code> BEGIN</code> / <code>COMMIT</code>
                      </td>
                    </tr>
                    <tr className="border-b border-accent/10">
                      <td className="py-2 pr-4">SQL Server</td>
                      <td className="py-2">
                        An <code>mssql</code> <code>Transaction</code> object, and
                        every statement issued through a{" "}
                        <code>Request</code> built from it
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground mt-4">
                That last row is the one to be careful with. T-SQL has no{" "}
                <code>BEGIN</code> statement to send as text, so a transaction is a
                server-side object bound to one connection — a{" "}
                <code>Request</code> built from the <em>pool</em> would run on an
                unrelated connection and commit on its own, silently escaping the
                transaction. Passing the <code>txClient</code> the callback gives
                you is what keeps statements inside it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
              <CodeBlock
                filename="client.ts"
                language="typescript"
                code={`// DBClient
async transaction<T>(callback: (txClient: DBClient) => Promise<T>): Promise<T>

// Usage example:
await db.transaction(async (tx) => {
  // use tx for all DB operations within this transaction
});`}
              />
            </section>
          </div>
    </div>
  )
}