"use client"

import { CodeBlock } from "@/components/code-block"

export default function AggregatesPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-4">Aggregates</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Count, sum, average, min and max without loading rows into memory.{" "}
            <br />
            The database does the arithmetic; you get the number back.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Counting</h2>
              <CodeBlock
                filename="count.ts"
                language="typescript"
                code={`await repo.count();                     // all rows
await repo.count({ status: "active" });  // matching rows
await repo.countDistinct("email");       // distinct values in a column`}
              />
              <p className="text-muted-foreground mt-4">
                Soft-deleted rows are excluded from all three, the same way they
                are excluded from a normal find.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">aggregate()</h2>
              <p className="text-muted-foreground mb-4">
                This is the single entry point for{" "}
                <code className="text-accent">sum</code>,{" "}
                <code className="text-accent">avg</code>,{" "}
                <code className="text-accent">min</code>,{" "}
                <code className="text-accent">max</code> and{" "}
                <code className="text-accent">count</code>. Each key takes an
                array of columns and every result comes back in one flat object,
                keyed{" "}
                <code className="text-accent">
                  {"<fn>_<column>"}
                </code>
                .
              </p>
              <CodeBlock
                filename="aggregate.ts"
                language="typescript"
                code={`const stats = await repo.aggregate({
  count: ["*", "status"],
  sum: ["amount"],
  avg: ["amount"],
  min: ["amount"],
  max: ["amount"],
});

// {
//   count_all: 42,
//   count_status: 42,
//   sum_amount: 100,
//   avg_amount: 33.3,
//   min_amount: 10,
//   max_amount: 60
// }`}
              />
              <p className="text-muted-foreground mt-4">
                Count a star with the string{" "}
                <code className="text-accent">&quot;*&quot;</code>; the key
                becomes <code className="text-accent">count_all</code> rather
                than the unusable{" "}
                <code className="text-accent">count_*</code>. Every aggregate
                runs in a single query, so adding more columns costs nothing
                extra in round trips.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">On the Query Builder</h2>
              <p className="text-muted-foreground mb-4">
                The builder offers each function directly. All five are
                chainable and return a{" "}
                <code className="text-accent">QueryBuilder</code>, so you run
                them with <code className="text-accent">execute()</code> and get
                an array of rows back:
              </p>
              <CodeBlock
                filename="builder.ts"
                language="typescript"
                code={`const rows = await repo.find().sum("amount", "total").execute(db.client);
// [{ total: 100 }]

const totals = await repo
  .find()
  .where("status = ?", "paid")
  .count("id", "orders")
  .sum("amount", "revenue")
  .avg("amount", "average")
  .execute(db.client);
// [{ orders: 42, revenue: 100, average: 2.38 }]`}
              />
              <p className="text-muted-foreground mt-4 mb-4">
                Each takes an optional alias as the second argument —{" "}
                <code className="text-accent">count</code>,{" "}
                <code className="text-accent">sum</code>,{" "}
                <code className="text-accent">avg</code>,{" "}
                <code className="text-accent">min</code> and{" "}
                <code className="text-accent">max</code> respectively. For a bare
                count or existence check, skip the row fetch entirely:
              </p>
              <CodeBlock
                filename="exec.ts"
                language="typescript"
                code={`const total = await repo.find().where("active = ?", true).countExec(db.client);
// => number

const any = await repo.find().where("email = ?", email).existsExec(db.client);
// => boolean`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Getting the SQL</h2>
              <p className="text-muted-foreground mb-4">
                Any builder can be rendered to SQL without running it, which is
                the quickest way to check what an aggregate will actually do:
              </p>
              <CodeBlock
                filename="tosql.ts"
                language="typescript"
                code={`const { query, params } = repo
  .find()
  .where("status = ?", "paid")
  .sum("amount", "revenue")
  .toSQL();

console.log(query);   // SELECT SUM(amount) AS revenue FROM orders WHERE status = ?
console.log(params);  // ["paid"]`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
              <CodeBlock
                filename="api.ts"
                language="typescript"
                code={`// Repository
count(conditions?: Partial<T>): Promise<number>
countDistinct(column: string): Promise<number>
aggregate(options: {
  count?: string | string[];
  sum?: string[];
  avg?: string[];
  min?: string[];
  max?: string[];
}): Promise<Record<string, any>>

// QueryBuilder - all chainable
count(column = "*", alias = "count"): QueryBuilder<T>
sum(column: string, alias = "sum"): QueryBuilder<T>
avg(column: string, alias = "avg"): QueryBuilder<T>
min(column: string, alias = "min"): QueryBuilder<T>
max(column: string, alias = "max"): QueryBuilder<T>
countExec(client: DBClient): Promise<number>
existsExec(client: DBClient): Promise<boolean>`}
              />
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">
                  sum/avg/min/max are builder-only
                </p>
                <p className="text-sm text-muted-foreground">
                  There are no <code>repo.sum()</code> /{" "}
                  <code>repo.avg()</code> methods. On a repository use{" "}
                  <code>aggregate()</code>; on a builder use the chainable
                  methods. <code>count</code> and{" "}
                  <code>countDistinct</code> exist on both.
                </p>
              </div>
            </section>
          </div>
    </div>
  )
}
