"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function AggregatesApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Aggregates API</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Count, sum, average, min and max on the Repository and the
            QueryBuilder
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">count()</h2>
              <CodeBlock
                language="typescript"
                code={`async count(conditions?: Partial<T>): Promise<number>`}
              />
              <p className="text-muted-foreground mb-4">
                Counts rows, excluding soft-deleted ones.
              </p>
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    conditions
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Optional partial object of column values to match.
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/count.ts"
                language="typescript"
                code={`const n = await repo.count({ status: "active" });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">countDistinct()</h2>
              <CodeBlock
                language="typescript"
                code={`async countDistinct(column: string): Promise<number>`}
              />
              <p className="text-muted-foreground mb-4">
                Counts distinct values of a column. This exists on the{" "}
                <strong>Repository only</strong> — there is no{" "}
                <code>countDistinct()</code> on the QueryBuilder. To do it on a
                builder, select{" "}
                <code>COUNT(DISTINCT col) AS __cnt</code> yourself.
              </p>
              <CodeBlock
                filename="example/count-distinct.ts"
                language="typescript"
                code={`const countries = await repo.countDistinct("country");`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">aggregate()</h2>
              <CodeBlock
                language="typescript"
                code={`async aggregate(options: {
  count?: string | string[];
  sum?: string[];
  avg?: string[];
  min?: string[];
  max?: string[];
}): Promise<Record<string, any>>`}
              />
              <p className="text-muted-foreground mb-4">
                Runs every requested aggregate in a single query. This is the
                only place to compute <code>sum</code>, <code>avg</code>,{" "}
                <code>min</code> and <code>max</code> from a Repository.
              </p>
              <h3 className="font-semibold mb-2">Options:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    count
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    One column name or an array of them. <code>&quot;*&quot;</code>{" "}
                    counts all rows.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    sum
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Array of columns to sum.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    avg
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Array of columns to average.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    min
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Array of columns to take the minimum of.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    max
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Array of columns to take the maximum of.
                  </span>
                </li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Result keys are built from the aggregate and the column name:
              </p>
              <CodeBlock
                language="typescript"
                code={`count_all      // when you pass "*"
count_<col>
sum_<col>
avg_<col>
min_<col>
max_<col>`}
              />
              <CodeBlock
                filename="example/aggregate.ts"
                language="typescript"
                code={`const stats = await repo.aggregate({
  count: "*",
  sum: ["amount"],
  avg: ["amount"],
  min: ["amount"],
  max: ["amount"],
});
// { count_all: 42, sum_amount: 1980, avg_amount: 47.1, min_amount: 3, max_amount: 210 }`}
              />
              <CodeBlock
                filename="example/aggregate-grouped.ts"
                language="typescript"
                code={`const perStatus = await repo.aggregate({
  count: ["status", "region"],
});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                QueryBuilder aggregates
              </h2>
              <CodeBlock
                language="typescript"
                code={`count(column: string = "*", alias: string = "count"): QueryBuilder<T>
sum(column: string, alias: string = "sum"): QueryBuilder<T>
avg(column: string, alias: string = "avg"): QueryBuilder<T>
min(column: string, alias: string = "min"): QueryBuilder<T>
max(column: string, alias: string = "max"): QueryBuilder<T>`}
              />
              <p className="text-muted-foreground mb-4">
                Every method is chainable and returns the same{" "}
                <code>QueryBuilder&lt;T&gt;</code>, so aggregates compose with
                filters. Run the builder with <code>.execute(client)</code>.
              </p>
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    column
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Column to aggregate. <code>count()</code> defaults to{" "}
                    <code>&quot;*&quot;</code>; the others have no default.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    alias
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Output key for the value. Defaults are{" "}
                    <code>&quot;count&quot;</code>, <code>&quot;sum&quot;</code>,{" "}
                    <code>&quot;avg&quot;</code>, <code>&quot;min&quot;</code>{" "}
                    and <code>&quot;max&quot;</code>.
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/query-builder-aggregates.ts"
                language="typescript"
                code={`const rows = await repo
  .find()
  .where("status = ?", "paid")
  .sum("amount", "total")
  .execute(orm.client);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                countExec() / existsExec()
              </h2>
              <CodeBlock
                language="typescript"
                code={`async countExec(client: DBClient): Promise<number>
async existsExec(client: DBClient): Promise<boolean>`}
              />
              <p className="text-muted-foreground mb-4">
                Terminal helpers on the QueryBuilder that execute immediately
                against a client instead of returning a builder.
              </p>
              <CodeBlock
                filename="example/exec-helpers.ts"
                language="typescript"
                code={`const total = await repo.find().countExec(orm.client);
const any = await repo.find().where("status = ?", "active").existsExec(orm.client);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Repository or QueryBuilder?
              </h2>
              <p className="text-muted-foreground mb-4">
                There are no <code>sum()</code>, <code>avg()</code>,{" "}
                <code>min()</code> or <code>max()</code> methods on the
                Repository — those exist only on the QueryBuilder. On a
                repository, use <code>aggregate()</code> instead.
              </p>
              <CodeBlock
                language="typescript"
                code={`// count and countDistinct exist on both
await repo.count();
await repo.countDistinct("country");
await repo.find().count().execute(orm.client);

// sum/avg/min/max: QueryBuilder only
await repo.find().sum("amount").execute(orm.client);

// on the Repository, use aggregate()
await repo.aggregate({ sum: ["amount"] });`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
