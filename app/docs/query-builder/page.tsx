"use client"

import { CodeBlock } from "@/components/code-block"

export default function QueryBuilderPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Query Builder</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Build complex queries with a fluent, chainable API. <br />
          The QueryBuilder provides a type-safe, database-agnostic interface for constructing SQL SELECT queries programmatically.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
            <CodeBlock
              filename="example/basic-query.ts"
              language="typescript"
              code={`const userRepository = stabilize.getRepository(User);

// Find all users (SELECT * FROM users)
const allUsers = await userRepository.find().execute();

// Select specific columns
const users = await userRepository
  .find()
  .select("id", "name", "email")
  .where("isActive = ?", true)
  .orderBy("createdAt DESC")
  .limit(10)
  .execute(dbClient);
`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Where Clauses</h2>
            <CodeBlock
              filename="example/where-query.ts"
              language="typescript"
              code={`// Add a single where clause
.find().where("age > ?", 18)

// Multiple conditions (AND)
.find()
.where("age > ?", 18)
.where("isActive = ?", true)

// All conditions are joined with AND
// WHERE age > ? AND isActive = ?
`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Joins</h2>
            <CodeBlock
              filename="example/join-query.ts"
              language="typescript"
              code={`// LEFT JOIN example
const usersWithPosts = await userRepository
  .find()
  .join("posts", "posts.userId = users.id")
  .select("users.id", "users.name", "posts.title")
  .execute();
`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Ordering, Limiting & Offsetting</h2>
            <CodeBlock
              filename="example/order-limit-offset.ts"
              language="typescript"
              code={`const page = 2;
const perPage = 10;

const users = await userRepository
  .find()
  .orderBy("lastName ASC")
  .limit(perPage)
  .offset((page - 1) * perPage)
  .execute();
`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Scopes</h2>
            <p className="text-muted-foreground mb-4">
              Apply reusable query fragments using scopes defined on your model:
            </p>
            <CodeBlock
              filename="example/scope.ts"
              language="typescript"
              code={`// Assuming a "active" scope is defined on User model
const activeUsers = await userRepository
  .find()
  .scope("active")
  .limit(10)
  .execute();
`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Caching</h2>
            <p className="text-muted-foreground mb-4">
              Use built-in cache-aside logic to speed up repeated queries:
            </p>
            <CodeBlock
              filename="example/cache.ts"
              language="typescript"
              code={`const users = await userRepository
  .find()
  .where("isActive = ?", true)
  .limit(10)
  .execute(dbClient, cache, "active_users_page_1"); // cacheKey is optional
`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Generated SQL Example</h2>
            <CodeBlock
              filename="example/built-query.ts"
              language="typescript"
              code={`const qb = userRepository
  .find()
  .select("id", "email")
  .where("isActive = ?", true)
  .orderBy("createdAt DESC")
  .limit(5);

const { query, params } = qb.build();
// query: SELECT id, email FROM users WHERE isActive = ? ORDER BY createdAt DESC LIMIT 5
// params: [true]
`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Full QueryBuilder API</h2>
            <CodeBlock
              filename="query-builder.ts"
              language="typescript"
              code={`queryBuilder
  .select(...fields: string[])
  .where(condition: string, ...params: any[])
  .join(table: string, condition: string)
  .orderBy(clause: string)
  .limit(limit: number)
  .offset(offset: number)
  .scope(name: string, ...args: any[])
  .build()
  .execute(client: DBClient, cache?: Cache, cacheKey?: string): Promise<T[]>`}
            />
          </section>
        </div>
      </div>
    </div>
  )
}