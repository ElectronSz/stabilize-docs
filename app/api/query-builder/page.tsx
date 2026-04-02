"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
              code={`whereBetween(column: string, min: any, max: any): QueryBuilder<T>
whereLike(column: string, pattern: string): QueryBuilder<T>`}
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
              code={`groupBy(...clauses: string[]): QueryBuilder<T>
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
              code={`limit(count: number): QueryBuilder<T>
offset(count: number): QueryBuilder<T>
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
            <h2 className="text-2xl font-semibold mb-4">build() / execute()</h2>
            <CodeBlock
              language="typescript"
              code={`build(): { query: string; params: any[] }
async execute(client: DBClient, cache?: Cache, cacheKey?: string): Promise<T[]>`}
            />
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
