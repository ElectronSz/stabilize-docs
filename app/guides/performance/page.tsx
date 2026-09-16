"use client";

import { CodeBlock } from "@/components/code-block";
import { Zap } from "lucide-react";

export default function PerformancePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-10 w-10 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Performance Optimization
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Tips and techniques for optimizing query performance in Stabilize ORM
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              1. Use Selective Field Loading
            </h2>
            <p className="text-muted-foreground mb-4">
              Only load the fields you need. Every column you fetch is a column
              the driver has to read, decode and hand back:
            </p>
            <CodeBlock
              language="typescript"
              code={`// Loads all columns
const users = await userRepo.find().execute(orm.client);

// Only load needed fields
const users = await userRepo
  .find()
  .select("id", "email", "name")
  .execute(orm.client);

// Or use selectColumns on the repository (no client argument)
const partial = await userRepo.selectColumns("id", "email");

// A single column, as a plain array of values
const emails = await userRepo.pluck("email");`}
            />
            <p className="text-muted-foreground mt-4">
              <code>selectColumns()</code> returns{" "}
              <code>Partial&lt;T&gt;[]</code> — the rows are real objects with
              only the named keys, so a field you forgot to select is{" "}
              <code>undefined</code> rather than an error. Save{" "}
              <code>pluck()</code> for the one-column case.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Pagination</h2>
            <p className="text-muted-foreground mb-4">
              Never load all records at once:
            </p>
            <CodeBlock
              language="typescript"
              code={`// Built-in pagination
const page = await userRepo.paginate(1, 20);

// Or use query builder
const results = await userRepo.find()
  .limit(20)
  .offset(20)
  .execute(orm.client);

// Cursor-based pagination for large datasets
const results = await userRepo.findMany({
  take: 20,
  orderBy: { field: "id", direction: "ASC" },
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              3. Optimize Relationship Loading
            </h2>
            <p className="text-muted-foreground mb-4">
              Working with related rows is where N+1 queries appear. Ask for the
              relations you need in the same call instead of looping:
            </p>
            <CodeBlock
              language="typescript"
              code={`// Bad: one extra query per user
const users = await userRepo.find().execute(orm.client);
for (const user of users) {
  const posts = await postRepo.find().where("userId = ?", user.id).execute(orm.client);
}

// Good: one batched query for the whole relation
const users = await userRepo.find().withRelations("posts").execute(orm.client);

// Good: the same option on the finders that take one
const user = await userRepo.findOne(id, { relations: ["posts"] });
const admins = await userRepo.findBy({ role: "admin" }, { relations: ["posts"] });
const paged = await userRepo.findAndCount({ relations: ["posts"] });
const many = await userRepo.findMany({ take: 20, relations: ["posts"] });

// Nested paths work too; "posts" is read once and shared
const thread = await userRepo.find()
  .withRelations("posts.comments", "posts.tags")
  .execute(orm.client);`}
            />
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">
                Relations are loaded per call, not configured once
              </p>
              <p className="text-sm text-muted-foreground">
                There is no model-level eager-loading setting and no join
                strategy to choose from. Each relation you ask for is loaded
                with one additional batched query —{" "}
                <code>IN (…)</code> against the parent keys — and paths that
                share a first segment are grouped so the parent relation is read
                once. That removes the N+1 within a result set, but it does not
                remove it across the codebase: a lazy accessor that fetches a
                relation per row later on is still N+1, and still yours to
                avoid. Request the relation up front, or load it in one query
                for the whole set.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              4. Use Indexes Strategically
            </h2>
            <p className="text-muted-foreground mb-4">
              Index the columns you filter, join and sort on — and not much
              else, since every index is extra work on each write. A column
              takes an <code>index</code> option whose value is the index name,{" "}
              and <code>unique: true</code> creates an index of its own:
            </p>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true },
    // unique creates <table>_<column>_uniq, so no index name is needed
    email: { type: DataTypes.STRING, unique: true, required: true },
    // index takes the name of the index to create
    status: { type: DataTypes.STRING, index: "idx_users_status" },
    createdAt: { type: DataTypes.DATETIME, index: "idx_users_created_at" },
  },
});

// autoMigrate creates any index that is missing. It is additive: it adds
// indexes and columns, and never drops either.
await orm.autoMigrate(User);`}
            />
            <p className="text-muted-foreground mt-4">
              Indexes only exist once <code>autoMigrate()</code> has run against
              the table, so a model change needs that step deployed too. A
              composite index on the leading columns of your most common{" "}
              <code>WHERE ... ORDER BY</code> pair is usually worth more than
              several single-column indexes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Enable Caching</h2>
            <p className="text-muted-foreground mb-4">
              Read-heavy workloads benefit most from a cache in front of the
              database. It is the second constructor argument:
            </p>
            <CodeBlock
              language="typescript"
              code={`const orm = new Stabilize(
  dbConfig,
  { enabled: true, ttl: 300, redisUrl: process.env.REDIS_URL, strategy: "cache-aside" }
);

// Check cache stats
const stats = await orm.getCacheStats();
console.log("Hit ratio:", stats.hits / (stats.hits + stats.misses) * 100);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Use Bulk Operations</h2>
            <p className="text-muted-foreground mb-4">
              Batch individual statements into one round trip:
            </p>
            <CodeBlock
              language="typescript"
              code={`// Bad: Multiple individual inserts
for (const user of users) {
  await userRepo.create(user);
}

// Good: Single bulk insert
await userRepo.bulkCreate(users, { batchSize: 1000 });

// Bulk update
await userRepo.bulkUpdate([...]);

// Bulk upsert, keyed on one or more columns
await userRepo.bulkUpsert(users, ["email"]);`}
            />
            <p className="text-muted-foreground mt-4">
              Each bulk method runs its work inside a transaction it opens
              itself, so a failure part-way through does not leave half the
              batch committed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              7. Optimize Query Conditions
            </h2>
            <p className="text-muted-foreground mb-4">
              A predicate has to be written the way the index is stored for the
              index to be usable at all:
            </p>
            <CodeBlock
              language="typescript"
              code={`// Bad: leading wildcard, so no index can be used
const users = await userRepo.find()
  .where("email LIKE ?", "%@example.com")
  .execute(orm.client);

// Good: a trailing wildcard can use an index on email
const users = await userRepo.find()
  .where("email LIKE ?", "ciniso%@example.com")
  .execute(orm.client);

// Bad: multiple OR branches on the same column
await userRepo.find()
  .where("status = ?", "active")
  .orWhere("status = ?", "pending")
  .execute(orm.client);

// Good: a single IN predicate
await userRepo.find()
  .whereIn("status", ["active", "pending"])
  .execute(orm.client);`}
            />
            <p className="text-muted-foreground mt-4">
              The same rule covers expressions: wrapping a column in a function
              (<code>WHERE LOWER(email) = ?</code>, <code>WHERE DATE(createdAt) = ?</code>
              ) hides it from the index. Store the value in the form you query
              it, or index the expression. <code>whereIn()</code> with an empty
              array is short-circuited to a false predicate rather than
              generating invalid SQL.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              8. Use Transactions Wisely
            </h2>
            <p className="text-muted-foreground mb-4">
              Group related writes in a transaction, but keep them short — an
              open transaction holds locks and a connection:
            </p>
            <CodeBlock
              language="typescript"
              code={`// Good: short, focused transaction
await orm.transaction(async (txClient) => {
  const user = await userRepo.create({ email: "ciniso@example.com" }, {}, txClient);
  await profileRepo.create({ userId: user.id, bio: "..." }, {}, txClient);
});

// Bad: doing slow work inside the transaction
await orm.transaction(async (txClient) => {
  const user = await userRepo.create({ email: "ciniso@example.com" }, {}, txClient);
  await sendWelcomeEmail(user.email); // third-party call - do it after commit
  await profileRepo.create({ userId: user.id }, {}, txClient);
});`}
            />
            <p className="text-muted-foreground mt-4">
              <code>transaction()</code> takes one argument — the callback — and
              no isolation level. A nested call reuses the outer transaction
              rather than opening a second one, so there are no savepoints and
              no partial rollback: a throw anywhere rolls back everything. Worth
              knowing while tuning: <code>create()</code>,{" "}
              <code>update()</code>, <code>delete()</code>,{" "}
              <code>bulkCreate()</code> and <code>bulkUpsert()</code> each open
              a transaction internally already, so wrapping a single write in
              your own is a no-op — the extra transaction is only worth it when
              several writes must succeed together.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              9. Monitor Query Performance
            </h2>
            <p className="text-muted-foreground mb-4">
              Measure before you tune. The logger is the third constructor
              argument, and query text, bound parameters and execution time are
              written through it:
            </p>
            <CodeBlock
              filename="db.ts"
              language="typescript"
              code={`import { Stabilize, LogLevel, type LoggerConfig } from "stabilize-orm";

const loggerConfig: LoggerConfig = {
  level: LogLevel.Debug,
  filePath: "logs/stabilize.log",
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 3,
};

export const orm = new Stabilize(dbConfig, { enabled: false, ttl: 60 }, loggerConfig);`}
            />
            <p className="text-muted-foreground my-4">
              Two more probes answer the coarse questions — is the pool
              saturating, and is the database reachable at all? They return
              different shapes, so do not treat one as the other:
            </p>
            <CodeBlock
              filename="health.ts"
              language="typescript"
              code={`// ORM level: reachability, measured by running "SELECT 1"
const ormHealth = await orm.healthCheck();
// { status, database, latencyMs, cacheStatus }

// Repository level: counts the model's rows
const repoHealth = await userRepo.healthCheck();
// { status, table, rows, latencyMs }  <- note "rows", not "cacheStatus"

// Pool numbers
const { active, idle, total } = await orm.poolStats();`}
            />
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">
                Read poolStats() with care
              </p>
              <p className="text-sm text-muted-foreground">
                <code>orm.poolStats()</code> returns{" "}
                <code>{"{ active, idle, total }"}</code>, but only the SQL
                Server branch reads a real pool. On PostgreSQL, MySQL and SQLite
                the call reports <code>-1</code> sentinels — treat{" "}
                <code>-1</code> as &quot;not measured&quot;, not as an empty
                pool, and do not build alerting on{" "}
                <code>total &gt; 0</code>. Both <code>healthCheck()</code>{" "}
                methods swallow the underlying error and report{" "}
                <code>status: &quot;unhealthy&quot;</code> — that is a useful liveness
                signal and a poor place to read the cause; check the log for
                that. And keep in mind that the logger&apos;s level filter
                admits <code>Debug</code> messages even at the default{" "}
                <code>Info</code> level, so statement logging is on by default:
                give it a <code>filePath</code> if you want the history, and
                measure what it costs before leaving it in a hot path.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Use Query Scopes</h2>
            <p className="text-muted-foreground mb-4">
              A scope is a named, reusable filter that returns the query builder
              it was handed, so scopes chain with each other and with the rest
              of the builder API:
            </p>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`const User = defineModel({
  tableName: "users",
  columns: { /* ... */ },
  scopes: {
    active: (qb) => qb.where("isActive = ?", true),
    recent: (qb, days: number) => qb.where(
      "createdAt >= ?",
      new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    ),
  },
});

// repository.scope() starts from find() and returns a QueryBuilder
const recentActive = await userRepo
  .scope("active")
  .scope("recent", 7)
  .execute(orm.client);

// The builder has scope() too, so a scope composes with a live query
const admins = await userRepo
  .find()
  .scope("active")
  .where("role = ?", "admin")
  .execute(orm.client);`}
            />
            <p className="text-muted-foreground mt-4">
              Arguments after the scope name are passed straight through to the
              scope function. An unknown scope name throws{" "}
              <code>SCOPE_ERROR</code> rather than being ignored, so a typo
              surfaces at the call site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              11. Use EXISTS Instead of COUNT
            </h2>
            <CodeBlock
              language="typescript"
              code={`// Bad: Counts all matching rows
const count = await userRepo.count({ role: "admin" });
if (count > 0) { ... }

// Good: Stops at first match
const exists = await userRepo.exists({ role: "admin" });
if (exists) { ... }`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              12. Use Pluck for Single Columns
            </h2>
            <CodeBlock
              language="typescript"
              code={`// Bad: Loads full objects
const users = await userRepo.find().execute(orm.client);
const emails = users.map(u => u.email);

// Good: Only fetches the column
const emails = await userRepo.pluck("email");`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Performance Checklist</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                Use <code>select()</code> or <code>selectColumns()</code> to
                load only needed columns
              </li>
              <li>Paginate large result sets</li>
              <li>
                Request relations with <code>withRelations()</code> instead of
                querying per row
              </li>
              <li>
                Index the columns you filter, join and sort on; run{" "}
                <code>autoMigrate()</code> to create them
              </li>
              <li>
                Enable caching for read-heavy workloads — Redis when{" "}
                <code>redisUrl</code> is set, otherwise the in-process backend,
                which is per-process and lost on restart
              </li>
              <li>
                Use <code>bulkCreate()</code> for multiple inserts
              </li>
              <li>
                Avoid leading wildcards and functions around indexed columns
              </li>
              <li>
                Use <code>whereIn()</code> instead of multiple{" "}
                <code>orWhere()</code>
              </li>
              <li>Keep transactions short and focused</li>
              <li>
                Log slow queries with a <code>LoggerConfig</code>, and check{" "}
                <code>poolStats()</code> and <code>healthCheck()</code> with
                their caveats in mind
              </li>
              <li>Define scopes for common query patterns</li>
              <li>
                Use <code>exists()</code> instead of <code>count()</code> for
                presence checks
              </li>
              <li>
                Use <code>pluck()</code> for single-column fetches
              </li>
              <li>
                Use <code>increment()</code>/<code>decrement()</code> for atomic
                counter updates
              </li>
            </ul>
          </section>
        </div>
    </div>
  );
}
