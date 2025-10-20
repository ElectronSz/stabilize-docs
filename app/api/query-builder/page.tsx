"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"

export default function QueryBuilderApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Query Builder API</h1>
        <p className="text-lg text-muted-foreground mb-8">Fluent API for building complex database queries</p>

        <div className="space-y-8">
          {/* Signature */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">QueryBuilder Class</h2>
            <CodeBlock
              filename="query-builder.ts"
              language="typescript"
              code={`export class QueryBuilder<T> {
  private table: string;
  private selectFields: string[] = ["*"];
  private joins: string[] = [];
  private whereConditions: string[] = [];
  private whereParams: any[] = [];
  private orderByClause: string | null = null;
  private limitValue: number | null = null;
  private offsetValue: number | null = null;
  // ...methods...
}`}
            />
          </Card>

          {/* select() */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">select()</h2>
            <CodeBlock code={`select(...fields: string[]): QueryBuilder<T>`} language="typescript" />
            <p className="text-muted-foreground mb-4">Specifies the columns to select. Defaults to <code>*</code>.</p>
            <CodeBlock
              code={`const users = await userRepository
  .find()
  .select("id", "name", "email")
  .where("isActive = ?", true)
  .execute(client);`}
              language="typescript"
            />
          </Card>

          {/* where() */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">where()</h2>
            <CodeBlock code={`where(condition: string, ...params: any[]): QueryBuilder<T>`} language="typescript" />
            <p className="text-muted-foreground mb-4">Adds a WHERE clause to the query. Multiple calls are joined with AND.</p>
            <h3 className="font-semibold mb-2">Parameters:</h3>
            <ul className="space-y-2 mb-4">
              <li>
                <Badge variant="outline" className="mr-2">
                  condition
                </Badge>
                <span className="text-muted-foreground">SQL condition with placeholders (?)</span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  params
                </Badge>
                <span className="text-muted-foreground">Values to replace placeholders</span>
              </li>
            </ul>
            <CodeBlock
              code={`const users = await userRepository
  .find()
  .where("age > ?", 18)
  .where("isActive = ?", true)
  .execute(client);`}
              language="typescript"
            />
          </Card>

          {/* orWhere() */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">orWhere()</h2>
            <CodeBlock code={`orWhere(condition: string, ...params: any[]): QueryBuilder<T>`} language="typescript" />
            <p className="text-muted-foreground mb-4">Adds an OR WHERE clause to the query.</p>
            <CodeBlock
              code={`const users = await userRepository
  .find()
  .where("role = ?", "admin")
  .orWhere("role = ?", "moderator")
  .execute(client);`}
              language="typescript"
            />
          </Card>

          {/* whereIn() */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">whereIn()</h2>
            <CodeBlock code={`whereIn(column: string, values: any[]): QueryBuilder<T>`} language="typescript" />
            <p className="text-muted-foreground mb-4">Adds a WHERE IN clause.</p>
            <CodeBlock
              code={`const users = await userRepository
  .find()
  .whereIn("status", ["active", "pending", "verified"])
  .execute(client);`}
              language="typescript"
            />
          </Card>

          {/* whereLike() */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">whereLike()</h2>
            <CodeBlock code={`whereLike(column: string, pattern: string): QueryBuilder<T>`} language="typescript" />
            <p className="text-muted-foreground mb-4">Adds a WHERE LIKE clause for pattern matching.</p>
            <CodeBlock
              code={`const users = await userRepository
  .find()
  .whereLike("email", "%@example.com")
  .execute(client);`}
              language="typescript"
            />
          </Card>

          {/* whereBetween() */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">whereBetween()</h2>
            <CodeBlock code={`whereBetween(column: string, min: any, max: any): QueryBuilder<T>`} language="typescript" />
            <p className="text-muted-foreground mb-4">Adds a WHERE BETWEEN clause.</p>
            <CodeBlock
              code={`const users = await userRepository
  .find()
  .whereBetween("age", 18, 65)
  .execute(client);`}
              language="typescript"
            />
          </Card>

          {/* orderBy() */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">orderBy()</h2>
            <CodeBlock code={`orderBy(clause: string): QueryBuilder<T>`} language="typescript" />
            <p className="text-muted-foreground mb-4">Adds an ORDER BY clause (pass e.g. <code>"createdAt DESC"</code>).</p>
            <CodeBlock
              code={`const users = await userRepository
  .find()
  .orderBy("createdAt DESC")
  .orderBy("name ASC")
  .execute(client);`}
              language="typescript"
            />
          </Card>

          {/* limit() & offset() */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">limit() & offset()</h2>
            <CodeBlock code={`limit(count: number): QueryBuilder<T>\noffset(count: number): QueryBuilder<T>`} language="typescript" />
            <p className="text-muted-foreground mb-4">
              Limits the number of results and sets the offset for pagination.
            </p>
            <CodeBlock
              code={`const users = await userRepository
  .find()
  .limit(10)
  .offset(20)
  .execute(client);`}
              language="typescript"
            />
          </Card>

          {/* join() */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">join()</h2>
            <CodeBlock code={`join(table: string, condition: string): QueryBuilder<T>`} language="typescript" />
            <p className="text-muted-foreground mb-4">Adds a LEFT JOIN clause.</p>
            <CodeBlock
              code={`const users = await userRepository
  .find()
  .join("posts", "users.id = posts.userId")
  .execute(client);`}
              language="typescript"
            />
          </Card>

          {/* scope() */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">scope()</h2>
            <CodeBlock code={`scope(name: string, ...args: any[]): QueryBuilder<T>`} language="typescript" />
            <p className="text-muted-foreground mb-4">Applies a named scope defined on your model.</p>
            <CodeBlock
              code={`const users = await userRepository
  .find()
  .scope("active")
  .execute(client);`}
              language="typescript"
            />
          </Card>

          {/* build() */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">build()</h2>
            <CodeBlock code={`build(): { query: string; params: any[] }`} language="typescript" />
            <p className="text-muted-foreground mb-4">Returns the final SQL query string and parameters before execution.</p>
            <CodeBlock
              code={`const qb = userRepository.find().select("id", "email").where("isActive = ?", true);
const { query, params } = qb.build();
// query: SELECT id, email FROM users WHERE isActive = ?
// params: [true]`}
              language="typescript"
            />
          </Card>

          {/* execute() */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">execute()</h2>
            <CodeBlock code={`async execute(client: DBClient, cache?: Cache, cacheKey?: string): Promise<T[]>`} language="typescript" />
            <p className="text-muted-foreground mb-4">Executes the query using the provided DBClient. Optionally supports cache.</p>
            <CodeBlock
              code={`const users = await userRepository
  .find()
  .where("isActive = ?", true)
  .limit(10)
  .execute(client, cache, "active_users_page_1");`}
              language="typescript"
            />
          </Card>
        </div>
      </div>
    </div>
  )
}