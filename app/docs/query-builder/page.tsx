"use client";

import { CodeBlock } from "@/components/code-block";

export default function QueryBuilderPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Query Builder</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Build complex queries with a fluent, chainable API. The QueryBuilder
          provides a database-agnostic interface for constructing SQL queries
          programmatically.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
            <CodeBlock
              filename="examples/basic-query.ts"
              language="typescript"
              code={`const userRepo = orm.getRepository(User);

// Find all users
const allUsers = await userRepo.find().execute(orm.client);

// Select specific columns
const users = await userRepo
  .find()
  .select("id", "name", "email")
  .where("isActive = ?", true)
  .orderBy("createdAt", "DESC")
  .limit(10)
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Where Clauses</h2>
            <CodeBlock
              filename="examples/where-clauses.ts"
              language="typescript"
              code={`// Basic WHERE (AND)
const active = await userRepo
  .find()
  .where("age > ?", 18)
  .where("isActive = ?", true)
  .execute(orm.client);

// OR conditions
const admins = await userRepo
  .find()
  .where("role = ?", "admin")
  .orWhere("role = ?", "superadmin")
  .execute(orm.client);

// IN clause
const selected = await userRepo
  .find()
  .whereIn("id", [1, 2, 3])
  .execute(orm.client);

// NOT IN
const excluded = await userRepo
  .find()
  .whereNotIn("status", ["banned", "deleted"])
  .execute(orm.client);

// BETWEEN
const ageRange = await userRepo
  .find()
  .whereBetween("age", 18, 35)
  .execute(orm.client);

// LIKE
const searchResults = await userRepo
  .find()
  .whereLike("name", "%john%")
  .execute(orm.client);

// NULL checks
const noEmail = await userRepo
  .find()
  .whereNull("email")
  .execute(orm.client);

const hasEmail = await userRepo
  .find()
  .whereNotNull("email")
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Joins</h2>
            <CodeBlock
              filename="examples/joins.ts"
              language="typescript"
              code={`// Inner join
const results = await userRepo
  .find()
  .innerJoin("posts", "users.id = posts.authorId")
  .select("users.name", "posts.title")
  .execute(orm.client);

// Left join with aggregation
const userPostCounts = await userRepo
  .find()
  .leftJoin("posts", "users.id = posts.authorId")
  .select("users.name", "COUNT(posts.id) as postCount")
  .groupBy("users.id", "users.name")
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Ordering, Limiting & Pagination
            </h2>
            <CodeBlock
              filename="examples/pagination.ts"
              language="typescript"
              code={`// Limit and offset
const page2 = await userRepo
  .find()
  .orderBy("createdAt", "DESC")
  .limit(10)
  .offset(10)
  .execute(orm.client);

// Built-in pagination
const page = await userRepo.paginate(1, 20);
// Returns: { data: [...], total: N, page: 1, pageSize: 20 }

// Cursor-based pagination
const page1 = await userRepo.findMany({
  take: 10,
  orderBy: { field: "id", direction: "ASC" },
});

const lastId = page1[page1.length - 1]?.id;
const page2 = await userRepo.findMany({
  cursor: { field: "id", value: lastId, direction: "forward" },
  take: 10,
  orderBy: { field: "id", direction: "ASC" },
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Aggregations</h2>
            <CodeBlock
              filename="examples/aggregations.ts"
              language="typescript"
              code={`// Count
const total = await userRepo.count();
const activeCount = await userRepo.count({ isActive: true });

// Check existence
const exists = await userRepo.exists({ email: "alice@example.com" });

// Aggregate functions
const stats = await userRepo.aggregate({
  count: "*",
  avg: ["age"],
  min: ["age"],
  max: ["age"],
});
// Returns: { count_all: 100, avg_age: 28.5, min_age: 18, max_age: 65 }

// Distinct count
const distinctAges = await userRepo.countDistinct("age");

// Pluck single column
const emails = await userRepo.pluck("email");`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Scopes</h2>
            <p className="text-muted-foreground mb-4">
              Apply reusable query fragments defined on your model:
            </p>
            <CodeBlock
              filename="examples/scopes.ts"
              language="typescript"
              code={`const activeUsers = await userRepo
  .scope("active")
  .limit(10)
  .execute(orm.client);

// Chain multiple scopes
const activeAdmins = await userRepo
  .scope("active")
  .scope("byRole", "admin")
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Subqueries & EXISTS</h2>
            <CodeBlock
              filename="examples/subqueries.ts"
              language="typescript"
              code={`// WHERE EXISTS
const usersWithPosts = await userRepo
  .find()
  .whereExists("SELECT 1 FROM posts WHERE posts.authorId = users.id")
  .execute(orm.client);

// WHERE NOT EXISTS
const usersWithoutPosts = await userRepo
  .find()
  .whereNotExists("SELECT 1 FROM posts WHERE posts.authorId = users.id")
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Unions & Locking</h2>
            <CodeBlock
              filename="examples/unions-locks.ts"
              language="typescript"
              code={`// UNION
const allNames = await userRepo
  .find()
  .select("name")
  .union(adminRepo.find().select("name"))
  .execute(orm.client);

// Pessimistic locking
const lockedUser = await userRepo
  .find()
  .where("id = ?", 1)
  .forUpdate()
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Build Without Executing
            </h2>
            <CodeBlock
              filename="examples/build.ts"
              language="typescript"
              code={`const qb = userRepo
  .find()
  .select("id", "email")
  .where("isActive = ?", true)
  .orderBy("createdAt", "DESC")
  .limit(5);

const { query, params } = qb.build();
// query: SELECT id, email FROM users WHERE users.deletedAt IS NULL AND isActive = ? ORDER BY createdAt DESC LIMIT 5
// params: [true]`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
