"use client"

import { CodeBlock } from "@/components/code-block"

export default function TransactionsPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Transactions</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Ensure data integrity with atomic database transactions. <br />
            Stabilize provides a unified API for transactions across PostgreSQL, MySQL, and SQLite.
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
                Stabilize automatically handles nested transaction calls by reusing the same transaction client:
              </p>
              <CodeBlock
                filename="nested-transaction.ts"
                language="typescript"
                code={`await orm.transaction(async (txClient) => {
  // This is the outer transaction
  await orm.transaction(async (nestedTxClient) => {
    // This will use the same transaction client
    await doSomething(nestedTxClient);
  }, txClient);
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Supported Databases</h2>
              <CodeBlock
                filename="client.ts"
                language="typescript"
                code={`await dbClient.transaction(async (txClient) => {
  // Works with PostgreSQL, MySQL, and SQLite!
  await repo.create(data, {}, txClient);
});`}
              />
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
      </div>
    </div>
  )
}