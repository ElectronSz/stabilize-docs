"use client";

import { CodeBlock } from "@/components/code-block";

export default function QueryBuilderExamplePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Query Builder Deep Dive</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Master the fluent query builder with joins, subqueries, CTEs, unions,
          and aggregations
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Select & Filtering</h2>
            <CodeBlock
              filename="examples/select-filter.ts"
              language="typescript"
              code={`// Select specific columns
const users = await userRepo.find().select("id", "name", "email").execute(orm.client);

// Select with alias
const results = await userRepo.find().as("u").select("u.name").execute(orm.client);

// Distinct values
const distinctNames = await userRepo.find().distinct().select("name").execute(orm.client);

// Where conditions
const active = await userRepo.find()
  .where("isActive = ?", true)
  .where("age >= ?", 18)
  .execute(orm.client);

// OR conditions
const admins = await userRepo.find()
  .where("role = ?", "admin")
  .orWhere("role = ?", "superadmin")
  .execute(orm.client);

// IN / NOT IN
const selected = await userRepo.find()
  .whereIn("id", [1, 2, 3, 4])
  .execute(orm.client);

// BETWEEN
const ageRange = await userRepo.find()
  .whereBetween("age", 18, 35)
  .execute(orm.client);

// LIKE / ILIKE
const searchResults = await userRepo.find()
  .whereLike("name", "%john%")
  .execute(orm.client);

// NULL checks
const noEmail = await userRepo.find()
  .whereNull("email")
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Joins</h2>
            <CodeBlock
              filename="examples/joins.ts"
              language="typescript"
              code={`// Inner join
const results = await userRepo.find()
  .innerJoin("posts", "users.id = posts.userId")
  .select("users.name", "posts.title")
  .execute(orm.client);

// Left join with aggregation
const userPostCounts = await userRepo.find()
  .leftJoin("posts", "users.id = posts.userId")
  .select("users.name", "COUNT(posts.id) as postCount")
  .groupBy("users.id", "users.name")
  .execute(orm.client);

// Multiple joins
const fullData = await orderRepo.find()
  .innerJoin("customers", "orders.customerId = customers.id")
  .innerJoin("order_items", "orders.id = order_items.orderId")
  .innerJoin("products", "order_items.productId = products.id")
  .select("customers.name", "products.name as product", "order_items.quantity")
  .execute(orm.client);

// Cross join
const combinations = await colorRepo.find()
  .crossJoin("sizes")
  .select("colors.name", "sizes.label")
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Aggregations</h2>
            <CodeBlock
              filename="examples/aggregations.ts"
              language="typescript"
              code={`// Count
const total = await userRepo.find().count("*").execute(orm.client);

// Sum, Avg, Min, Max
const stats = await productRepo.find()
  .select("SUM(price) as total", "AVG(price) as average", "MIN(price) as lowest", "MAX(price) as highest")
  .execute(orm.client);

// Group by with having
const categoryStats = await productRepo.find()
  .select("categoryId", "COUNT(*) as productCount", "AVG(price) as avgPrice")
  .groupBy("categoryId")
  .having("COUNT(*) > ?", 5)
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Subqueries & EXISTS</h2>
            <CodeBlock
              filename="examples/subqueries.ts"
              language="typescript"
              code={`// WHERE EXISTS
const usersWithPosts = await userRepo.find()
  .whereExists(
    "SELECT 1 FROM posts WHERE posts.userId = users.id"
  )
  .execute(orm.client);

// WHERE NOT EXISTS
const usersWithoutPosts = await userRepo.find()
  .whereNotExists(
    "SELECT 1 FROM posts WHERE posts.userId = users.id"
  )
  .execute(orm.client);

// Subquery in WHERE
const activeAuthors = await userRepo.find()
  .whereIn("id",
    postRepo.find().select("authorId").build().query
  )
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Common Table Expressions (CTEs)
            </h2>
            <CodeBlock
              filename="examples/ctes.ts"
              language="typescript"
              code={`// WITH clause
const qb = new QueryBuilder("orders");
const cte = new QueryBuilder("recent_orders")
  .select("*")
  .where("createdAt > ?", "2025-01-01");

const results = await qb
  .with("recent_orders", cte)
  .select("*")
  .join("recent_orders", "orders.id = recent_orders.id")
  .execute(orm.client);

// Recursive CTE (for hierarchical data)
const hierarchy = new QueryBuilder("categories");
const anchor = new QueryBuilder("categories")
  .select("*")
  .where("parentId IS NULL");
const recursive = new QueryBuilder("categories")
  .select("categories.*")
  .join("category_tree", "categories.parentId = category_tree.id");

const tree = await hierarchy
  .withRecursive("category_tree", anchor)
  .select("*")
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Unions & Locking</h2>
            <CodeBlock
              filename="examples/unions-locks.ts"
              language="typescript"
              code={`// UNION
const allNames = await userRepo.find()
  .select("name")
  .union(adminRepo.find().select("name"))
  .execute(orm.client);

// UNION ALL
const combined = await activeUsersQB
  .unionAll(inactiveUsersQB)
  .execute(orm.client);

// SELECT FOR UPDATE (pessimistic locking)
const lockedUser = await userRepo.find()
  .where("id = ?", 1)
  .forUpdate()
  .execute(orm.client);

// SELECT FOR SHARE
const sharedData = await productRepo.find()
  .where("id = ?", productId)
  .forShare()
  .execute(orm.client);

// Pagination
const page = await userRepo.find()
  .orderBy("createdAt", "DESC")
  .paginate(1, 20)
  .execute(orm.client);`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
