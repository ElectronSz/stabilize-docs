"use client"

import { CodeBlock } from "@/components/code-block"

export default function HelpersPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-4">Helper Methods</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The shortcuts that save a query-builder chain. <br />
            Lookups, upserts, counters, column extraction and raw SQL — all on
            the repository.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Single-Row Lookups</h2>
              <p className="text-muted-foreground mb-4">
                The <code className="text-accent">…OrFail</code> variants throw
                instead of returning{" "}
                <code className="text-accent">null</code>, which removes a
                null-check and produces a proper 404 at the boundary.
              </p>
              <CodeBlock
                filename="lookups.ts"
                language="typescript"
                code={`await repo.findOne(10);                       // T | null
await repo.findOne(10, { relations: ["roles"] });
await repo.findOneBy({ email: "ada@example.com" });   // T | null
await repo.findBy({ active: true }, { limit: 10, orderBy: "createdAt DESC" });
await repo.first({ status: "draft" });        // T | null
await repo.last("createdAt");                 // T | null, defaults to "id"
await repo.random();                          // T | null
await repo.exists({ email: "ada@example.com" });      // boolean

await repo.findOrFail(10);                    // T - throws if absent
await repo.firstOrFail({ title: "Second" });  // T - throws if absent`}
              />
              <CodeBlock
                filename="not-found.ts"
                language="typescript"
                code={`import { StabilizeError } from "stabilize-orm";

try {
  const user = await repo.findOrFail(id);
} catch (error) {
  if (error instanceof StabilizeError && error.code === "NOT_FOUND_ERROR") {
    return res.status(404).json({ error: "Not found" });
  }
  throw error;
}`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Create or Update</h2>
              <p className="text-muted-foreground mb-4">
                Two idempotent writes for the common &quot;get it, or make
                it&quot; case. Both return the row, so the caller does not need
                to know which branch ran.
              </p>
              <CodeBlock
                filename="upsert-helpers.ts"
                language="typescript"
                code={`// Find by conditions, or create using conditions + defaults
await repo.firstOrCreate({ email: "ada@example.com" }, { name: "Ada" });

// Update if present, create if not
await repo.updateOrCreate({ email: "ada@example.com" }, { name: "Ada L" });`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Counters and Toggles</h2>
              <p className="text-muted-foreground mb-4">
                Each applies the change in SQL and returns the{" "}
                <strong>updated row</strong>, so you see the committed value
                rather than computing it yourself — no read-modify-write race.
              </p>
              <CodeBlock
                filename="counters.ts"
                language="typescript"
                code={`await repo.increment(1, "views");        // views = views + 1
await repo.increment(1, "views", 5);     // views = views + 5
await repo.decrement(1, "stock", 2);     // stock = stock - 2
await repo.toggle(1, "active");          // flips a boolean`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Reading Columns</h2>
              <p className="text-muted-foreground mb-4">
                When you want a list of values rather than entities, these skip
                the hydration step:
              </p>
              <CodeBlock
                filename="columns.ts"
                language="typescript"
                code={`const emails = await repo.pluck("email");            // string[]
const rows = await repo.selectColumns("id", "email"); // Partial<T>[]`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Bulk Writes</h2>
              <CodeBlock
                filename="bulk.ts"
                language="typescript"
                code={`// One transaction, applies _upsert per row
await repo.bulkUpsert(rows, ["slug"]);

// Chunked in batches of 100 by default - better for very large inputs
await repo.upsertMany(rows, ["slug"], 500);

// Conditional mass update / delete - returns affected row count
await repo.updateBy({ status: "draft" }, { status: "archived" });
await repo.deleteBy({ userId: 7 });`}
              />
              <p className="text-muted-foreground mt-4">
                <code className="text-accent">updateBy()</code> and{" "}
                <code className="text-accent">deleteBy()</code> refuse empty
                conditions with <code className="text-accent">UNSAFE_QUERY</code>{" "}
                — a guard against a filter that silently became{" "}
                <code className="text-accent">{"{}"}</code> and rewrote the whole
                table. <code className="text-accent">deleteBy()</code>{" "}
                soft-deletes when the model has a soft-delete column, and hard
                deletes otherwise.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Soft Delete Recovery</h2>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
                <p className="text-sm font-semibold mb-2">
                  The single-row restore is recover(), not restore()
                </p>
                <p className="text-sm text-muted-foreground">
                  There is no <code>repo.restore(id)</code>. The three ways back
                  are <code>recover</code> for one row,{" "}
                  <code>restoreBy</code> for a filtered set, and{" "}
                  <code>recoverAll</code> for everything.
                </p>
              </div>
              <CodeBlock
                filename="recover.ts"
                language="typescript"
                code={`await repo.recover(5);                       // one row, returns it
await repo.restoreBy({ userId: 1 });         // affected row count
await repo.recoverAll();                     // every soft-deleted row

// Reading deleted rows
await repo.findDeleted().execute(db.client); // only trashed
await repo.withTrashed().where("id = ?", 5).execute(db.client);  // all rows`}
              />
              <p className="text-muted-foreground mt-4">
                <code className="text-accent">restoreBy()</code> needs a
                soft-delete column and throws{" "}
                <code className="text-accent">RECOVER_ERROR</code> without one, as
                does <code className="text-accent">recoverAll()</code>.{" "}
                <code className="text-accent">findDeleted()</code> throws{" "}
                <code className="text-accent">QUERY_ERROR</code> in the same
                case, since &quot;only the deleted rows&quot; has no meaning on a
                model that never soft deletes.
              </p>
              <p className="text-muted-foreground mt-4">
                <code className="text-accent">withTrashed()</code> is different:
                it does <strong>not</strong> throw and does not check for a
                soft-delete column at all. The soft-delete filter is added to{" "}
                <em>every</em> other builder entry point —{" "}
                <code className="text-accent">find()</code>,{" "}
                <code className="text-accent">findBy()</code>,{" "}
                <code className="text-accent">findOne()</code> and the rest — and{" "}
                <code className="text-accent">withTrashed()</code> is simply the
                one that returns a bare builder with no filter attached. On a
                model without a soft-delete column that is what an ordinary
                query already returns, so the call is a no-op rather than an
                error.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Raw SQL and Truncate</h2>
              <CodeBlock
                filename="raw.ts"
                language="typescript"
                code={`// Repository - parameterized read
await repo.rawQuery("SELECT * FROM users WHERE age > ?", [18]);

// ORM client - read and exec
await db.rawQuery("PRAGMA table_info(users)");
await db.rawExec("CREATE TABLE post_tags (post_id INTEGER, tag_id INTEGER)");
// => { affectedRows: number }

await repo.truncate();   // hard DELETE of every row, ignores soft delete`}
              />
              <p className="text-muted-foreground mt-4">
                <code className="text-accent">rawExec</code> exists only on the{" "}
                <code className="text-accent">Stabilize</code> client, not on a
                repository. Both take positional{" "}
                <code className="text-accent">?</code> placeholders — never
                interpolate values into the string yourself.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Streaming Over Results</h2>
              <p className="text-muted-foreground mb-4">
                For a job that touches every row, these page internally so the
                whole table is never in memory at once.
              </p>
              <CodeBlock
                filename="iterate.ts"
                language="typescript"
                code={`// Transform each row, collect results
const titles = await repo.map(repo.find(), (post) => post.title);

// Side effect per row, paged at 100
await repo.each(repo.find(), async (post, index) => {
  await indexer.add(post, index);
});

// Callback receives a whole batch, not one row
await repo.eachBatch(repo.find(), async (batch) => {
  await search.bulkIndex(batch);
}, 500);`}
              />
              <p className="text-muted-foreground mt-4">
                Both accept a{" "}
                <code className="text-accent">QueryBuilder</code> and clone it,
                so the builder you pass in is not mutated. The third argument is
                the page size: <code className="text-accent">each</code> takes{" "}
                <code className="text-accent">pageSize</code>,{" "}
                <code className="text-accent">eachBatch</code> takes{" "}
                <code className="text-accent">batchSize</code> — positionally the
                same, both defaulting to 100. Pagination is offset-based, so
                rows inserted during a long run can shift the window.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Utilities</h2>
              <CodeBlock
                filename="utils.ts"
                language="typescript"
                code={`import { generateUUID, sqlDefault } from "stabilize-orm";

generateUUID();   // crypto.randomUUID()

// Use as defaultExpression, not defaultValue
columns: {
  id: { type: DataTypes.UUID, defaultExpression: sqlDefault("gen_random_uuid()") },
}`}
              />
              <p className="text-muted-foreground mt-4">
                <code className="text-accent">sqlDefault()</code> marks a value
                as raw SQL to be emitted verbatim. Note that AutoMigrate emits
                only <code className="text-accent">defaultValue</code> when it
                creates a table — a{" "}
                <code className="text-accent">defaultExpression</code> is not
                included, so supply the default in the migration if the database
                itself must apply it.
              </p>
            </section>
          </div>
    </div>
  )
}
