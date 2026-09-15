"use client"

import { CodeBlock } from "@/components/code-block"

export default function OptimisticLockingPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-4">Optimistic Locking</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Stop one user silently overwriting another&apos;s edit. <br />
            No row locks, no held transactions — just a version check on the
            write itself.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">The Problem</h2>
              <p className="text-muted-foreground mb-4">
                Two users open the same article. Alice saves a new title; Bob,
                whose editor still holds the old row, saves a new body. Bob&apos;s
                write carries the stale title with it and Alice&apos;s edit is
                gone — no error, no trace.
              </p>
              <CodeBlock
                filename="lost-update.ts"
                language="typescript"
                code={`// Alice reads  { id: 1, title: "Draft",      body: "Hello"  }
// Bob   reads  { id: 1, title: "Draft",      body: "Hello"  }

await repo.update(1, { title: "Final" });        // Alice
await repo.update(1, { body: "Hello world" });   // Bob

// Result: { title: "Draft", body: "Hello world" }  <- Alice's edit lost`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Declaring the Lock</h2>
              <p className="text-muted-foreground mb-4">
                Mark one column{" "}
                <code className="text-accent">optimisticLock: true</code>. The
                first column that carries the flag becomes the version field for
                that model.
              </p>
              <CodeBlock
                filename="models/article.ts"
                language="typescript"
                code={`export const Article = defineModel({
  tableName: "articles",
  columns: {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    body: { type: DataTypes.TEXT },
    version: { type: DataTypes.INTEGER, optimisticLock: true },
  },
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How It Behaves</h2>
              <CodeBlock
                filename="behaviour.ts"
                language="typescript"
                code={`// create() seeds the version at 1 when you don't supply one
const article = await repo.create({ title: "Draft", body: "Hello" });
// => { id: 1, title: "Draft", body: "Hello", version: 1 }

// Every update() advances it and matches on the value it expects
await repo.update(1, { title: "Final" });
// UPDATE articles SET title = ?, version = 2 WHERE id = ? AND version = 1
// => { id: 1, title: "Final", body: "Hello", version: 2 }`}
              />
              <p className="text-muted-foreground my-4">
                The update is a single statement whose{" "}
                <code className="text-accent">WHERE</code> clause carries the
                version. If another write landed in between, the row no longer
                matches, zero rows are affected, and Stabilize raises:
              </p>
              <CodeBlock
                filename="conflict.ts"
                language="typescript"
                code={`import { StabilizeError } from "stabilize-orm";

try {
  await repo.update(1, { title: "Final" });
} catch (error) {
  if (error instanceof StabilizeError && error.code === "CONCURRENT_MODIFICATION") {
    // "Record was modified by another transaction
    //  (optimistic lock conflict on version)"
    return res.status(409).json({ error: "This record changed. Reload and retry." });
  }
  throw error;
}`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Checking the Version Yourself
              </h2>
              <p className="text-muted-foreground mb-4">
                To catch a conflict at the moment the user submits rather than
                after they typed, send the version you loaded with the form. A
                version you supply wins over the one just read, so a stale form
                fails immediately.
              </p>
              <CodeBlock
                filename="form.ts"
                language="typescript"
                code={`// The client posts back the version it rendered
await repo.update(articleId, {
  title: form.title,
  version: form.version,   // fails if this is no longer current
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Bulk Updates</h2>
              <p className="text-muted-foreground mb-4">
                <code className="text-accent">updateBy()</code> touches many rows
                at once, so there is no single version to compare against. It
                advances the column in SQL instead — unless you included the
                version in the update yourself, in which case your value is
                kept.
              </p>
              <CodeBlock
                filename="update-by.ts"
                language="typescript"
                code={`// SET status = ?, version = version + 1 WHERE ...
await repo.updateBy({ status: "draft" }, { status: "archived" });`}
              />
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">
                  bulkUpdate() does not advance the version
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  <code>updateBy()</code> and <code>bulkUpdate()</code> look like
                  the same operation and are not.{" "}
                  <code>bulkUpdate()</code> takes a list of{" "}
                  <code>{`{ where, set }`}</code> pairs, re-reads each matched row
                  and updates it by id — but its SET clause is built from the keys
                  you passed and nothing else. No{" "}
                  <code>version = version + 1</code> is added.
                </p>
                <CodeBlock
                  language="typescript"
                  code={`await repo.bulkUpdate([
  { where: { condition: "status = ?", params: ["draft"] },
    set:   { status: "archived" } },
]);
// Rows keep their old version. The next ordinary update() carrying that
// version will still succeed - the conflict this column exists to catch
// is not detected for these rows.`}
                />
                <p className="text-sm text-muted-foreground mt-3">
                  Use <code>updateBy()</code> when the model has an optimistic
                  lock, or include the version yourself in{" "}
                  <code>set</code>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Retrying</h2>
              <p className="text-muted-foreground mb-4">
                Stabilize reports the conflict — it does not resolve it. The
                correct response depends on your domain: a conflict on a
                counter can be retried automatically, a conflict on prose cannot,
                because one edit has to win. Retry only what is genuinely
                re-derivable:
              </p>
              <CodeBlock
                filename="retry.ts"
                language="typescript"
                code={`for (let attempt = 0; attempt < 3; attempt++) {
  const current = await repo.findOrFail(articleId);
  try {
    return await repo.update(articleId, {
      ...change,
      version: current.version,
    });
  } catch (error) {
    if (!(error instanceof StabilizeError)) throw error;
    if (error.code !== "CONCURRENT_MODIFICATION") throw error;
    // someone else got there first - re-read and try again
  }
}
throw new Error("Could not apply change after 3 attempts");`}
              />
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">
                  Not row locking
                </p>
                <p className="text-sm text-muted-foreground">
                  This is optimistic locking: nothing is held open while a user
                  thinks. If you need a pessimistic lock — read a row, hold it,
                  and block others until you finish — use{" "}
                  <code>lockForUpdate()</code> inside a transaction instead. See{" "}
                  <a href="/docs/transactions" className="text-accent underline">
                    Transactions
                  </a>
                  . The two compose: a lock prevents the conflict, a version
                  detects it.
                </p>
              </div>
            </section>
          </div>
    </div>
  )
}
