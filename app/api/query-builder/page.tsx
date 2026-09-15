"use client";

import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";

export default function QueryBuilderApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Query Builder API</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Fluent API for building complex database queries
        </p>

        <div className="space-y-8">
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">select()</h2>
            <CodeBlock
              language="typescript"
              code={`select(...fields: string[]): QueryBuilder<T>`}
            />
            <p className="text-muted-foreground mb-4">
              Specifies columns to select. Defaults to <code>*</code>.
            </p>
            <CodeBlock
              language="typescript"
              code={`await repo.find().select("id", "name", "email").execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">where()</h2>
            <CodeBlock
              language="typescript"
              code={`where(condition: string, ...params: any[]): QueryBuilder<T>`}
            />
            <p className="text-muted-foreground mb-4">
              Adds a WHERE clause. Multiple calls join with AND.
            </p>
            <CodeBlock
              language="typescript"
              code={`await repo.find().where("age > ?", 18).where("isActive = ?", true).execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">orWhere()</h2>
            <CodeBlock
              language="typescript"
              code={`orWhere(condition: string, ...params: any[]): QueryBuilder<T>`}
            />
            <p className="text-muted-foreground mb-4">
              Adds an OR WHERE clause.
            </p>
            <CodeBlock
              language="typescript"
              code={`await repo.find().where("role = ?", "admin").orWhere("role = ?", "moderator").execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              whereIn() / whereNotIn()
            </h2>
            <CodeBlock
              language="typescript"
              code={`whereIn(column: string, values: any[]): QueryBuilder<T>
whereNotIn(column: string, values: any[]): QueryBuilder<T>`}
            />
            <CodeBlock
              language="typescript"
              code={`await repo.find().whereIn("status", ["active", "pending"]).execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              whereNull() / whereNotNull()
            </h2>
            <CodeBlock
              language="typescript"
              code={`whereNull(column: string): QueryBuilder<T>
whereNotNull(column: string): QueryBuilder<T>`}
            />
            <CodeBlock
              language="typescript"
              code={`await repo.find().whereNotNull("email").execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              whereBetween() / whereLike()
            </h2>
            <CodeBlock
              language="typescript"
              code={`whereBetween(column: string, start: any, end: any): QueryBuilder<T>
whereNotBetween(column: string, start: any, end: any): QueryBuilder<T>
whereLike(column: string, pattern: string): QueryBuilder<T>
whereILike(column: string, pattern: string): QueryBuilder<T>`}
            />
            <CodeBlock
              language="typescript"
              code={`await repo.find().whereBetween("age", 18, 65).execute(orm.client);
await repo.find().whereLike("email", "%@example.com").execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">orderBy()</h2>
            <CodeBlock
              language="typescript"
              code={`orderBy(column: string, direction: "ASC" | "DESC" = "ASC"): QueryBuilder<T>`}
            />
            <CodeBlock
              language="typescript"
              code={`await repo.find().orderBy("createdAt", "DESC").execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              orderByRaw() / groupByRaw() / havingRaw()
            </h2>
            <CodeBlock
              language="typescript"
              code={`orderByRaw(expression: string, direction?: "ASC" | "DESC"): QueryBuilder<T>
groupByRaw(expression: string): QueryBuilder<T>
havingRaw(condition: string, ...params: any[]): QueryBuilder<T>`}
            />
            <p className="text-muted-foreground mb-4">
              For expressions rather than column names. Raw and plain clauses
              compose, and raw parameters are bound in the order they appear.
            </p>
            <CodeBlock
              language="typescript"
              code={`await repo.find()
  .select("status", "COUNT(*) AS total")
  .groupByRaw("strftime('%Y-%m', createdAt)")
  .havingRaw("COUNT(*) > ?", 10)
  .orderByRaw("CASE WHEN status = 'urgent' THEN 0 ELSE 1 END")
  .execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">withRelations()</h2>
            <CodeBlock
              language="typescript"
              code={`withRelations(...relations: (string | string[])[]): QueryBuilder<T>
getRelations(): string[]`}
            />
            <p className="text-muted-foreground mb-4">
              Eager-loads relations onto the result, as{" "}
              <code>findOne(id, {"{ relations }"})</code> does. Nested paths use
              dot notation, and the loaded rows are cached with their relations.
            </p>
            <CodeBlock
              language="typescript"
              code={`const users = await repo.find()
  .where("isActive = ?", true)
  .withRelations("roles", "roles.permissions")
  .limit(10)
  .execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              join() / innerJoin() / leftJoin()
            </h2>
            <CodeBlock
              language="typescript"
              code={`join(table: string, condition: string): QueryBuilder<T>
innerJoin(table: string, condition: string): QueryBuilder<T>
leftJoin(table: string, condition: string): QueryBuilder<T>`}
            />
            <CodeBlock
              language="typescript"
              code={`await repo.find().join("users", "posts.authorId = users.id").execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              groupBy() / having()
            </h2>
            <CodeBlock
              language="typescript"
              code={`groupBy(...columns: string[]): QueryBuilder<T>
having(condition: string, ...params: any[]): QueryBuilder<T>`}
            />
            <CodeBlock
              language="typescript"
              code={`await repo.find()
  .select("categoryId", "COUNT(*) as cnt")
  .groupBy("categoryId")
  .having("COUNT(*) > ?", 5)
  .execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              limit() / offset() / paginate()
            </h2>
            <CodeBlock
              language="typescript"
              code={`limit(limit: number): QueryBuilder<T>
offset(offset: number): QueryBuilder<T>
take(count: number): QueryBuilder<T>    // alias of limit
skip(count: number): QueryBuilder<T>    // alias of offset
first(): QueryBuilder<T>                // limit(1), returns the builder
paginate(page: number, pageSize: number): QueryBuilder<T>`}
            />
            <CodeBlock
              language="typescript"
              code={`await repo.find().limit(10).offset(20).execute(orm.client);
await repo.find().paginate(1, 20).execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">scope()</h2>
            <CodeBlock
              language="typescript"
              code={`scope(name: string, ...args: any[]): QueryBuilder<T>`}
            />
            <CodeBlock
              language="typescript"
              code={`await repo.find().scope("active").scope("byRole", "admin").execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Raw &amp; Existence</h2>
            <CodeBlock
              language="typescript"
              code={`whereRaw(rawSql: string, ...params: any[]): QueryBuilder<T>
whereRef(leftCol: string, op: string, rightCol: string): QueryBuilder<T>
whereNot(condition: string, ...params: any[]): QueryBuilder<T>
whereExists(builderOrSql: string | QueryBuilder<any>): QueryBuilder<T>
whereNotExists(builderOrSql: string | QueryBuilder<any>): QueryBuilder<T>`}
            />
            <p className="text-muted-foreground mb-4">
              <code>whereRef()</code> compares two columns instead of a column
              and a bound value. <code>whereExists()</code> accepts a nested
              builder, which is rendered for the dialect the builder was given.
            </p>
            <CodeBlock
              language="typescript"
              code={`await repo.find()
  .whereRef("posts.authorId", "=", "users.id")
  .execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Aggregates &amp; Select
            </h2>
            <CodeBlock
              language="typescript"
              code={`select(...fields: string[]): QueryBuilder<T>
selectRaw(expression: string, ...params: any[]): QueryBuilder<T>
distinct(): QueryBuilder<T>
count(column: string = "*", alias: string = "count"): QueryBuilder<T>
sum(column: string, alias: string = "sum"): QueryBuilder<T>
avg(column: string, alias: string = "avg"): QueryBuilder<T>
min(column: string, alias: string = "min"): QueryBuilder<T>
max(column: string, alias: string = "max"): QueryBuilder<T>`}
            />
            <p className="text-muted-foreground mb-4">
              The aggregate helpers add a column to the SELECT list; they do not
              execute anything. Read the value off the returned row.
            </p>
            <CodeBlock
              language="typescript"
              code={`const [row] = await repo.find().count("id", "total").execute(orm.client);
// row.total

await repo.find().selectRaw("COALESCE(SUM(amount), 0) AS revenue").execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Joins, Locking &amp; Set Operations
            </h2>
            <CodeBlock
              language="typescript"
              code={`fullJoin(table: string, condition: string): QueryBuilder<T>
crossJoin(table: string): QueryBuilder<T>

lock(mode: LockMode = "FOR UPDATE"): QueryBuilder<T>
forUpdate(): QueryBuilder<T>
forShare(): QueryBuilder<T>

union(builder: QueryBuilder<any>): QueryBuilder<T>
unionAll(builder: QueryBuilder<any>): QueryBuilder<T>

with(name: string, builder: QueryBuilder<any>): QueryBuilder<T>
withRecursive(name: string, builder: QueryBuilder<any>): QueryBuilder<T>`}
            />
            <p className="text-muted-foreground mb-4">
              <code>lock()</code> is emitted only for Postgres and MySQL; the
              repository&apos;s <code>lockForUpdate()</code> skips it elsewhere.{" "}
              <code>with()</code> and <code>withRecursive()</code> build CTEs.
            </p>
            <CodeBlock
              language="typescript"
              code={`const sub = new QueryBuilder("posts").select("authorId").where("published = ?", true);

await repo.find().union(sub).execute(orm.client);
await repo.find().forShare().execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Dialect, Aliasing &amp; Cloning
            </h2>
            <CodeBlock
              language="typescript"
              code={`withDialect(dialect: DBType): QueryBuilder<T>
as(alias: string): QueryBuilder<T>
clone(): QueryBuilder<T>
build(dialect?: DBType): { query: string; params: any[] }
toSQL(dialect?: DBType): { query: string; params: any[] }`}
            />
            <p className="text-muted-foreground mb-4">
              <code>clone()</code> copies the builder so it can be reused —
              <code>each()</code> and <code>eachBatch()</code> rely on this to
              page a query without mutating it. <code>toSQL()</code> is an alias
              of <code>build()</code>.
            </p>
            <CodeBlock
              language="typescript"
              code={`const base = repo.find().where("isActive = ?", true);

const { query, params } = base.clone().orderBy("name").toSQL(DBType.Postgres);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">build() / execute()</h2>
            <CodeBlock
              language="typescript"
              code={`build(dialect?: DBType): { query: string; params: any[] }
async execute(client: DBClient, cache?: Cache, cacheKey?: string): Promise<T[]>
async countExec(client: DBClient): Promise<number>
async existsExec(client: DBClient): Promise<boolean>`}
            />
            <p className="text-muted-foreground mb-4">
              <code>execute()</code> stamps the dialect from the client. It
              applies the row transform before writing to the cache and loads
              relations before the cache write, so a cache hit returns the same
              shape as a fresh read. Reads taken inside a transaction are never
              cached. <code>countExec()</code> and <code>existsExec()</code> are
              what the repository&apos;s <code>count()</code> and{" "}
              <code>exists()</code> call.
            </p>
            <CodeBlock
              language="typescript"
              code={`const { query, params } = repo.find().where("id = ?", 1).build();
const results = await repo.find().where("id = ?", 1).execute(orm.client);`}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
