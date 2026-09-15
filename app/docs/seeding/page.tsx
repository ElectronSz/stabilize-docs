import { CodeBlock } from "@/components/code-block";

export default function SeedingPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Database Seeding
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Populate your database with test or initial data
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              There are two seeding mechanisms in Stabilize, and they are not
              interchangeable. Pick one and stay with it:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-accent/30">
                    <th className="text-left py-2 pr-4 font-semibold"></th>
                    <th className="text-left py-2 pr-4 font-semibold">
                      CLI seed files
                    </th>
                    <th className="text-left py-2 font-semibold">
                      Programmatic seeds
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-accent/10">
                    <td className="py-2 pr-4">Defined with</td>
                    <td className="py-2 pr-4">
                      a <code>seeds/*.ts</code> file exporting{" "}
                      <code>seed(orm)</code>
                    </td>
                    <td className="py-2">
                      <code>defineSeed(name, run)</code>
                    </td>
                  </tr>
                  <tr className="border-b border-accent/10">
                    <td className="py-2 pr-4">Run with</td>
                    <td className="py-2 pr-4">
                      <code>stabilize-cli seed</code>
                    </td>
                    <td className="py-2">
                      <code>orm.seed()</code> /{" "}
                      <code>orm.seed([...])</code>
                    </td>
                  </tr>
                  <tr className="border-b border-accent/10">
                    <td className="py-2 pr-4">Callback receives</td>
                    <td className="py-2 pr-4">
                      the <code>Stabilize</code> instance
                    </td>
                    <td className="py-2">
                      a <code>DBClient</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Tracked in a table</td>
                    <td className="py-2 pr-4">
                      yes — <code>stabilize_seed_history</code>
                    </td>
                    <td className="py-2">no — it runs every time</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">
                The two conventions are incompatible
              </p>
              <p className="text-sm text-muted-foreground">
                A CLI-generated seed file takes a <code>Stabilize</code> and
                calls <code>orm.getRepository(Model)</code>. A{" "}
                <code>defineSeed</code> callback takes a{" "}
                <code>DBClient</code> — which has{" "}
                <code>query</code>, <code>queryExec</code>,{" "}
                <code>transaction</code> and <code>close</code>, and{" "}
                <strong>no</strong> <code>getRepository</code>. Handing a
                CLI-style seed to <code>orm.seed()</code>, or a{" "}
                <code>defineSeed</code> callback to the CLI, fails with{" "}
                <code>getRepository is not a function</code> (or the reverse).
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">CLI Seed Files</h2>
            <p className="text-muted-foreground mb-4">
              Generate a starter seed file for a model, then run every pending
              one:
            </p>
            <CodeBlock
              code={`# Write seeds/<timestamp>_seed_User.ts with 10 example rows
bunx stabilize-cli generate:seed User --count 10

# Run every seed file not yet recorded in stabilize_seed_history
bunx stabilize-cli seed`}
              language="bash"
            />
            <p className="text-muted-foreground mt-4">
              The generated file exports a single{" "}
              <code>seed(orm: Stabilize)</code> function:
            </p>
            <CodeBlock
              filename="seeds/20260402163905_seed_User.ts"
              language="typescript"
              code={`import { Stabilize, generateUUID } from "stabilize-orm";
import { User } from "../models/User";

export async function seed(orm: Stabilize) {
  const repo = orm.getRepository(User);

  await repo.bulkCreate([
    { id: generateUUID(), email: "admin@example.com", name: "Admin", role: "admin" },
    { id: generateUUID(), email: "alice@example.com", name: "Alice", role: "user" },
    { id: generateUUID(), email: "bob@example.com", name: "Bob", role: "user" },
  ]);

  console.log("Seeded 3 User(s)");
}`}
            />
            <p className="text-muted-foreground mt-4">
              Note there is no <code>rollback</code> export — the CLI has no
              command that calls one, so writing one simply has no effect. To
              undo a seed, truncate the table (see below).
            </p>
            <p className="text-muted-foreground mt-4">
              The CLI keeps its own ledger, so running{" "}
              <code>stabilize-cli seed</code> twice applies nothing the second
              time. The key is the <strong>file name</strong>: a seed is recorded
              as applied under{" "}
              <code>basename(file, &quot;.ts&quot;)</code>, and everything already
              in <code>stabilize_seed_history</code> is filtered out before the
              run. Renaming a seed file makes it run again; editing one does not.
            </p>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">
                CLI seeding does not support SQL Server
              </p>
              <p className="text-sm text-muted-foreground">
                <code>stabilize-cli seed</code> creates{" "}
                <code>stabilize_seed_history</code> with one of three hand-written
                statements — MySQL, Postgres, or a combined default. SQL Server
                falls into the default and is sent{" "}
                <code>CREATE TABLE IF NOT EXISTS</code>, which T-SQL rejects. Use
                the programmatic seeds below on an SQL Server target.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Programmatic Seeds</h2>
            <p className="text-muted-foreground mb-4">
              <code>defineSeed</code> registers a named seed;{" "}
              <code>orm.seed()</code> runs the registered ones, or a list you
              pass it.
            </p>
            <CodeBlock
              filename="seeds/index.ts"
              language="typescript"
              code={`import { defineSeed } from "stabilize-orm";

defineSeed("seed users", async (db) => {
  // \`db\` is a DBClient, not the ORM. Query it directly...
  await db.query(
    "INSERT INTO users (id, email, name) VALUES (?, ?, ?)",
    [generateUUID(), "admin@example.com", "Admin"],
  );

  // ...or wrap the work in a transaction.
  await db.transaction(async (tx) => {
    for (const row of rows) {
      await tx.query(
        "INSERT INTO users (id, email, name) VALUES (?, ?, ?)",
        [row.id, row.email, row.name],
      );
    }
  });
});

// Placeholders are always \`?\` — the client rewrites them per dialect.`}
            />
            <CodeBlock
              filename="seed-runner.ts"
              language="typescript"
              code={`import "./seeds/index";
import { orm } from "./db";

await orm.seed();                    // every registered seed

// Or run a specific list, ignoring the registry:
await orm.seed([
  { name: "one-off", run: async (db) => { /* ... */ } },
]);`}
            />
            <p className="text-muted-foreground mt-4">
              Registration order is execution order, and seeds run{" "}
              <strong>sequentially</strong> — each is awaited before the next
              starts, so a seed may rely on the one before it. Nothing is recorded
              in a table, so a seed registered and run twice does its work twice.
              Guard it yourself if that matters.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Resetting the Database
            </h2>
            <p className="text-muted-foreground mb-4">
              <code>orm.reset(models)</code> drops each model&apos;s table and
              its history table, then runs <code>autoMigrate</code> to recreate
              them empty — the natural counterpart to a seed run in a test
              harness. Missing tables are ignored, so it is safe on a fresh
              database.
            </p>
            <CodeBlock
              filename="reset.ts"
              language="typescript"
              code={`import { orm } from "./db";

await orm.reset([User, Profile, Post]);
await orm.seed();          // now re-seed from scratch`}
            />
            <p className="text-muted-foreground mt-4">
              This is destructive and there is no confirmation. Note that it
              drops the tables it is given rather than emptying them, so any
              table not named is left alone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Repository bulkCreate()
            </h2>
            <p className="text-muted-foreground mb-4">
              Both mechanisms above ultimately lean on the same write.{" "}
              <code>bulkCreate()</code> inserts a list in{" "}
              <strong>one transaction</strong>, and runs{" "}
              <code>beforeCreate</code> and <code>beforeSave</code> hooks for
              each row before the insert.
            </p>
            <CodeBlock
              filename="bulk-create.ts"
              language="typescript"
              code={`await userRepo.bulkCreate(rows);                        // T[]
await userRepo.bulkCreate(rows, { batchSize: 500 });    // chunked insert`}
            />
            <p className="text-muted-foreground mt-4">
              Because it is one transaction, a single bad row takes the whole
              batch with it — there is no partial insert to reconcile.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Repository seed()</h2>
            <p className="text-muted-foreground mb-4">
              A repository also has a <code>seed()</code> method, but be careful
              with it:
            </p>
            <CodeBlock
              filename="examples/seed.ts"
              language="typescript"
              code={`const userRepo = orm.getRepository(User);

const rows = await userRepo.seed([
  { id: generateUUID(), email: "admin@example.com", name: "Admin" },
  { id: generateUUID(), email: "user@example.com", name: "User" },
], { ignoreDuplicates: true });`}
            />
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">
                ignoreDuplicates is table-wide, not row-wide
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                The name suggests per-record deduplication, in the manner of
                MySQL&apos;s <code>INSERT IGNORE</code>. It is not. The
                implementation is: read every row in the table, and if that read
                returned <em>anything at all</em>, return those rows and insert
                nothing.
              </p>
              <CodeBlock
                language="typescript"
                code={`// What seed() actually does, in full:
const existing = await this.find().execute(client);
if (existing.length > 0 && options.ignoreDuplicates) return existing;
return this.bulkCreate(data, {}, client);`}
              />
              <p className="text-sm text-muted-foreground mt-3">
                Two consequences. First, once a table holds <em>one</em> row —
                from a previous seed, or a real user signing up — a later{" "}
                <code>seed(..., {"{ ignoreDuplicates: true }"})</code> is a no-op
                and inserts none of your data. Second, the array it returns is the
                rows already in the table, <strong>not the rows you passed</strong>
                , so assigning the result and using it will silently give you the
                wrong records. With no rows present, or with{" "}
                <code>ignoreDuplicates</code> left off, it inserts normally.
              </p>
            </div>
            <p className="text-muted-foreground mt-4">
              For predictable behaviour, prefer <code>bulkCreate()</code> with an
              explicit existence check, or <code>firstOrCreate()</code> per record.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                Keep seed files idempotent — the CLI ledger protects you against
                re-running an unchanged file, but not against a file whose data
                already exists by another route
              </li>
              <li>
                Give generated <code>id</code> values explicitly when the model
                uses a UUID or STRING id; only an integer <code>id</code> is
                generated by the database
              </li>
              <li>
                Use <code>bulkCreate()</code> rather than a loop of{" "}
                <code>create()</code> — one transaction instead of N
              </li>
              <li>
                Separate development and production seeds; nothing in the
                mechanism distinguishes them
              </li>
              <li>
                Remember a seed survives{" "}
                <code>orm.reset()</code> only if you run it again afterwards
              </li>
            </ul>
          </section>
        </div>
    </div>
  );
}
